
import bcrypt from "bcrypt";
import Recruiter from "../models/recruiter.js";
import JobSeeker from "../models/jobSeeker.js";
import TempRecruiter from "../models/temprecruiter.js";
import TempJobSeeker from "../models/tempJobSeeker.js";
import mailTransporter from "../utils/mailTransporter.js";
import jwt from "jsonwebtoken";

/* =====================================================
   TOKEN GENERATOR
===================================================== */
const generateTokens = (user, role) => {
  const accessToken = jwt.sign(
    {
      id: user._id,
      role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  const refreshToken = jwt.sign(
    {
      id: user._id,
      role,
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

/* =====================================================
   HELPER
===================================================== */
const getTempModel = (role) => {
  if (role === "recruiter") return TempRecruiter;
  if (role === "jobseeker") return TempJobSeeker;
  return null;
};

/* =====================================================
   SEND OTP
===================================================== */
export const sendOtp = async (req, res) => {
  try {
    const { fullName, email, role } = req.body;

    if (!fullName || !email || !role) {
      return res.status(400).json({
        message: "Full name, email and role are required",
      });
    }

    const TempModel = getTempModel(role);
    if (!TempModel) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = Date.now() + 10 * 60 * 1000;

    let tempUser = await TempModel.findOne({ email });

    if (tempUser) {
      tempUser.otp = otp;
      tempUser.otpExpiresAt = otpExpiresAt;
      tempUser.isVerified = false;
      await tempUser.save();
    } else {
      await TempModel.create({
        fullName,
        email,
        otp,
        otpExpiresAt,
        isVerified: false,
      });
    }

    await mailTransporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification OTP",
      html: `
        <h3>Your OTP is <b>${otp}</b></h3>
        <p>This OTP will expire in 10 minutes</p>
      `,
    });

    return res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   VERIFY OTP
===================================================== */
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp, role } = req.body;

    if (!email || !otp || !role) {
      return res.status(400).json({
        message: "Email, OTP and role are required",
      });
    }

    const TempModel = getTempModel(role);
    if (!TempModel) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const tempUser = await TempModel.findOne({ email });

    if (!tempUser) {
      return res.status(400).json({
        message: "OTP not found",
      });
    }

    if (tempUser.otpExpiresAt < Date.now()) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    if (tempUser.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    tempUser.isVerified = true;
    await tempUser.save();

    return res.status(200).json({
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   RESEND OTP
===================================================== */
export const resendOtp = async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({
        message: "Email and role are required",
      });
    }

    const TempModel = getTempModel(role);
    if (!TempModel) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const tempUser = await TempModel.findOne({ email });

    if (!tempUser) {
      return res.status(400).json({
        message: "No OTP request found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = Date.now() + 10 * 60 * 1000;

    tempUser.otp = otp;
    tempUser.otpExpiresAt = otpExpiresAt;
    tempUser.isVerified = false;
    await tempUser.save();

    return res.status(200).json({
      message: "OTP resent successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   SIGNUP RECRUITER
===================================================== */
export const signupRecruiter = async (req, res) => {
  try {
    const { fullName, email, password, mobile, designation, companyDetails } =
      req.body;

    const temp = await TempRecruiter.findOne({ email });
    if (!temp || !temp.isVerified) {
      return res.status(400).json({
        message: "Email not verified",
      });
    }

    const existingUser = await Recruiter.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const recruiter = await Recruiter.create({
      fullName,
      email,
      password: hashedPassword,
      mobile,
      designation,
      companyDetails,
    });

    await TempRecruiter.deleteOne({ email });

    return res.status(201).json({
      message: "Recruiter signed up successfully",
      recruiterId: recruiter._id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   SIGNUP JOB SEEKER
===================================================== */
export const signupJobSeeker = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      mobile,
      gender,
      qualification,
      status,
      experience,
      location,
    } = req.body;

    const temp = await TempJobSeeker.findOne({ email });
    if (!temp || !temp.isVerified) {
      return res.status(400).json({
        message: "Email not verified",
      });
    }

    const existingUser = await JobSeeker.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const jobSeeker = await JobSeeker.create({
      fullName,
      email,
      password: hashedPassword,
      mobile,
      gender,
      qualification,
      status,
      experience: status === "Experienced" ? experience : 0,
      location,
    });

    await TempJobSeeker.deleteOne({ email });

    return res.status(201).json({
      message: "Job seeker signed up successfully",
      jobSeekerId: jobSeeker._id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   LOGIN
===================================================== */
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    let user;

    if (role === "recruiter") {
      user = await Recruiter.findOne({ email });
    } else {
      user = await JobSeeker.findOne({ email });
    }

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const { accessToken, refreshToken } = generateTokens(user, role);
    console.log(`Generated Token for ${role}:`, accessToken.substring(0, 10) + "...");

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
    });

    return res.status(200).json({
      message: "Login successful",
      token: accessToken,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role,
        profilePhotoId: role === "recruiter" ? user.profilePhotoId : user.profile?.profilePhotoId
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   REFRESH TOKEN
===================================================== */
export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    return res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

/* =====================================================
   LOGOUT
===================================================== */
export const logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out successfully" });
};
/* =====================================================
   FORGOT PASSWORD - SEND OTP
===================================================== */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    let user = await Recruiter.findOne({ email });

    if (!user) {
      user = await JobSeeker.findOne({ email });
    }

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // IMPORTANT → OTP AS NUMBER
    const otp = Math.floor(100000 + Math.random() * 900000);

    user.resetOtp = otp;
    user.resetOtpExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    await mailTransporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <h3>Your OTP is <b>${otp}</b></h3>
        <p>This OTP will expire in 10 minutes</p>
      `,
    });

    return res.status(200).json({
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


/* =====================================================
   VERIFY FORGOT OTP
===================================================== */
export const verifyForgotOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    let user = await Recruiter.findOne({ email });

    if (!user) {
      user = await JobSeeker.findOne({ email });
    }

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // IMPORTANT → Convert frontend OTP to Number
    if (
      user.resetOtp !== Number(otp) ||
      user.resetOtpExpires < Date.now()
    ) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    return res.status(200).json({
      message: "OTP verified successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   RESET PASSWORD
===================================================== */
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    let user = await Recruiter.findOne({ email });

    if (!user) {
      user = await JobSeeker.findOne({ email });
    }

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    if (
      user.resetOtp !== Number(otp) ||
      user.resetOtpExpires < Date.now()
    ) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;

    await user.save();

    return res.status(200).json({
      message: "Password updated successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


/* =====================================================
   GET CURRENT USER (PROTECTED)
===================================================== */
export const getMe = async (req, res) => {
  try {
    const { id, role } = req.user;
    let user;

    if (role === "recruiter") {
      user = await Recruiter.findById(id).select("-password");
    } else {
      user = await JobSeeker.findById(id).select("-password");
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User authenticated",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: role,
        profilePhotoId: role === "recruiter" ? user.profilePhotoId : user.profile?.profilePhotoId
      },
    });
  } catch (error) {
    console.error("GetMe Error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

