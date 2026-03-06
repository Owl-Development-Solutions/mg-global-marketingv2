import express from "express";
import { verifyToken } from "../../utils";
import { imageUploadController } from "../../controller";

import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post(
  "/uploadImage",
  verifyToken,
  upload.single("file"),
  imageUploadController,
);

export default router;
