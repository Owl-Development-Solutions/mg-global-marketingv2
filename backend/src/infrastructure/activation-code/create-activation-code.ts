import { ResultSetHeader } from "mysql2";
import { connection } from "../../config/mysql.db";
import {
  ActivationCode,
  ErrorResponse,
  generateCodes,
  Result,
  SuccessResponse,
} from "../../utils";

export const generateFiftyActivationCodes = async (): Promise<
  Result<SuccessResponse<string[]>, ErrorResponse>
> => {
  const sponsorID = "d7c93f86-8b38-404c-ad02-4ba6afbffd57";
  try {
    const db = connection();

    const [existingRows] = await db.execute(
      "SELECT id, code FROM activation_codes",
    );

    const existingCodes = new Set(
      (existingRows as ActivationCode[]).map((r) => r.code),
    );
    const existingIds = new Set(
      (existingRows as ActivationCode[]).map((r) => r.id),
    );

    const newCodes = generateCodes(existingCodes, 50);

    const rowsToInsert = [];
    const { v4: uuidv4 } = await import("uuid");

    for (const code of newCodes) {
      let id = uuidv4();

      while (existingIds.has(id)) id = uuidv4();

      rowsToInsert.push([
        id,
        code,
        "Active",
        "third batch 50 codes",
        sponsorID,
        null,
        new Date(),
        new Date(),
        2000,
      ]);
    }

    const sqlStatement = `INSERT INTO activation_codes
        (id, code, status, codeDescription, sponsorId, expiresAt, createdAt, updated_at, price)
        VALUES ?`;

    const [createCodeResult] = await db.query(sqlStatement, [rowsToInsert]);

    const innerResult = createCodeResult as ResultSetHeader;

    if (innerResult.affectedRows === 0) {
      return {
        success: false,
        error: {
          statusCode: 500,
          errorMessage: "Failed to insert activation codes",
        },
      };
    }

    return {
      success: true,
      data: {
        statusCode: 200,
        message: "Codes generated successfully",
        data: newCodes as string[],
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
