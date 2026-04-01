import express from "express";
import { getAdminStats, getAllUsers, deleteUser, getAllJobs, deleteJob, uploadAdminProfilePic } from "../controllers/admin.controller.js";
import { updateAdminProfile } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/authmiddleware.js";
import multer from "multer";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Role-based protection: only admin can access these routes
const adminAuth = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};

router.get("/stats", authMiddleware, adminAuth, getAdminStats);
router.get("/users", authMiddleware, adminAuth, getAllUsers);
router.get("/jobs", authMiddleware, adminAuth, getAllJobs);
router.post("/user/delete", authMiddleware, adminAuth, deleteUser);
router.delete("/job/delete/:jobId", authMiddleware, adminAuth, deleteJob);
router.put("/profile/update", authMiddleware, adminAuth, updateAdminProfile);
router.put("/profile/upload-photo", authMiddleware, adminAuth, upload.single("file"), uploadAdminProfilePic);

export default router;
