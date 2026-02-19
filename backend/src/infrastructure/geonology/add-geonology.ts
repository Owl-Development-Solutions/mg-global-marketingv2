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
import { processUplineRewards } from "../../utils/helpers/genology-helper";
import { processBinaryVolumeUpstream } from "../../utils/helpers/process-upstream-geonology";

export const addGeonologyUserIn = async (
  data: AddUserGeonologyData,
): Promise<Result<SuccessResponse<GeonologyResponse>, ErrorResponse>> => {
  const { parentUserName, side, child, activationCodeId, sponsorUsername } =
    data;

  console.log(data);

  // 1. Basic Validation
  if (side !== "[L]" && side !== "[R]") {
    return {
      success: false,
      error: { statusCode: 400, errorMessage: "Invalid side." },
    };
  }

  const sideColumn = side === "[L]" ? "leftChildId" : "rightChildId";
  const db = connection();
  const conn = await db.getConnection(); // Get a single connection for the transaction

  try {
    await conn.beginTransaction();

    // 2. Lock and Validate Activation Code
    const [codes]: any = await conn.execute(
      `SELECT id, expiresAt FROM activation_codes WHERE code = ? AND status = 'Active' FOR UPDATE`,
      [activationCodeId],
    );
    const codeRecords = codes as ActivationCode[];
    const code = codeRecords[0];

    console.log(code);

    if (!code) {
      return {
        success: false,
        error: {
          statusCode: 404,
          errorMessage: "Activation code is invalid or not found.",
        },
      };
    }

    // 3. Lock and Validate Parent/Sponsor
    const [sponsor]: any = await conn.execute(
      `SELECT id FROM users WHERE username = ?`,
      [sponsorUsername],
    );
    if (!sponsor[0]) throw new Error("Sponsor not found.");

    const [parent]: any = await conn.execute(
      `SELECT id, ${sideColumn} FROM users WHERE username = ? FOR UPDATE`,
      [parentUserName],
    );
    if (!parent[0]) throw new Error("Parent user not found.");
    if (parent[0][sideColumn])
      throw new Error(`The ${side} slot is already occupied.`);

    // 4. Create User
    const { v4: uuidv4 } = await import("uuid");
    const newUserId = uuidv4();
    const fullName =
      `${child.firstName} ${child.middleName || ""} ${child.lastName}`.replace(
        /\s+/g,
        " ",
      );

    await conn.execute(
      `INSERT INTO users (id, userName, firstName, lastName, middleName, name, parentId, activationCodeId, sponsorId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newUserId,
        child.userName,
        child.firstName,
        child.lastName,
        child.middleName || "",
        fullName,
        parent[0].id,
        code.id,
        sponsor[0].id,
      ],
    );

    // 5. Update Code Status
    await conn.execute(
      `UPDATE activation_codes SET status = 'Used' WHERE id = ?`,
      [code.id],
    );
    await conn.execute(
      `INSERT INTO code_usages (id, activationCodeId, userId) VALUES (?, ?, ?)`,
      [uuidv4(), code.id, newUserId],
    );

    // 6. Initialize Stats
    const [parentStats]: any = await conn.execute(
      `SELECT sidePath, level FROM user_stats WHERE userId = ?`,
      [parent[0].id],
    );
    const pStat = parentStats[0];
    const newSidePath = `${pStat?.sidePath === "root" ? "" : pStat?.sidePath}${side}`;
    const newLevel = (pStat?.level || 0) + 1;

    await conn.execute(
      `INSERT INTO user_stats (userId, balance, level, sidePath) VALUES (?, ?, ?, ?)`,
      [newUserId, child.balance || 0, newLevel, newSidePath],
    );

    // Link Parent to Child
    await conn.execute(`UPDATE users SET ${sideColumn} = ? WHERE id = ?`, [
      newUserId,
      parent[0].id,
    ]);

    // 7. Process Upstream Volume (Pass the transaction connection!)
    const sideForVolume = side === "[L]" ? "Left" : "Right";
    await processBinaryVolumeUpstream(conn, parent[0].id, sideForVolume);

    await conn.commit();

    return {
      success: true,
      data: {
        message: `User ${child.userName} added successfully.`,
        statusCode: 200,
        data: { newUserId, geonologyLevel: { low: newLevel, high: 0 } },
      },
    };
  } catch (error: any) {
    await conn.rollback();
    return {
      success: false,
      error: { statusCode: 500, errorMessage: error.message },
    };
  } finally {
    conn.release();
  }
};
