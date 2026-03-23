
// import express from "express";
// import authMiddleware from "../middleware/authmiddleware.js";
// import { getRecruiterJobs } from "../controllers/job.controller.js";
// import {
//   getMyProfile,
//   updateProfile,
//   uploadProfilePic,
//   uploadResume
// } from "../controllers/jobSeeker.controller.js";

// const router = express.Router();
// router.get("/my-jobs", authMiddleware, recruiterOnly, getRecruiterJobs);
// router.get("/profile", authMiddleware, getMyProfile);
// router.put("/update-profile", authMiddleware, updateProfile);
// router.put("/upload-profile-pic", authMiddleware, uploadProfilePic);
// router.put("/upload-resume", authMiddleware, uploadResume);

// export default router;
import express from "express";

import authMiddleware, { recruiterOnly, jobSeekerOnly }
  from "../middleware/authmiddleware.js";

import {
  createJob,
  getAllJobs,
  getSingleJob,
  getJobApplicants,
  applyToJob,
  getMyApplications,
  getRecruiterJobs,
  updateJob,
  deleteJob,
  updateApplicationStatus,
  getRecruiterAllApplications,
  addApplicationMessage
} from "../controllers/job.controller.js";


const router = express.Router();

/* ─── Write (POST/PUT/DELETE) ─────────────────────────── */

/* CREATE JOB (Recruiter only) */
router.post("/create", authMiddleware, recruiterOnly, createJob);

/* UPDATE JOB (Recruiter only) */
router.put("/update/:jobId", authMiddleware, recruiterOnly, updateJob);

/* DELETE JOB (Recruiter only) */
router.delete("/delete/:jobId", authMiddleware, recruiterOnly, deleteJob);

/* APPLY TO JOB (JobSeeker only) */
router.post("/:jobId/apply", authMiddleware, jobSeekerOnly, applyToJob);

/* UPDATE APPLICATION STATUS (Recruiter only) */
router.put("/application/:applicationId/status", authMiddleware, recruiterOnly, updateApplicationStatus);

/* ADD MESSAGE TO APPLICATION (Recruiter or JobSeeker) */
router.post("/application/:applicationId/message", authMiddleware, addApplicationMessage);

/* ─── Read (GET – specific paths first, wildcards last) ── */

/* GET ALL JOBS (Public) */
router.get("/", getAllJobs);

/* GET RECRUITER'S OWN JOBS (Recruiter only) */
router.get("/my-jobs", authMiddleware, recruiterOnly, getRecruiterJobs);

/* GET MY APPLICATIONS (JobSeeker only) */
router.get("/my-applications", authMiddleware, jobSeekerOnly, getMyApplications);

/* GET ALL RECRUITER APPLICATIONS (Recruiter only) */
router.get("/recruiter-applicants", authMiddleware, recruiterOnly, getRecruiterAllApplications);

/* GET APPLICANTS FOR A JOB (Recruiter only) */
router.get("/:jobId/applicants", authMiddleware, recruiterOnly, getJobApplicants);

/* GET SINGLE JOB by ID — wildcard MUST be last */
router.get("/:jobId", getSingleJob);

export default router;
