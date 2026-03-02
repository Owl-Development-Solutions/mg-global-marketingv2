import express from "express";
import { verifyToken } from "../../utils";
import { editUserController } from "../../controller";

const router = express.Router();

router.patch("/editUser", verifyToken, editUserController);

export default router;
