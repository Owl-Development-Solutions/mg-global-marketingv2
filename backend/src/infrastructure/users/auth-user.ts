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
import { processBinaryVolumeUpstream } from "../../utils/helpers/process-upstream-geonology";

export const registerUserIn = async (
  user: RegisterData,
): Promise<Result<SuccessResponse, ErrorResponse>> => {
  const db = connection();
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // ================= VALIDATION =================

    if (
      !user.email ||
      !user.password ||
      !user.sponsor ||
      !user.upline ||
      !user.position ||
      !user.pin
    ) {
      await conn.rollback();
      return {
        success: false,
        error: { errorMessage: "Missing Required Fields", statusCode: 400 },
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      await conn.rollback();
      return {
        success: false,
        error: { errorMessage: "Invalid email format", statusCode: 400 },
      };
    }

    if (user.position !== "[L]" && user.position !== "[R]") {
      await conn.rollback();
      return {
        success: false,
        error: {
          errorMessage: "Invalid Position. Must be [L] or [R].",
          statusCode: 400,
        },
      };
    }

    const sideColumn = user.position === "[L]" ? "LeftChildId" : "RightChildId";

    // ================= EMAIL CHECK =================

    const [emailCheck] = await conn.execute(
      "SELECT id FROM users WHERE email = ?",
      [user.email.trim()],
    );

    if ((emailCheck as any[]).length > 0) {
      await conn.rollback();
      return {
        success: false,
        error: { errorMessage: "Email already registered", statusCode: 409 },
      };
    }

    // ================= SPONSOR CHECK =================

    const [sponsorCheck] = await conn.execute(
      "SELECT id FROM users WHERE userName = ?",
      [user.sponsor],
    );

    if ((sponsorCheck as any[]).length === 0) {
      await conn.rollback();
      return {
        success: false,
        error: {
          errorMessage: `Sponsor ID (${user.sponsor}) not found`,
          statusCode: 400,
        },
      };
    }

    const actualSponsorId = (sponsorCheck as any[])[0].id;

    // ================= UPLINE CHECK =================

    const [uplineCheck] = await conn.execute(
      "SELECT id FROM users WHERE username = ?",
      [user.upline],
    );

    if ((uplineCheck as any[]).length === 0) {
      await conn.rollback();
      return {
        success: false,
        error: {
          errorMessage: `Upline ID (${user.upline}) not found`,
          statusCode: 400,
        },
      };
    }

    const actualUplineId = (uplineCheck as any[])[0].id;

    // ================= ACTIVATION CODE (ATOMIC) =================
    // This prevents double usage without FOR UPDATE

    const [activationUpdate] = await conn.execute(
      `UPDATE activation_codes 
       SET status = 'Used'
       WHERE code = ? AND status = 'Active'`,
      [user.pin.trim()],
    );

    if ((activationUpdate as ResultSetHeader).affectedRows === 0) {
      await conn.rollback();
      return {
        success: false,
        error: {
          statusCode: 404,
          errorMessage: "Activation code is invalid or already used.",
        },
      };
    }

    const [activationCodeRow] = await conn.execute(
      "SELECT id FROM activation_codes WHERE code = ?",
      [user.pin.trim()],
    );

    const activationCodeIdFromDB = (activationCodeRow as any[])[0].id;

    // ================= CREATE USER =================

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(user.password, salt);
    const { v4: uuidv4 } = await import("uuid");
    const newUserId = uuidv4();

    const userFullName = `${user.firstName} ${user.middleName ?? ""} ${user.lastName}`;

    await conn.execute(
      `INSERT INTO users 
      (id, firstName, lastName, middleName, userName, name, email, password, birthDate, parentId, activationCodeId, sponsorId) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newUserId,
        user.firstName,
        user.lastName,
        user.middleName,
        user.username,
        userFullName.trim(),
        user.email,
        hash,
        user.birthDate,
        actualUplineId,
        activationCodeIdFromDB,
        actualSponsorId,
      ],
    );

    // ================= ATOMIC SLOT PLACEMENT =================

    const [slotUpdate] = await conn.execute(
      `UPDATE users 
       SET ${sideColumn} = ?
       WHERE id = ? AND ${sideColumn} IS NULL`,
      [newUserId, actualUplineId],
    );

    if ((slotUpdate as ResultSetHeader).affectedRows === 0) {
      await conn.rollback();
      return {
        success: false,
        error: {
          statusCode: 409,
          errorMessage: "Upline slot already occupied.",
        },
      };
    }

    // ================= USER STATS =================

    await conn.execute(
      `INSERT INTO user_stats 
       (userId, balance, leftPoints, rightPoints, leftDownline, rightDownline, rankPoints, level, sidePath, hasDeduction) 
       VALUES (?, 0, 0, 0, 0, 0, 0, 0, 'root', false)`,
      [newUserId],
    );

    await conn.execute(
      `UPDATE user_stats 
       SET normalWallet = normalWallet + 500 
       WHERE userId = ?`,
      [actualUplineId],
    );

    await conn.execute(
      `INSERT INTO transactions 
       (userId, type, walletType, amount, transactionDirection, description, referenceId) 
       VALUES (?, 'Referral Bonus', 'normalWallet', 500, 'Credit', ?, ?)`,
      [
        actualUplineId,
        `Direct referral bonus for new user ${user.username}`,
        newUserId,
      ],
    );

    const placementSide = user.position === "[L]" ? "Left" : "Right";
    await processBinaryVolumeUpstream(conn, actualUplineId, placementSide);

    await conn.commit();

    return {
      success: true,
      data: {
        statusCode: 200,
        message: "User registered successfully",
      },
    };
  } catch (error) {
    await conn.rollback();
    return {
      success: false,
      error: {
        statusCode: 500,
        errorMessage: error instanceof Error ? error.message : String(error),
      },
    };
  } finally {
    conn.release();
  }
};

export const loginUserIn = async (
  data: User,
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
