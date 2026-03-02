import express from "express";
import { verifyToken } from "../../utils";
import { updateUser } from "../../infrastructure";

const router = express.Router();

router.patch("/editUser", verifyToken, updateUser);

export default router;
