import * as jwt from "jsonwebtoken";
import { JWTProps, User } from "../../models";
import dotenv from "dotenv";

dotenv.config();

export const generateAccessToken = (user: JWTProps) => {
  const secret = process.env.JWT_SECRET!;
  const expiresIn = process.env.JWT_ACCESS_TOKEN_EXPIRES;
  return jwt.sign({ id: user.id, email: user.email }, secret, {
    expiresIn: expiresIn as any,
  });
};

export const generateRefreshToken = (user: JWTProps) => {
  const refreshToken = process.env.JWT_REFRESH_ACCESS_TOKEN_SECRET!;

  const expiresIn = process.env.JWT_ACCESS_REFRESH_TOKEN_EXPIRES!;

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    refreshToken,
    { expiresIn: expiresIn as any }
  );
};

export const verifyRefreshToken = (token: string): JWTProps | null => {
  try {
    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret);

    if (typeof decoded === "string") return null;

    return decoded as JWTProps;
  } catch (err) {
    console.error("Token verification failed:", err);
    return null;
  }
};
