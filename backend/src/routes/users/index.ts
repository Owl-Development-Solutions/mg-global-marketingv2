import express from "express";
import { loginUserController, registerUserController } from "../../controller";

const router = express.Router();

router.post("/v1", registerUserController);
router.post("/v1", loginUserController);

export default router;
