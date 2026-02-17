// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import connectDB from "./config/db.js";
// import authRoutes from "./routes/auth.routes.js";


// // load environment variables
// dotenv.config();
// connectDB();

// const app = express();

// // middlewares
// app.use(cors());
// app.use(express.json());
// app.use("/api/auth", authRoutes);

// // test route
// app.get("/", (req, res) => {
//   res.send("Job Portal Backend is running");
// });

// // port
// const PORT = process.env.PORT || 5000;

// // start server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import jobSeekerRoutes from "./routes/jobSeeker.routes.js";

dotenv.config();

const app = express();

/* ==============================
   CORS
============================== */
app.use(
  cors({
    origin: "http://localhost:5173",
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

/* ==============================
   Start Server
============================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Started server");
});
