import express from "express";
import authMiddleware from "../middleware/authmiddleware.js";
import {
    getMyProfile,
    updateProfile,
    uploadProfilePic
} from "../controllers/recruiter.controller.js";
import multer from "multer";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// All recruiter routes are protected
router.use(authMiddleware);

// ===== GET PROFILE =====
router.get("/profile", getMyProfile);

// ===== UPDATE PROFILE DETAILS =====
router.put("/update-profile", updateProfile);

// ===== UPLOAD PROFILE PHOTO =====
router.put("/upload-profile-pic", upload.single("file"), uploadProfilePic);

export default router;
