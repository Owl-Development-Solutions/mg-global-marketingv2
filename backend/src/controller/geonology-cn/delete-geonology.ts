import { Request, Response } from "express";
import { deleteGeanologyUser } from "../../infrastructure";
import { ErrorResponse, Result, SuccessResponse } from "../../utils";

export const deleteGeanologyUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.params.userId as string;

  const result: Result<
    SuccessResponse<string>,
    ErrorResponse
  > = await deleteGeanologyUser(userId);

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
