import express from "express";
import { verifyToken } from "../../utils";
import { addGeonologyUserCn, getGeonologyTreeCn } from "../../controller";
import { deleteGeanologyUserController } from "../../controller/geonology-cn/delete-geonology";

const router = express.Router();

router.post("/addGeonology", verifyToken, addGeonologyUserCn);
router.get("/getGeonology", verifyToken, getGeonologyTreeCn);

router.delete(
  "/deleteGeonology/:userId",
  verifyToken,
  deleteGeanologyUserController
);

export default router;
