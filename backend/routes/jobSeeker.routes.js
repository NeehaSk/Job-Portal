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
  uploadResume
} from "../controllers/jobSeeker.controller.js";

const router = express.Router();

// ===== GET PROFILE =====
router.get("/profile", authMiddleware, getMyProfile);

// ===== UPDATE PROFILE DETAILS =====
router.put("/update-profile", authMiddleware, updateProfile);

// ===== UPLOAD PROFILE PHOTO =====
router.put("/upload-profile-pic", authMiddleware, uploadProfilePic);

// ===== UPLOAD RESUME =====
router.put("/upload-resume", authMiddleware, uploadResume);

export default router;
