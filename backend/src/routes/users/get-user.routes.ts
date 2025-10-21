import express from "express";
import { getUserByAccessTokenController } from "../../controller";
import { verifyToken } from "../../utils";

const router = express.Router();

router.post(
  "/getUserByAccessToken",
  verifyToken,
  getUserByAccessTokenController
);

export default router;
