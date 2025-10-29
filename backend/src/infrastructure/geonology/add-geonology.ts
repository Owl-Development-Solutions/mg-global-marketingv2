import { ResultSetHeader } from "mysql2";
import { connection } from "../../config/mysql.db";
import {
  ActivationCode,
  AddUserGeonologyData,
  ErrorResponse,
  GeonologyResponse,
  LowOrHigh,
  Result,
  SuccessResponse,
  User,
  UserStats,
} from "../../utils";
import { v4 as uuidv4 } from "uuid";
import { processUplineRewards } from "../../utils/helpers/genology-helper";

export const addGeonologyUserIn = async (
  data: AddUserGeonologyData
): Promise<Result<SuccessResponse<GeonologyResponse>, ErrorResponse>> => {
  const { parentUserName, side, child, activationCodeId } = data;

  const sideColumn = side === "[L]" ? "leftChildId" : "rightChildId";

  if (side !== "[L]" && side !== "[R]") {
    return {
      success: false,
      error: {
        statusCode: 400,
        errorMessage: "Invalid placement side, Must be [L] or [R].",
      },
    };
  }

  const db = connection();

  try {
    const [codes] = await db.execute(
      `SELECT id, status, expiresAt FROM activation_codes WHERE code = ? FOR UPDATE`,
      [activationCodeId]
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

    if (code.expiresAt && new Date(code.expiresAt) < new Date()) {
      return {
        success: false,
        error: {
          statusCode: 403,
          errorMessage: "Activation code is already expired.",
        },
      };
    }

    const activationCodeIdFromDB = code.id;

    const [parent] = await db.execute(
      `SELECT id, ${sideColumn} FROM users WHERE username = ?`,
      [parentUserName]
    );
    const users = parent as User[];
    const user = users[0];

    if (!user || user[sideColumn]) {
      const message = !user
        ? "Parent user not found."
        : `The ${side.replace(/\[|\]/g, "")} slot of the parent is already occupied.`;

      return {
        success: false,
        error: {
          statusCode: 409,
          errorMessage: message,
        },
      };
    }

    const parentId = user.id;

    const newUserId = uuidv4();

    //  INSERT NEW USER (CHILD)
    // Pass the activationCodeId into the users table
    const [userResult] = await db.execute(
      `INSERT INTO users (id, userName, firstName, lastName, parentId, activationCodeId) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        newUserId,
        child.userName,
        child.firstName,
        child.lastName,
        parentId,
        activationCodeIdFromDB,
      ]
    );

    await db.execute(
      `INSERT INTO code_usages (id, activationCodeId, userId) VALUES (?, ?, ?)`,
      [uuidv4(), activationCodeIdFromDB, newUserId]
    );

    const [parentStats] = await db.execute(
      `SELECT sidePath, level FROM user_stats WHERE userId = ?`,
      [parentId]
    );
    const userStats = parentStats as UserStats[];
    const userStat = userStats[0];
    const parentSidePath =
      userStat?.sidePath === "root" ? "" : userStat?.sidePath;

    const newSidePath = `${parentSidePath}${side}`;

    const newDbLevel = userStat?.level + 1;

    await db.execute(
      `INSERT INTO user_stats (
      userId, balance, leftPoints, rightPoints, leftDownline, rightDownline, rankPoints, level, sidePath, hasDeduction) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newUserId,
        child.balance,
        child.leftPoints,
        child.rightPoints,
        child.leftDownline,
        child.rightDownline,
        child.rankPoints,
        newDbLevel,
        newSidePath,
        child.hasDeduction,
      ]
    );

    await db.execute(`UPDATE users SET ${sideColumn} = ? WHERE id = ?`, [
      newUserId,
      parentId,
    ]);

    await processUplineRewards(db, parentId, newUserId);

    const geonologyLevel: LowOrHigh = { low: newDbLevel, high: 0 };

    const response: GeonologyResponse = {
      newUserId,
      geonologyLevel,
    };

    return {
      success: true,
      data: {
        message: `User ${child.userName} successfully added and code consumed.`,
        statusCode: 200,
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
