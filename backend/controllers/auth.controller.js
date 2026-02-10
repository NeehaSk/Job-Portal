// import bcrypt from "bcrypt";
// import Recruiter from "../models/recruiter.js";

// // Recruiter Signup
// export const signupRecruiter = async (req, res) => {
//   try {
//     const {
//       fullName,
//       email,
//       password,
//       mobile,
//       designation,
//       companyDetails,
//     } = req.body;

//     // validation
//     if (
//       !fullName ||
//       !email ||
//       !password ||
//       !mobile ||
//       !designation ||
//       !companyDetails ||
//       !companyDetails.name
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Required fields missing",
//       });
//     }

//     // check existing user
//     const existingUser = await Recruiter.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "Email already registered",
//       });
//     }

//     // hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // create recruiter
//     const recruiter = await Recruiter.create({
//       fullName,
//       email,
//       password: hashedPassword,
//       mobile,
//       role: "recruiter",
//       designation,
//       companyDetails: {
//         name: companyDetails.name,
//         website: companyDetails.website,
//         industry: companyDetails.industry,
//         location: companyDetails.location,
//       },
    
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Recruiter signed up successfully",
//       recruiterId: recruiter._id,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

// import bcrypt from "bcrypt";
// import Recruiter from "../models/recruiter.js";
// import TempRecruiter from "../models/temprecruiter.js";
// import mailTransporter from "../utils/mailTransporter.js";

// /* =========================
//    Recruiter Signup
// ========================= */
// export const signupRecruiter = async (req, res) => {
//   try {
//     const {
//       fullName,
//       email,
//       password,
//       mobile,
//       designation,
//       companyDetails,
//     } = req.body;

//     if (
//       !fullName ||
//       !email ||
//       !password ||
//       !mobile ||
//       !designation ||
//       !companyDetails ||
//       !companyDetails.name
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Required fields missing",
//       });
//     }

//     const existingUser = await Recruiter.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "Email already registered",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const recruiter = await Recruiter.create({
//       fullName,
//       email,
//       password: hashedPassword,
//       mobile,
//       designation,
//       companyDetails,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Recruiter signed up successfully",
//       recruiterId: recruiter._id,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

// /* =========================
//    Send Recruiter OTP
// ========================= */
// export const sendRecruiterOtp = async (req, res) => {
//   try {
//     const { fullName, email } = req.body;

//     if (!fullName || !email) {
//       return res.status(400).json({
//         message: "Name and email are required",
//       });
//     }

//     // generate OTP
//     const otp = Math.floor(100000 + Math.random() * 900000);
//     const otpExpiresAt = Date.now() + 10 * 60 * 1000;

//     let tempRecruiter = await TempRecruiter.findOne({ email });

//     if (tempRecruiter) {
//       tempRecruiter.otp = otp;
//       tempRecruiter.otpExpiresAt = otpExpiresAt;
//       await tempRecruiter.save();
//     } else {
//       await TempRecruiter.create({
//         fullName,
//         email,
//         otp,
//         otpExpiresAt,
//       });
//     }

//     await mailTransporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: "Email Verification OTP",
//       html: `
//         <h3>Your OTP is <b>${otp}</b></h3>
//         <p>This OTP will expire in 10 minutes</p>
//       `,
//     });

//     return res.status(200).json({
//       message: "OTP sent successfully",
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: "Server error",
//     });
//   }
// };
// /* =========================
//    Verify Recruiter OTP
// ========================= */
// export const verifyRecruiterOtp = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     const tempRecruiter = await TempRecruiter.findOne({ email });
    
          
//     if (!tempRecruiter) {
//       return res.status(400).json({
//         message: "OTP not found. Please resend OTP",
//       });

//     }

//     // check expiry
//     if (tempRecruiter.otpExpiresAt < Date.now()) {
//       return res.status(400).json({
//         message: "OTP expired",
//       });
//     }

//     // check OTP match
//     if (tempRecruiter.otp !== otp) {
//       return res.status(400).json({
//         message: "Invalid OTP",
//       });
//     }
//     tempRecruiter.isEmailVerified=true
//     await tempRecruiter.save()

//     return res.status(200).json({
//       message: "OTP verified successfully",
//     });
   

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: "Server error",
//     });
//   }
// };

// /* =========================
//    Resend Recruiter OTP
// ========================= */
// export const resendRecruiterOtp = async (req, res) => {
//   try {
//     const { email } = req.body;

//     const tempRecruiter = await TempRecruiter.findOne({ email });

//     if (!tempRecruiter) {
//       return res.status(400).json({
//         message: "No registration found. Please start again",
//       });
//     }

//     // generate new OTP
//     const otp = Math.floor(100000 + Math.random() * 900000);
//     const otpExpiresAt = Date.now() + 10 * 60 * 1000;

//     tempRecruiter.otp = otp;
//     tempRecruiter.otpExpiresAt = otpExpiresAt;
//     await tempRecruiter.save();

//     await mailTransporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: "Resent OTP for Email Verification",
//       html: `
//         <h3>Your new OTP is <b>${otp}</b></h3>
//         <p>This OTP will expire in 10 minutes</p>
//       `,
//     });

//     return res.status(200).json({
//       message: "OTP resent successfully",
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: "Server error",
//     });
//   }
// };
import bcrypt from "bcrypt";
import Recruiter from "../models/recruiter.js";
import JobSeeker from "../models/jobSeeker.js";
import TempRecruiter from "../models/temprecruiter.js";
import TempJobSeeker from "../models/tempJobSeeker.js";
import mailTransporter from "../utils/mailTransporter.js";

/* =====================================================
   HELPER: Choose Temp Model based on role
===================================================== */
const getTempModel = (role) => {
  if (role === "recruiter") return TempRecruiter;
  if (role === "jobseeker") return TempJobSeeker;
  return null;
};

/* =====================================================
   SEND OTP (COMMON for Recruiter & JobSeeker)
===================================================== */
export const sendOtp = async (req, res) => {
  try {
    const { fullName, email, role } = req.body;
console.log(fullName, email, role)
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
   VERIFY OTP (COMMON)
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
        message: "OTP not found. Please resend OTP",
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
   RESEND OTP (COMMON)
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
        message: "No OTP request found. Please start again",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = Date.now() + 10 * 60 * 1000;

    tempUser.otp = otp;
    tempUser.otpExpiresAt = otpExpiresAt;
    tempUser.isVerified = false;
    await tempUser.save();

    await mailTransporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Resent OTP for Email Verification",
      html: `
        <h3>Your new OTP is <b>${otp}</b></h3>
        <p>This OTP will expire in 10 minutes</p>
      `,
    });

    return res.status(200).json({
      message: "OTP resent successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   RECRUITER SIGNUP
===================================================== */
export const signupRecruiter = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      mobile,
      designation,
      companyDetails,
    } = req.body;

    if (
      !fullName ||
      !email ||
      !password ||
      !mobile ||
      !designation ||
      !companyDetails ||
      !companyDetails.name
    ) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

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

    // cleanup temp data
    await TempRecruiter.deleteOne({ email });

    return res.status(201).json({
      message: "Recruiter signed up successfully",
      recruiterId: recruiter._id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

/* =====================================================
   JOB SEEKER SIGNUP
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

    if (
      !fullName ||
      !email ||
      !password ||
      !mobile ||
      !gender ||
      !qualification ||
      !status ||
      !location
    ) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    if (status === "Experienced" && (experience === undefined || experience === null)) {
      return res.status(400).json({
        message: "Experience is required for experienced candidates",
      });
    }

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

    // cleanup temp data
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
