import express from "express";
import {
  getUserByAccessTokenController,
  getUserByIdController,
  searchUsernameController,
} from "../../controller";
import { verifyToken } from "../../utils";

const router = express.Router();

router.post(
  "/getUserByAccessToken",
  verifyToken,
  getUserByAccessTokenController
);
router.post("/isUsernameUsed", verifyToken, searchUsernameController);
router.post("/getUserById", verifyToken, getUserByIdController);

export default router;
