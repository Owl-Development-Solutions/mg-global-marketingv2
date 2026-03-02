import { connection } from "../../config/mysql.db";
import { ErrorResponse, Result, SuccessResponse, User } from "../../utils";
import {
  collectDescendantsForDeletion,
  decrementUplineDownlineCounts,
} from "../../utils/helpers/genology-helper";

/**
 * Delete's a user and their entire downline sub-tree, updating all related records
 * and resetting activation codes in an atomic transaction
 * https://medium.com/@estheraladioche569/atomic-transaction-97fe50a3f8e4
 *
 */
export const deleteGeanologyUser = async (
  userIdToDelete: string,
): Promise<Result<SuccessResponse<string>, ErrorResponse>> => {
  const allUserIdsToDelete: string[] = [];
  const allActivationCodesToReset: string[] = [];
  const db = connection();

  try {
    // collect all ids in the sub-tree (Staring with the user to delete)
    await collectDescendantsForDeletion(
      db,
      userIdToDelete,
      allUserIdsToDelete,
      allActivationCodesToReset,
    );

    if (allUserIdsToDelete.length === 0) {
      return {
        success: false,
        error: {
          statusCode: 400,
          errorMessage: "User not found or sub-tree already deleted",
        },
      };
    }

    /**
     * FIND PARENT (UPLINE) AND UPDATE POINTER TO NULL
     */

    //Find the parent whose child pointer points to the user being deleted (userIdToDelete)
    const [parentCheck] = await db.execute(
      `SELECT id, leftChildId, rightChildId
             FROM users
             WHERE leftChildId = ? OR rightChildId = ? FOR UPDATE
            `,
      [userIdToDelete, userIdToDelete],
    );

    const parentDataz = parentCheck as User[];
    const parentData = parentDataz[0];

    if (parentData) {
      const parentId = parentData.id;
      let parentSideColumn: string;
      let side: "[L]" | "[R]";

      if (parentData.leftChildId === userIdToDelete) {
        parentSideColumn = "leftChildId";
        side = "[L]";
      } else {
        parentSideColumn = "rightChildId";
        side = "[R]";
      }

      //Set the parent's pointer to the deleted user to null
      await db.execute(
        `UPDATE users SET ${parentSideColumn} = NULL WHERE id = ?`,
        [parentId],
      );

      /**
       * DECREMENT UPLINE COUNTS
       */

      /**
       * The downline count must be decremented by the *total* number of users deleted in the sub-tree.
       * Since the `decrementUplineDownlineCounts` only subtracts 1, we must execute the bulk subtraction manually.
       */

      const downlineColumn = side === "[L]" ? "leftDownline" : "rightDownline";

      await db.execute(
        `UPDATE user_stats SET ${downlineColumn} = ${downlineColumn} - ? WHERE userId = ?`,
        [allUserIdsToDelete.length, parentData.id],
      );

      /**
       * Use the original recursive function starting from the parent
       * to decrement the downline count for the entire branch of the parent's ancestors
       */

      await decrementUplineDownlineCounts(db, parentId, side);
    }

    const placeholders = allUserIdsToDelete.map(() => "?").join(",");

    /**
     * BULK RE-ACTIVATE ACTIVATION CODES
     */
    if (allActivationCodesToReset.length > 0) {
      const codePlaceholders = allActivationCodesToReset
        .map(() => "?")
        .join(",");
      await db.execute(
        `UPDATE activation_codes SET status = 'Active' WHERE id IN (${codePlaceholders})`,
        allActivationCodesToReset,
      );
    }

    /**
     * BULK DELETE RECORDS
     */

    //Delete from user_stats
    await db.execute(
      `DELETE FROM user_stats WHERE userId IN (${placeholders})`,
      allUserIdsToDelete,
    );

    //Delete from code_usages
    await db.execute(
      `DELETE FROM code_usages WHERE userId IN (${placeholders})`,
      allUserIdsToDelete,
    );

    //Delete from users
    await db.execute(
      `DELETE FROM users WHERE id IN (${placeholders})`,
      allUserIdsToDelete,
    );

    return {
      success: true,
      data: {
        statusCode: 200,
        message: `${allUserIdsToDelete.length} user(s) and their entire sub-tree was deleted successfully`,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        statusCode: 500,
        errorMessage: `Deletion failed: ${error instanceof Error ? error.message : String(error)}`,
      },
    };
  }
};
