import express from "express";
import { getNotifications, markAsRead, markAllAsRead } from "../controllers/notification.controller.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getNotifications);
router.put("/:id/read", authMiddleware, markAsRead);
router.put("/read-all", authMiddleware, markAllAsRead);

export default router;
