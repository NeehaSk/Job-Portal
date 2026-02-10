// import express from "express";
// import { signupRecruiter } from "../controllers/auth.controller.js";
// import { sendRecruiterOtp } from "../controllers/auth.controller.js";
// import { verifyRecruiterOtp} from "../controllers/auth.controller.js";
// import { resendRecruiterOtp,} from "../controllers/auth.controller.js";

// const router = express.Router();

// router.post("/signup-recruiter", signupRecruiter);

// router.post("/recruiter/send-otp", sendRecruiterOtp);

// router.post("/recruiter/verify-otp", verifyRecruiterOtp);

// router.post("/recruiter/resend-otp", resendRecruiterOtp);

// export default router;



import express from "express";
import {
  sendOtp,
  verifyOtp,
  resendOtp,
  signupRecruiter,
  signupJobSeeker,
} from "../controllers/auth.controller.js";

const router = express.Router();

/* ===== COMMON OTP ROUTES ===== */
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

/* ===== SIGNUP ROUTES ===== */
router.post("/signup-recruiter", signupRecruiter);
router.post("/signup-jobseeker", signupJobSeeker);

export default router;
