

import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import jobSeekerRoutes from "./routes/jobSeeker.routes.js";
import recruiterRoutes from "./routes/recruiter.routes.js";
import jobRoutes from "./routes/job.routes.js";
import fileRoutes from "./routes/file.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
const app = express();


/* ==============================
   CORS
============================== */
app.use(
   cors({
      origin: ["http://localhost:5173", "http://localhost:5174"],
      credentials: true,
   })
);

/* ==============================
   Middlewares
============================== */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

/* ==============================
   Database Connection
============================== */
connectDB(app);

/* ==============================
   Test Route
============================== */
app.get("/", (req, res) => {
   res.json({ message: "Job Portal Backend Running" });
});

/* ==============================
   Auth Routes
============================== */
app.use("/api/auth", authRoutes);
app.use("/api/jobseeker", jobSeekerRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/notifications", notificationRoutes);
/* ==============================

   Start Server
============================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
   console.log(`Started server on port ${PORT}`);
});
