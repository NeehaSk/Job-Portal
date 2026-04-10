import express from "express";
import authMiddleware from "../middleware/authmiddleware.js";
import {
  getMyProfile,
  updateProfile,
  uploadProfilePic,
  uploadResume,
  getDashboardData,
  getPublicProfile,
  toggleSaveJob,
  getSavedJobs
} from "../controllers/jobSeeker.controller.js";
import multer from "multer";
import { recruiterOnly } from "../middleware/authmiddleware.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });


// ===== GET PROFILE =====
router.get("/profile", authMiddleware, getMyProfile);

// ===== GET PUBLIC PROFILE (Recruiters) =====
router.get("/profile/:id", authMiddleware, recruiterOnly, getPublicProfile);

// ===== GET DASHBOARD DATA =====
router.get("/dashboard", authMiddleware, getDashboardData);

// ===== UPDATE PROFILE DETAILS =====
router.put("/update-profile", authMiddleware, updateProfile);

// ===== UPLOAD PROFILE PHOTO =====
router.put("/upload-profile-pic", authMiddleware, upload.single("file"), uploadProfilePic);

// ===== UPLOAD RESUME =====
router.put("/upload-resume", authMiddleware, upload.single("file"), uploadResume);

// ===== SAVED JOBS =====
router.post("/saved-jobs/:jobId", authMiddleware, toggleSaveJob);
router.get("/saved-jobs", authMiddleware, getSavedJobs);


export default router;
