import express from "express";
import { updateUserController } from "../../controller";
import { verifyToken } from "../../utils";
import multer from "multer";

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  dest: "uploads/", // Temporary storage directory
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// PUT /api/v1/users/:userId - Update user profile
router.put("/:userId", verifyToken, upload.single("profileImage"), updateUserController);

export default router;
