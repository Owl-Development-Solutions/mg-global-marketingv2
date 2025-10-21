import express from "express";
import {
  loginUserController,
  refreshTokenController,
  registerUserController,
} from "../../controller";

const router = express.Router();

router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.post("/refresh-token", refreshTokenController);

export default router;
