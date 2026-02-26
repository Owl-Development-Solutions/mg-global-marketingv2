import { ResultSetHeader } from "mysql2";
import {
  ErrorResponse,
  Result,
  SuccessResponse,
  User,
} from "../../utils";
import { connection } from "../../config/mysql.db";

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  profileImage?: string | undefined;
}

export type UpdateUserResponse = Result<SuccessResponse<User>, ErrorResponse>;

export const updateUserIn = async (
  userId: string,
  userData: UpdateUserData
): Promise<UpdateUserResponse> => {
  try {
    console.log('=== UPDATE USER INFRASTRUCTURE DEBUG ===');
    console.log('User ID:', userId);
    console.log('User data:', userData);
    
    const db = connection();
    
    // Check if user exists
    const [existingUser] = await db.execute(
      "SELECT id FROM users WHERE id = ?",
      [userId]
    );
    
    console.log('Existing user check:', (existingUser as any[]).length > 0 ? 'found' : 'not found');
    
    if ((existingUser as any[]).length === 0) {
      return {
        success: false,
        error: {
          statusCode: 404,
          errorMessage: "User not found",
        },
      };
    }

    // Build dynamic update query
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (userData.firstName !== undefined) {
      updateFields.push("firstName = ?");
      updateValues.push(userData.firstName);
    }

    if (userData.lastName !== undefined) {
      updateFields.push("lastName = ?");
      updateValues.push(userData.lastName);
    }

    if (userData.email !== undefined) {
      // Check if email is already taken by another user
      const [emailCheck] = await db.execute(
        "SELECT id FROM users WHERE email = ? AND id != ?",
        [userData.email, userId]
      );

      if ((emailCheck as any[]).length > 0) {
        return {
          success: false,
          error: {
            errorMessage: "Email is already taken by another user",
            statusCode: 409,
          },
        };
      }

      updateFields.push("email = ?");
      updateValues.push(userData.email);
    }

    if (userData.username !== undefined) {
      // Check if username is already taken by another user
      const [usernameCheck] = await db.execute(
        "SELECT id FROM users WHERE userName = ? AND id != ?",
        [userData.username, userId]
      );

      if ((usernameCheck as any[]).length > 0) {
        return {
          success: false,
          error: {
            errorMessage: "Username is already taken by another user",
            statusCode: 409,
          },
        };
      }

      updateFields.push("userName = ?");
      updateValues.push(userData.username);
    }

    if (userData.profileImage !== undefined) {
      // Check if profileImage column exists before trying to update it
      try {
        const [columnCheck] = await db.execute(
          "SHOW COLUMNS FROM users LIKE 'profileImage'"
        );
        
        if ((columnCheck as any[]).length > 0) {
          updateFields.push("profileImage = ?");
          updateValues.push(userData.profileImage);
        }
      } catch (error) {
        // Column doesn't exist, skip profileImage update
        console.log('profileImage column does not exist, skipping...');
      }
    }

    if (updateFields.length === 0) {
      return {
        success: false,
        error: {
          errorMessage: "No valid fields to update",
          statusCode: 400,
        },
      };
    }

    // Update the name field if firstName or lastName is being updated
    if (userData.firstName !== undefined || userData.lastName !== undefined) {
      // Get current user data to construct full name
      const [currentUser] = await db.execute(
        "SELECT firstName, lastName, middleName FROM users WHERE id = ?",
        [userId]
      );

      const users = currentUser as any[];
      if (users.length > 0) {
        const user = users[0];
        const firstName = userData.firstName || user.firstName;
        const lastName = userData.lastName || user.lastName;
        const middleName = user.middleName || '';
        
        const fullName = `${firstName} ${middleName} ${lastName}`.replace(/\s+/g, ' ').trim();
        
        updateFields.push("name = ?");
        updateValues.push(fullName);
      }
    }

    // Add userId to the values array for the WHERE clause
    updateValues.push(userId);

    // Execute the update query
    const [result] = await db.execute(
      `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`,
      updateValues
    );

    const updateResult = result as ResultSetHeader;

    if (updateResult.affectedRows === 0) {
      return {
        success: false,
        error: {
          errorMessage: "Failed to update user",
          statusCode: 500,
        },
      };
    }

    // Get the updated user data
    let selectQuery = "SELECT id, firstName, lastName, middleName, userName, name, email, role";
    
    // Check if profileImage column exists before including it in SELECT
    try {
      const [columnCheck] = await db.execute(
        "SHOW COLUMNS FROM users LIKE 'profileImage'"
      );
      
      if ((columnCheck as any[]).length > 0) {
        selectQuery += ", profileImage";
      }
    } catch (error) {
      // Column doesn't exist, skip it
    }
    
    selectQuery += " FROM users WHERE id = ?";
    
    const [updatedUser] = await db.execute(selectQuery, [userId]);

    const users = updatedUser as User[];
    const user = users[0];

    if (!user) {
      return {
        success: false,
        error: {
          errorMessage: "Failed to retrieve updated user data",
          statusCode: 500,
        },
      };
    }

    return {
      success: true,
      data: {
        statusCode: 200,
        message: "User updated successfully",
        data: user,
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
