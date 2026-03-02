import { ResultSetHeader } from "mysql2";
import { connection } from "../../config/mysql.db";
import {
  EditUserData,
  ErrorResponse,
  Result,
  SuccessResponse,
} from "../../utils";

export const updateUser = async (
  user: EditUserData,
): Promise<Result<SuccessResponse, ErrorResponse>> => {
  const db = connection();
  try {
    const query = `
            UPDATE users
            SET firstName = ?,
                lastName = ?,
                address = ?,
                contactNumber = ?,
                birthDate = ?,
                updated_at = NOW()
            WHERE id = ?
        `;

    const [result] = await db.execute(query, [
      user.firstName,
      user.lastName,
      user.address,
      user.contactNumber,
      user.birthDate,
      user.id,
    ]);

    const innerResult = result as ResultSetHeader;

    if (innerResult.affectedRows === 0) {
      return {
        success: false,
        error: {
          statusCode: 404,
          errorMessage: "User not found",
        },
      };
    }

    return {
      success: true,
      data: {
        statusCode: 200,
        message: "User updated successfully",
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        statusCode: 500,
        errorMessage: error instanceof Error ? error.message : String(error),
      },
    };
  }
};
