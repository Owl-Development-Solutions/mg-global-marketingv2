import { Request, Response } from "express";
import { ErrorResponse, Result, SuccessResponse } from "../../utils";
import { generateFiftyActivationCodes } from "../../infrastructure";

export const generateFiftyActivationCodesController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result: Result<
    SuccessResponse<string[]>,
    ErrorResponse
  > = await generateFiftyActivationCodes();

  if (!result.success) {
    res.status(result.error.statusCode).json({
      error: result.error.errorMessage,
    });

    return;
  }

  res.status(result.data.statusCode).json({
    message: result.data.message,
    data: result.data.data,
  });
};
