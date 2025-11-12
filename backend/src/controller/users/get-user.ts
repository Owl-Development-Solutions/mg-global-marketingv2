import { Request, Response } from "express";
import {
  ErrorResponse,
  Result,
  SuccessResponse,
  UserData,
  UserResponse,
} from "../../utils";
import {
  getAllUsersByName,
  getAllUsersByUsername,
  getUserByAccessToken,
  getUserById,
} from "../../infrastructure";

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

export const getUserByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result: Result<
    SuccessResponse<UserResponse>,
    ErrorResponse
  > = await getUserById(req.body.userId);

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

export const getAllUsersByUsernameController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result: Result<
    SuccessResponse<UserData[]>,
    ErrorResponse
  > = await getAllUsersByUsername(req.body.username);

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

export const getAllUsersByNameController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result: Result<
    SuccessResponse<UserData[]>,
    ErrorResponse
  > = await getAllUsersByName(req.body.name);

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
