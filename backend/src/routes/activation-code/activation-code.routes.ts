import express from "express";
import { verifyToken } from "../../utils";
import {
  generateFiftyActivationCodesController,
  searchActivationCodeController,
} from "../../controller";

const router = express.Router();

router.post(
  "/searchActivationCode",
  verifyToken,
  searchActivationCodeController
);
router.post("/createCode", verifyToken, generateFiftyActivationCodesController);

export default router;
