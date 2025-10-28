import { ResultSetHeader } from "mysql2";

import {
  AuthResponse,
  ErrorResponse,
  generateAccessToken,
  generateRefreshToken,
  generateUniqueIdentifier,
  Result,
  saveRefreshToken,
  SuccessResponse,
  User,
  UserResponse,
} from "../../utils";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import { connection } from "../../config/mysql.db";
import { v4 as uuidv4 } from "uuid";

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

    const db = connection();

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

    //has the password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(user.password, salt);
    const newUserId = uuidv4();

    //hardcoded for now for registering user  => role is user
    const role = "admin";

    const [result] = await db.execute(
      "INSERT INTO users (`id`, `firstName`, `lastName`, `userName`, `name`, `email`, `password`, `role`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        newUserId,
        user.firstName,
        user.lastName,
        user.userName,
        user.name,
        user.email,
        hash,
        role,
      ]
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

    await db.execute(
      `INSERT INTO user_stats (
      userId, balance, leftPoints, rightPoints, leftDownline, rightDownline, rankPoints, level, sidePath, hasDeduction
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [newUserId, 0.0, 0, 0, 0, 0, 0, 0, "root", false]
    );

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
): Promise<Result<SuccessResponse<AuthResponse>, ErrorResponse>> => {
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

    const db = connection();

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

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await saveRefreshToken(user.id, refreshToken);

    const response: AuthResponse = {
      accessToken,
    };

    return {
      success: true,
      data: {
        statusCode: 200,
        message: "Login successfull",
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

export const logout = async () => {};
