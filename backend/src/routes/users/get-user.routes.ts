import express from "express";
import {
  getUserByAccessTokenController,
  getUserByIdController,
} from "../../controller";
import { verifyToken } from "../../utils";

const router = express.Router();

router.post(
  "/getUserByAccessToken",
  verifyToken,
  getUserByAccessTokenController
);

router.post("/getUserById", verifyToken, getUserByIdController);

export default router;
