import { Request, Response } from "express";
import { isUsernameUsed } from "../../infrastructure";
import { ErrorResponse, Result, SuccessResponse } from "../../utils";

export const searchUsernameController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result: Result<
    SuccessResponse<string>,
    ErrorResponse
  > = await isUsernameUsed(req.body.userName);

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
