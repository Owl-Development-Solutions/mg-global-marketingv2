import express from "express";
import { verifyToken } from "../../utils";
import { searchActivationCodeController } from "../../controller";

const router = express.Router();

router.post(
  "/searchActivationCode",
  verifyToken,
  searchActivationCodeController
);

export default router;
