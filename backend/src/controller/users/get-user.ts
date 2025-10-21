import { Request, Response } from "express";
import {
  ErrorResponse,
  Result,
  SuccessResponse,
  UserResponse,
} from "../../utils";
import { getUserByAccessToken } from "../../infrastructure";

export const getUserByAccessTokenController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result: Result<
    SuccessResponse<UserResponse>,
    ErrorResponse
  > = await getUserByAccessToken(req.body.token);

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
