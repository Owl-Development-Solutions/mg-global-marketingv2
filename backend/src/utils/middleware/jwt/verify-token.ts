import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import { JWTProps } from "../../models";

interface AuthenticatedRequest extends Request {
  user?: JWTProps | JwtPayload;
}

export const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const secret = process.env.JWT_SECRET!;
  const authHeader = req.headers["authorization"];

  const token = authHeader?.split(" ")[1];
  console.log("Extracted token:", token ? "exists" : "missing");
  console.log("Token length:", token?.length || 0);

  if (!token) {
    console.log("No token provided, returning 401");
    return res.sendStatus(401);
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      console.log("Token verification error:", err.message);
      return res.status(403).json({
        message: "Invalid or expired token",
      });
    }

    console.log("Token verified successfully, user:", user);
    req.user = user as JWTProps;
    next();
  });
};
