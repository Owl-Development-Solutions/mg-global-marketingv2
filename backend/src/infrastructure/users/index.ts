import { ResultSetHeader } from "mysql2";
import { connection } from "../../config/mysql.db";
import {
  ErrorResponse,
  generateUniqueIdentifier,
  Result,
  SuccessResponse,
  User,
  UserResponse,
} from "../../utils";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";

export const registerUserIn = async (
  user: User
): Promise<Result<SuccessResponse, ErrorResponse>> => {
  try {
    if (!user.email || !user.password) {
      return {
        success: false,
        error: {
          errorMessage: "Missing Required Fields",
          statusCode: 400,
        },
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      return {
        success: false,
        error: {
          errorMessage: "Invalid email format",
          statusCode: 400,
        },
      };
    }

    const db = await connection;

    const [rows] = await db.execute("SELECT * FROM `users` WHERE `email` = ?", [
      user.email,
    ]);

    if ((rows as any[]).length > 0) {
      return {
        success: false,
        error: {
          errorMessage: "Email is aldready registered",
          statusCode: 409,
        },
      };
    }

    const id = randomUUID();

    //has the password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(user.password, salt);
    const uniqueId = generateUniqueIdentifier();

    //hardcoded for now for registering user  => role is user
    const role = "admin";

    const [result] = await db.execute(
      "INSERT INTO users (`id`, `name`, `email`, `password`, `role`) VALUES (?, ?, ?, ?, ?)",
      [id, user.name, user.email, hash, role]
    );

    //error when inserting in the database
    const insertResult = result as ResultSetHeader;

    if (insertResult.affectedRows === 0) {
      return {
        success: false,
        error: {
          statusCode: 500,
          errorMessage: "Failed to insert user",
        },
      };
    }

    return {
      success: true,
      data: {
        statusCode: 200,
        message: "User registered successfully",
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

export const loginUserIn = async (
  data: User
): Promise<Result<SuccessResponse<UserResponse>, ErrorResponse>> => {
  try {
    if (!data.email || !data.password) {
      return {
        success: false,
        error: {
          errorMessage: "Email and Password are required",
          statusCode: 400,
        },
      };
    }

    const db = await connection;

    //check if the user exists
    const [rows] = await db.execute("SELECT * FROM users where email = ?", [
      data.email,
    ]);

    const users = rows as User[];

    if (users.length === 0) {
      return {
        success: false,
        error: {
          errorMessage: "User not found",
          statusCode: 404,
        },
      };
    }

    const user = users[0]!;

    //compare password to hashed one
    const isMatch = await bcrypt.compare(data.password, user?.password);

    if (!isMatch) {
      return {
        success: false,
        error: {
          errorMessage: "Incorrect password",
          statusCode: 424,
        },
      };
    }

    const secret = process.env.JWT_SECRET;

    //generate JWT Token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret!
    );

    const response: UserResponse = {
      id: user.id,
      type: user.role,
      attributes: {
        first_name: user.first_name,
        last_name: user.last_name,
        name: user.name,
        email: user.email,
        role: user.role,
      } as any,
      token: token,
    };

    return {
      success: true,
      data: {
        statusCode: 200,
        message: "Login successfull",
        data: response as any,
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
