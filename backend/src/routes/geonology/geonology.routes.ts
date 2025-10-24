import express from "express";
import { verifyToken } from "../../utils";
import { addGeonologyUserCn, getGeonologyTreeCn } from "../../controller";

const router = express.Router();

router.post("/addGeonology", verifyToken, addGeonologyUserCn);
router.get("/getGeonology", verifyToken, getGeonologyTreeCn);

export default router;
