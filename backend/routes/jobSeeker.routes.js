// import express from "express";
// import authMiddleware from "../middleware/authmiddleware.js";
// import JobSeeker from "../models/jobSeeker.js";

// const router = express.Router();

// // ===== GET MY PROFILE =====
// router.get("/profile", authMiddleware, async (req, res) => {

//     const user = await JobSeeker.findById(req.user.id).select("-password");

//     if (!user) {
//         return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json(user);
// });

// export default router;
// import express from "express";
// import authMiddleware from "../middleware/authmiddleware.js";
// import { getMyProfile } from "../controllers/jobSeeker.controller.js";

// const router = express.Router();

// // ===== GET MY PROFILE =====
// router.get("/profile", authMiddleware, getMyProfile);

// export default router;
import express from "express";
import authMiddleware from "../middleware/authmiddleware.js";
import {
  getMyProfile,
  updateProfile,
  uploadProfilePic,
  uploadResume,
  getDashboardData,
  getPublicProfile
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


export default router;
