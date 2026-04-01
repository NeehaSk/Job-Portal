import Recruiter from "../models/recruiter.js";
import JobSeeker from "../models/jobSeeker.js";
import Job from "../models/job.model.js";
import Application from "../models/application.model.js";
import Admin from "../models/admin.js";

export const getAdminStats = async (req, res) => {
  try {
    const [
      totalRecruiters,
      totalJobSeekers,
      totalJobs,
      pendingVerifications,
      totalApplications,
      appStatusStats,
      jobCategoryStats,
      recentApplications
    ] = await Promise.all([
      Recruiter.countDocuments(),
      JobSeeker.countDocuments(),
      Job.countDocuments(),
      Recruiter.countDocuments({ isApproved: false }),
      Application.countDocuments(),
      Application.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]),
      Job.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]),
      Application.find()
        .sort({ appliedAt: -1 })
        .limit(10)
        .populate("applicant", "fullName")
        .populate("job", "title")
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalRecruiters,
        totalJobSeekers,
        totalJobs,
        pendingVerifications,
        totalApplications,
        totalUsers: totalRecruiters + totalJobSeekers,
        appStatusStats,
        jobCategoryStats,
        recentApplications
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const recruiters = await Recruiter.find().select("-password").sort({ createdAt: -1 });
    const jobseekers = await JobSeeker.find().select("-password").sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      users: {
        recruiters,
        jobseekers
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("recruiter", "fullName email companyDetails");
    return res.status(200).json({ success: true, jobs });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId, role } = req.body;
    if (role === "recruiter") {
      await Recruiter.findByIdAndDelete(userId);
      await Job.deleteMany({ recruiterId: userId });
    } else if (role === "jobseeker") {
      await JobSeeker.findByIdAndDelete(userId);
    }
    return res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    await Job.findByIdAndDelete(jobId);
    return res.status(200).json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const toggleRecruiterApproval = async (req, res) => {
  try {
    const { recruiterId } = req.body;
    const recruiter = await Recruiter.findById(recruiterId);
    if (!recruiter) {
      return res.status(404).json({ message: "Recruiter not found" });
    }

    recruiter.isApproved = !recruiter.isApproved;
    await recruiter.save();

    return res.status(200).json({
      success: true,
      message: `Recruiter ${recruiter.isApproved ? "approved" : "revoked"} successfully`,
      isApproved: recruiter.isApproved
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =========================================
   UPLOAD ADMIN PROFILE PHOTO (GridFS)
========================================= */
export const uploadAdminProfilePic = async (req, res) => {
  try {
    const bucket = req.app.locals.bucket;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });

    uploadStream.end(req.file.buffer);

    uploadStream.on("finish", async () => {
      const admin = await Admin.findById(req.user.id);

      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin not found",
        });
      }

      admin.profilePhotoId = uploadStream.id;
      await admin.save();

      return res.status(200).json({
        success: true,
        message: "Profile picture updated successfully",
        profilePhotoId: uploadStream.id
      });
    });

    uploadStream.on("error", (err) => {
      console.error("Upload error:", err);
      return res.status(500).json({
        success: false,
        message: "File upload failed",
      });
    });

  } catch (error) {
    console.error("Admin Profile Pic Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
