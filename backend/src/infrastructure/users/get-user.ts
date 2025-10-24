import { connection } from "../../config/mysql.db";
import {
  ErrorResponse,
  JWTProps,
  Result,
  SuccessResponse,
  User,
  UserResponse,
  verifyRefreshToken,
} from "../../utils";

export const getUserByAccessToken = async (
  token: string
): Promise<Result<SuccessResponse<UserResponse>, ErrorResponse>> => {
  try {
    if (!token) {
      return {
        success: false,
        error: {
          statusCode: 401,
          errorMessage: "Missing access token",
        },
      };
    }

    const decoded = verifyRefreshToken(token);

    if (!decoded) {
      return {
        success: false,
        error: {
          statusCode: 401,
          errorMessage: "Invalid or expired token",
        },
      };
    }

    const db = connection();

    const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [
      decoded.id,
    ]);
    const users = rows as User[];

    if (users.length === 0) {
      return {
        success: false,
        error: {
          statusCode: 404,
          errorMessage: "User not found",
        },
      };
    }

    const user = users[0];

    const response: UserResponse = {
      id: user!.id,
      type: user!.role,
      attributes: {
        firstName: user!.firstName,
        lastName: user!.lastName,
        name: user!.name,
        email: user!.email,
        role: user!.role,
      } as any,
      accessToken: token,
      refreshToken: user!.refreshToken,
    };

    return {
      success: true,
      data: {
        statusCode: 200,
        message: "User fetched successfully",
        data: response,
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
