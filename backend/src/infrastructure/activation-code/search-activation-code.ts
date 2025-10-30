import { connection } from "../../config/mysql.db";
import {
  ActivationCode,
  ErrorResponse,
  Result,
  SuccessResponse,
} from "../../utils";

export const isActivationCodeValid = async (
  activationCode: string
): Promise<Result<SuccessResponse<string>, ErrorResponse>> => {
  try {
    if (!activationCode) {
      return {
        success: false,
        error: {
          statusCode: 400,
          errorMessage: "Missing activation code",
        },
      };
    }

    const db = connection();
    const now = new Date();

    const [rows] = await db.execute(
      "SELECT id, status, expiresAt, price FROM activation_codes WHERE code = ? LIMIT 1",
      [activationCode]
    );

    const codesFound = rows as any[];

    if (codesFound.length === 0) {
      return {
        success: false,
        error: {
          statusCode: 404,
          errorMessage: "Activation code is not valid.",
        },
      };
    }

    const codeInfos = codesFound as ActivationCode[];
    const codeInfo = codeInfos[0];
    const expiryDate = codeInfo?.expiresAt
      ? new Date(codeInfo.expiresAt)
      : null;

    /* commented this for now if expiryDate is available */
    // if (
    //   codeInfo?.status === "notActive" ||
    //   codeInfo?.price === 0 ||
    //   (expiryDate !== null && expiryDate < now)
    // ) {
    //   return {
    //     success: false,
    //     error: {
    //       statusCode: 404,
    //       errorMessage: "Activation code is expired or not available.",
    //     },
    //   };
    // }

    if (codeInfo?.status === "Used") {
      return {
        success: false,
        error: {
          statusCode: 404,
          errorMessage: "Activation code is already in used.",
        },
      };
    }

    return {
      success: true,
      data: {
        statusCode: 200,
        message: "Activation code is valid.",
        data: "Activation code is valid.",
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
