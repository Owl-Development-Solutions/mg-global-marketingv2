import { Request, Response } from "express";
import { addGeonologyUserIn } from "../../infrastructure";
import {
  ErrorResponse,
  GeonologyResponse,
  Result,
  SuccessResponse,
} from "../../utils";

export const addGeonologyUserCn = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result: Result<
    SuccessResponse<GeonologyResponse>,
    ErrorResponse
  > = await addGeonologyUserIn(req.body);

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
