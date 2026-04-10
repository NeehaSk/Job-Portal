import express from "express";
import {
  sendOtp,
  verifyOtp,              // Registration OTP verification
  resendOtp,

  signupRecruiter,
  signupJobSeeker,
  signupAdmin,

  login,
  refreshToken,
  logout,
  getMe,

  forgotPassword,         // Forgot password - send OTP
  verifyForgotOtp,        // Verify OTP for password reset
  resetPassword           // Final password reset
} from "../controllers/auth.controller.js";

import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

/* ===== REGISTRATION OTP ROUTES ===== */
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);           // Registration OTP
router.post("/resend-otp", resendOtp);

/* ===== FORGOT PASSWORD ROUTES ===== */
router.post("/forgot-password", forgotPassword);
router.post("/verify-forgot-otp", verifyForgotOtp);
router.post("/reset-password", resetPassword);

/* ===== SIGNUP ROUTES ===== */
router.post("/signup-recruiter", signupRecruiter);
router.post("/signup-jobseeker", signupJobSeeker);
router.post("/signup-admin", signupAdmin);

/* ===== LOGIN ROUTE ===== */
router.post("/login", login);

/* ===== TOKEN ROUTES ===== */
router.get("/refresh-token", refreshToken);

/* ===== LOGOUT ===== */
router.post("/logout", logout);

/* ===== PROTECTED ROUTE ===== */
router.get("/me", authMiddleware, getMe);

export default router;
