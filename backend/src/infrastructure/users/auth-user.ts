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
import {
  processBinaryVolumeUpstream,
  processBinaryVolumeUpstreamv1,
} from "../../utils/helpers/process-upstream-geonology";

// export const registerUserIn = async (
//   user: RegisterData,
// ): Promise<Result<SuccessResponse, ErrorResponse>> => {
//   try {
//     if (
//       !user.email ||
//       !user.password ||
//       !user.sponsor ||
//       !user.upline ||
//       !user.position
//     ) {
//       return {
//         success: false,
//         error: {
//           errorMessage: "Missing Required Fields",
//           statusCode: 400,
//         },
//       };
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(user.email)) {
//       return {
//         success: false,
//         error: {
//           errorMessage: "Invalid email format",
//           statusCode: 400,
//         },
//       };
//     }

//     const db = connection();

//     const sideColumn = user.position === "[L]" ? "LeftChildId" : "rightChildId";

//     if (user.position !== "[L]" && user.position !== "[R]") {
//       return {
//         success: false,
//         error: {
//           errorMessage: "Invalid Position. Must be [L] or [R].",
//           statusCode: 400,
//         },
//       };
//     }

//     const [emailCheck] = await db.execute(
//       "SELECT * FROM `users` WHERE `email` = ?",
//       [user.email],
//     );

//     if ((emailCheck as any[]).length > 0) {
//       return {
//         success: false,
//         error: {
//           errorMessage: "Email is aldready registered",
//           statusCode: 409,
//         },
//       };
//     }

//     // username check
//     const [rows] = await db.execute(
//       "SELECT id FROM users WHERE userName = ? LIMIT 1",
//       [user.username],
//     );
//     const users = rows as User[];

//     if (users.length > 0) {
//       return {
//         success: false,
//         error: {
//           statusCode: 409,
//           errorMessage: "The provided username is already in use.",
//         },
//       };
//     }

//     const [sponsorCheck] = await db.execute(
//       "SELECT id FROM `users` WHERE `userName` = ?",
//       [user.sponsor],
//     );

//     if ((sponsorCheck as any[]).length === 0) {
//       return {
//         success: false,
//         error: {
//           errorMessage: `Sponsor ID (${user.sponsor}) not found`,
//           statusCode: 400,
//         },
//       };
//     }

//     const sponsorUsers = sponsorCheck as any[];
//     const sponsorUser = sponsorUsers[0];

//     const actualSponsorId = sponsorUser.id;

//     const [uplineCheck] = await db.execute(
//       `SELECT id, ${sideColumn} FROM users WHERE username = ? FOR UPDATE`,
//       [user.upline],
//     );

//     const uplines = uplineCheck as any[];
//     const upline = uplines[0];

//     if (!upline) {
//       return {
//         success: false,
//         error: {
//           errorMessage: `Upline ID (${user.upline}) not found`,
//           statusCode: 400,
//         },
//       };
//     }

//     if (upline[sideColumn]) {
//       const sideName = user.position === "[L]" ? "Left" : "Right";
//       return {
//         success: false,
//         error: {
//           statusCode: 409,
//           errorMessage: `Upline slot on the ${sideName} side is already occupied`,
//         },
//       };
//     }

//     const actualUplineId = upline.id;

//     //activation-codes
//     const [codes] = await db.execute(
//       `SELECT id, status FROM activation_codes WHERE code = ? FOR UPDATE`,
//       [user.pin],
//     );

//     const codeRecords = codes as ActivationCode[];
//     const code = codeRecords[0];

//     if (!code) {
//       return {
//         success: false,
//         error: {
//           statusCode: 404,
//           errorMessage: "Activation code is invalid or not found.",
//         },
//       };
//     }

//     const activationCodeIdFromDB = code.id;

//     //has the password
//     const salt = bcrypt.genSaltSync(10);
//     const hash = bcrypt.hashSync(user.password, salt);
//     const { v4: uuidv4 } = await import("uuid");
//     const newUserId = uuidv4();

//     const userFullName =
//       user.firstName + " " + user.middleName + " " + user.lastName;

//     //insert into users table
//     const [result] = await db.execute(
//       "INSERT INTO users (`id`, `firstName`, `lastName`, `middleName`, `userName`, `name`, `email`, `password`, `birthDate`, `parentId`, `activationCodeId`, `sponsorId`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
//       [
//         newUserId,
//         user.firstName,
//         user.lastName,
//         user.middleName,
//         user.username,
//         userFullName,
//         user.email,
//         hash,
//         user.birthDate,
//         actualUplineId,
//         activationCodeIdFromDB,
//         actualSponsorId,
//       ],
//     );

//     //error when inserting in the database
//     const insertResult = result as ResultSetHeader;

//     if (insertResult.affectedRows === 0) {
//       return {
//         success: false,
//         error: {
//           statusCode: 500,
//           errorMessage: "Failed to insert user",
//         },
//       };
//     }

//     await db.execute(
//       "INSERT INTO user_stats (`userId`, `balance`, `leftPoints`, `rightPoints`, `leftDownline`, `rightDownline`, `rankPoints`, `level`, `sidePath`, `hasDeduction`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
//       [newUserId, 0.0, 0, 0, 0, 0, 0, 0, "root", false],
//     );

//     await db.execute(`UPDATE users SET ${sideColumn} = ? WHERE id = ?`, [
//       newUserId,
//       actualUplineId,
//     ]);

//     await db.execute(`UPDATE activation_codes SET status = ? WHERE id = ?`, [
//       "Used",
//       activationCodeIdFromDB,
//     ]);

//     await db.execute(
//       `UPDATE user_stats SET normalWallet = normalWallet + 500.00 WHERE userId = ?`,
//       [actualUplineId],
//     );

//     await db.execute(
//       "INSERT INTO transactions (`userId`, `type`, `walletType`, `amount`, `transactionDirection`, `description`, `referenceId`) VALUES (?, ?, ?, ?, ?, ?, ?)",
//       [
//         actualUplineId,
//         "Referral Bonus",
//         "normalWallet",
//         500,
//         "Credit",
//         `Direct referral bonus for new user ${user.username}`,
//         newUserId,
//       ],
//     );

//     const placementSide: "Left" | "Right" =
//       user.position === "[L]" ? "Left" : "Right";

//     await processBinaryVolumeUpstream(actualUplineId, placementSide);

//     return {
//       success: true,
//       data: {
//         statusCode: 200,
//         message: "User registered successfully",
//       },
//     };
//   } catch (error) {
//     return {
//       success: false,
//       error: {
//         statusCode: 500,
//         errorMessage: error instanceof Error ? error.message : String(error),
//       },
//     };
//   }
// };

export const registerUserIn = async (
  user: RegisterData,
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
    const sideColumn = user.position === "[L]" ? "leftChildId" : "rightChildId";

    // sponsor check
    const [sponsorCheck] = await db.execute(
      "SELECT id FROM `users` WHERE `userName` = ?",
      [user.sponsor],
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

    // 1. Fetch Upline data INCLUDING sidePath and level from user_stats
    const [uplineCheck] = await db.execute(
      `SELECT u.id, u.${sideColumn}, us.sidePath, us.level, u.mainAncestorId
       FROM users u
       JOIN user_stats us ON u.id = us.userId
       WHERE u.userName = ? FOR UPDATE`,
      [user.upline],
    );

    const upline = (uplineCheck as any[])[0];

    if (!upline) {
      return {
        success: false,
        error: {
          errorMessage: `Upline ${user.upline} not found`,
          statusCode: 400,
        },
      };
    }

    if (upline[sideColumn]) {
      return {
        success: false,
        error: {
          statusCode: 409,
          errorMessage: `Upline slot already occupied`,
        },
      };
    }

    console.log("from auth", upline);

    // 2. Calculate New Stats based on Upline
    // If upline sidePath is "root", we start fresh, otherwise append [L] or [R]
    const parentPath = upline.sidePath === "root" ? "" : upline.sidePath;
    const newSidePath = `${parentPath}${user.position}`;
    const newLevel = (upline.level || 0) + 1;
    const effectiveMainParentTree = upline.mainParentTree || null;

    console.log("from auth", upline.mainParentTree || null);

    // 3. Fetch Activation Code & Price
    const [codes] = await db.execute(
      `SELECT id, status, price FROM activation_codes WHERE code = ? FOR UPDATE`,
      [user.pin],
    );
    const code = (codes as any[])[0];
    if (!code) {
      return {
        success: false,
        error: { statusCode: 404, errorMessage: "Invalid activation code." },
      };
    }

    // 4. Create User
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(user.password, salt);
    const { v4: uuidv4 } = await import("uuid");
    const newUserId = uuidv4();
    const userFullName =
      `${user.firstName} ${user.middleName || ""} ${user.lastName}`.trim();

    await db.execute(
      `INSERT INTO users (id, firstName, lastName, middleName, userName, name, email, password, birthDate, parentId, activationCodeId, sponsorId)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        upline.id,
        code.id,
        actualSponsorId,
      ],
    );

    // 5. Insert Stats with DYNAMIC sidePath and level
    await db.execute(
      `INSERT INTO user_stats (userId, balance, leftPoints, rightPoints, leftDownline, rightDownline, rankPoints, level, sidePath, hasDeduction)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [newUserId, 0.0, 0, 0, 0, 0, 0, newLevel, newSidePath, false],
    );

    // 6. Updates & Commissions
    await db.execute(`UPDATE users SET ${sideColumn} = ? WHERE id = ?`, [
      newUserId,
      upline.id,
    ]);
    await db.execute(
      `UPDATE activation_codes SET status = 'Used' WHERE id = ?`,
      [code.id],
    );

    // 7. Process Upstream (Level Bonuses + Binary)
    const placementSide: "Left" | "Right" =
      user.position === "[L]" ? "Left" : "Right";
    await processBinaryVolumeUpstreamv1(
      actualSponsorId,
      placementSide,
      newUserId,
      code.price, // Pass the price for the custom bonus logic we wrote earlier
    );

    return {
      success: true,
      data: { statusCode: 200, message: "User registered successfully" },
    };
  } catch (error) {
    return {
      success: false,
      error: { statusCode: 500, errorMessage: String(error) },
    };
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
