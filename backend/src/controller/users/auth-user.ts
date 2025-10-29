import { loginUserIn, registerUserIn } from "../../infrastructure";
import {
  AuthResponse,
  ErrorResponse,
  generateAccessToken,
  generateRefreshToken,
  getRefreshToken,
  Result,
  saveRefreshToken,
  SuccessResponse,
  UserResponse,
  verifyRefreshToken,
} from "../../utils";
import { Request, Response } from "express";

export const registerUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result: Result<SuccessResponse, ErrorResponse> = await registerUserIn(
    req.body
  );

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

export const loginUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result: Result<
    SuccessResponse<AuthResponse>,
    ErrorResponse
  > = await loginUserIn(req.body);

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

export const refreshTokenController = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ message: "Refresh token required" });

      return;
    }

    const decoded = verifyRefreshToken(refreshToken);

    const storedToken = await getRefreshToken(decoded!.id);

    //issue new token
    const user = { id: decoded!.id, email: decoded!.email };

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    await saveRefreshToken(user.id, newRefreshToken);

    return res.status(200).json({
      data: {
        newAccessToken,
        newRefreshToken,
      },
    });
  } catch (error) {
    return res.status(403).json({
      message: "Invalid or expired token",
    });
  }
};
