
import jwt from "jsonwebtoken";

/* =====================================================
   AUTH MIDDLEWARE (VERIFY TOKEN)
===================================================== */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization token missing or invalid format",
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Token not provided",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user data
    req.user = decoded;

    next();

  } catch (error) {
    console.error("Auth Middleware Error:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

/* =====================================================
   RECRUITER ONLY MIDDLEWARE
===================================================== */
export const recruiterOnly = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        message: "Access denied. Recruiters only.",
      });
    }

    next();

  } catch (error) {
    console.error("Recruiter Role Check Error:", error.message);
    return res.status(500).json({
      message: "Role validation failed",
    });
  }
};

/* =====================================================
   JOB SEEKER ONLY MIDDLEWARE
===================================================== */
export const jobSeekerOnly = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    if (req.user.role !== "jobseeker") {
      return res.status(403).json({
        message: "Access denied. Job seekers only.",
      });
    }

    next();

  } catch (error) {
    console.error("JobSeeker Role Check Error:", error.message);
    return res.status(500).json({
      message: "Role validation failed",
    });
  }
};

export default authMiddleware;