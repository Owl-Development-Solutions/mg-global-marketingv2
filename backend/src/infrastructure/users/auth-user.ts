import { ResultSetHeader } from "mysql2";

import {
  ActivationCode,
  AuthResponse,
  ErrorResponse,
  generateAccessToken,
  generateRefreshToken,
  RegisterData,
  Result,
  saveRefreshToken,
  SuccessResponse,
  User,
  UserResponse,
} from "../../utils";
import bcrypt from "bcryptjs";
import { connection } from "../../config/mysql.db";
import { v4 as uuidv4 } from "uuid";

export const registerUserIn = async (
  user: RegisterData
): Promise<Result<SuccessResponse, ErrorResponse>> => {
  try {
    if (
      !user.email ||
      !user.password ||
      !user.sponsor ||
      !user.upline ||
      !user.position
    ) {
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

    const sideColumn = user.position === "[L]" ? "LeftChildId" : "rightChildId";

    if (user.position !== "[L]" && user.position !== "[R]") {
      return {
        success: false,
        error: {
          errorMessage: "Invalid Position. Must be [L] or [R].",
          statusCode: 400,
        },
      };
    }

    const [emailCheck] = await db.execute(
      "SELECT * FROM `users` WHERE `email` = ?",
      [user.email]
    );

    if ((emailCheck as any[]).length > 0) {
      return {
        success: false,
        error: {
          errorMessage: "Email is aldready registered",
          statusCode: 409,
        },
      };
    }

    const [sponsorCheck] = await db.execute(
      "SELECT id FROM `users` WHERE `userName` = ?",
      [user.sponsor]
    );

    if ((sponsorCheck as any[]).length === 0) {
      return {
        success: false,
        error: {
          errorMessage: `Sponsor ID (${user.sponsor}) not found`,
          statusCode: 400,
        },
      };
    }

    const sponsorUsers = sponsorCheck as any[];
    const sponsorUser = sponsorUsers[0];

    const actualSponsorId = sponsorUser.id;

    const [uplineCheck] = await db.execute(
      `SELECT id, ${sideColumn} FROM users WHERE username = ? FOR UPDATE`,
      [user.upline]
    );

    const uplines = uplineCheck as any[];
    const upline = uplines[0];

    if (!upline) {
      return {
        success: false,
        error: {
          errorMessage: `Upline ID (${user.upline}) not found`,
          statusCode: 400,
        },
      };
    }

    if (upline[sideColumn]) {
      const sideName = user.position === "[L]" ? "Left" : "Right";
      return {
        success: false,
        error: {
          statusCode: 409,
          errorMessage: `Upline slot on the ${sideName} side is already occupied`,
        },
      };
    }

    const actualUplineId = upline.id;

    //activation-codes
    const [codes] = await db.execute(
      `SELECT id, status FROM activation_codes WHERE code = ? FOR UPDATE`,
      [user.pin]
    );

    const codeRecords = codes as ActivationCode[];
    const code = codeRecords[0];

    if (!code) {
      return {
        success: false,
        error: {
          statusCode: 404,
          errorMessage: "Activation code is invalid or not found.",
        },
      };
    }

    const activationCodeIdFromDB = code.id;

    //has the password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(user.password, salt);
    const newUserId = uuidv4();

    const userFullName =
      user.firstName + " " + user.middleName + " " + user.lastName;

    //insert into users table
    const [result] = await db.execute(
      "INSERT INTO users (`id`, `firstName`, `lastName`, `middleName`, `userName`, `name`, `email`, `password`, `birthDate`, `parentId`, `sponsorId`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        newUserId,
        user.firstName,
        user.lastName,
        user.middleName,
        user.username,
        userFullName,
        user.email,
        hash,
        user.birthDate,
        actualUplineId,
        actualSponsorId,
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

    await db.execute(`UPDATE users SET ${sideColumn} = ? WHERE id = ?`, [
      newUserId,
      actualUplineId,
    ]);

    await db.execute(`UPDATE activation_codes SET status = ? WHERE id = ?`, [
      "Used",
      activationCodeIdFromDB,
    ]);

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

    const response: UserResponse = {
      id: user!.id,
      type: user!.role,
      attributes: {
        firstName: user!.firstName,
        lastName: user!.lastName,
        name: user!.name,
        email: user!.email,
        username: user!.userName,
        role: user!.role,
      } as any,
      accessToken: accessToken,
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
