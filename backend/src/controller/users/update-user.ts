import { Request, Response } from "express";
import { updateUser } from "../../infrastructure";
import { ErrorResponse, Result, SuccessResponse } from "../../utils";

export const editUserController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const result: Result<SuccessResponse, ErrorResponse> = await updateUser(
    req.body,
  );

  if (!result.success) {
    res.status(result.error.statusCode).json({
      error: result.error.errorMessage,
    });

    return;
  }

  res
    .status(result.data.statusCode)
    .set({
      "Cache-Control": "no-store",
      Pragma: "no-cache",
      Expires: "0",
    })
    .json({
      message: result.data.message,
    });
};
