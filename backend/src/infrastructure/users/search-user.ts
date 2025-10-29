import { connection } from "../../config/mysql.db";
import { ErrorResponse, Result, SuccessResponse, User } from "../../utils";

export const isUsernameUsed = async (
  username: string
): Promise<Result<SuccessResponse<string>, ErrorResponse>> => {
  try {
    if (!username) {
      return {
        success: false,
        error: {
          statusCode: 400,
          errorMessage: "Missing username",
        },
      };
    }

    const db = connection();

    const [rows] = await db.execute(
      "SELECT id FROM users WHERE userName = ? LIMIT 1",
      [username]
    );
    const users = rows as User[];

    if (users.length > 0) {
      return {
        success: false,
        error: {
          statusCode: 409,
          errorMessage: "The provided username is already in use.",
        },
      };
    }

    return {
      success: true,
      data: {
        statusCode: 200,
        message: "Username is available.",
        data: "Username is available.",
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
