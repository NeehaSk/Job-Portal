import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    // 1️ Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    // 2️ Format: "Bearer token"
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Invalid token format",
      });
    }

    // 3️ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️ Attach user data to request
    req.user = decoded;

    // 5️ Continue
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
export default authMiddleware;
 