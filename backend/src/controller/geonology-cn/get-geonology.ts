import { Request, Response } from "express";
import { getGeonologyTreeIn } from "../../infrastructure";
import {
  ErrorResponse,
  GeonologyNode,
  Result,
  SuccessResponse,
} from "../../utils";

export const getGeonologyTreeCn = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.query.user;
  if (!userId || typeof userId !== "string") {
    res.status(400).json({
      error: 'Missing or invalid "user" query parameter',
    });
    return;
  }

  const result: Result<
    SuccessResponse<GeonologyNode>,
    ErrorResponse
  > = await getGeonologyTreeIn(userId);

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
