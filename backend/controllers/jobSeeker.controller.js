// // import JobSeeker from "../models/jobSeeker.js";
// // import multer from "multer"; 

// // const uploadToGridFS = (bucket, file) => {
// //   return new Promise((resolve, reject) => {
// //     if (!file) return resolve(null);

// //     const uploadStream = bucket.openUploadStream(file.originalname, {
// //       contentType: file.mimetype,
// //     });

// //     uploadStream.end(file.buffer);

// //     uploadStream.on("finish", () => resolve(uploadStream.id));
// //     uploadStream.on("error", reject);
// //   });
// // };

// // export const getMyProfile = async (req, res) => {
// //   try {
// //     const user = await JobSeeker
// //       .findById(req.user.id)
// //       .select("-password");

// //     if (!user) {
// //       return res.status(404).json({ message: "User not found" });
// //     }

// //     return res.status(200).json(user);

// //   } catch (error) {
// //     console.error("Get Profile Error:", error);
// //     return res.status(500).json({ message: "Server error" });
// //   }
// // };
// // export const updateProfile = async (req, res) => {
// //   try {
// //     const user = await JobSeeker.findById(req.user.id);

// //     if (!user) {
// //       return res.status(404).json({ message: "User not found" });
// //     }

// //     const {
// //       headline,
// //       skills,
// //       experience,
// //       currentCompany,
// //       designation,
// //       industry,
// //       expectedSalary,
// //       highestQualification,
// //       collegeName,
// //       university,
// //       graduationYear,
// //       certifications,
// //       github,
// //       linkedin,
// //     } = req.body;

// //     // ===== Update Basic Profile =====
// //     const profileUpdates = {
// //       headline,
// //       skills,
// //       experience,
// //       currentCompany,
// //       designation,
// //       industry,
// //       expectedSalary,
// //       certifications,
// //     };

// //     Object.keys(profileUpdates).forEach((key) => {
// //       if (profileUpdates[key] !== undefined) {
// //         user.profile[key] = profileUpdates[key];
// //       }
// //     });

// //     // ===== Update Education =====
// //     const educationUpdates = {
// //       highestQualification,
// //       collegeName,
// //       university,
// //       graduationYear,
// //     };

// //     Object.keys(educationUpdates).forEach((key) => {
// //       if (educationUpdates[key] !== undefined) {
// //         user.profile.education[key] = educationUpdates[key];
// //       }
// //     });

// //     // ===== Update Social Links =====
// //     if (github !== undefined) {
// //       user.profile.socialLinks.github = github;
// //     }

// //     if (linkedin !== undefined) {
// //       user.profile.socialLinks.linkedin = linkedin;
// //     }

// //     await user.save();

// //     return res.status(200).json({
// //       message: "Profile updated successfully",
// //     });

// //   } catch (error) {
// //     console.error("Update Profile Error:", error);
// //     return res.status(500).json({
// //       message: "Server error",
// //     });
// //   }
// // };

// // export const uploadProfilePic = async (req, res) => {
// //   try {
// //     const bucket = req.app.locals.bucket;

// //     if (!req.file) {
// //       return res.status(400).json({ message: "No file uploaded" });
// //     }

// //     const fileId = await uploadToGridFS(bucket, req.file);

// //     const user = await JobSeeker.findById(req.user.id);

// //     if (!user) {
// //       return res.status(404).json({ message: "User not found" });
// //     }

// //     user.profile.profilePhotoId = fileId;

// //     await user.save();

// //     return res.status(200).json({
// //       message: "Profile picture uploaded successfully",
// //     });

// //   } catch (error) {
// //     console.error("Upload Profile Pic Error:", error);
// //     return res.status(500).json({ message: "Server error" });
// //   }
// // };


// // export const uploadResume = async (req, res) => {
// //   try {
// //     const bucket = req.app.locals.bucket;

// //     if (!req.file) {
// //       return res.status(400).json({ message: "No file uploaded" });
// //     }

// //     const fileId = await uploadToGridFS(bucket, req.file);

// //     const user = await JobSeeker.findById(req.user.id);

// //     if (!user) {
// //       return res.status(404).json({ message: "User not found" });
// //     }

// //     user.profile.resumeId = fileId;

// //     await user.save();

// //     return res.status(200).json({
// //       message: "Resume uploaded successfully",
// //     });

// //   } catch (error) {
// //     console.error("Upload Resume Error:", error);
// //     return res.status(500).json({ message: "Server error" });
// //   }
// // };


// export const updateProfile = async (req, res) => {
//   try {
//     const user = await JobSeeker.findById(req.user.id);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const {
//       headline,
//       skills,
//       experience,
//       currentCompany,
//       designation,
//       industry,
//       expectedSalary,
//       highestQualification,
//       collegeName,
//       university,
//       graduationYear,
//       certifications,
//       github,
//       linkedin,
//     } = req.body;

//     // ===== BASIC PROFILE FIELDS =====
//     if (headline !== undefined) user.profile.headline = headline;
//     if (experience !== undefined) user.profile.experience = experience;
//     if (currentCompany !== undefined) user.profile.currentCompany = currentCompany;
//     if (designation !== undefined) user.profile.designation = designation;
//     if (industry !== undefined) user.profile.industry = industry;
//     if (expectedSalary !== undefined) user.profile.expectedSalary = expectedSalary;
//     if (certifications !== undefined) user.profile.certifications = certifications;

//     // 🔥 ===== NORMALIZE & SAVE SKILLS PROPERLY =====
//     if (skills !== undefined) {
//       if (Array.isArray(skills)) {
//         user.profile.skills = skills
//           .map((s) => s.trim().toLowerCase())
//           .filter(Boolean);
//       } else if (typeof skills === "string") {
//         user.profile.skills = skills
//           .split(",")
//           .map((s) => s.trim().toLowerCase())
//           .filter(Boolean);
//       }
//     }

//     // ===== EDUCATION =====
//     if (highestQualification !== undefined)
//       user.profile.education.highestQualification = highestQualification;

//     if (collegeName !== undefined)
//       user.profile.education.collegeName = collegeName;

//     if (university !== undefined)
//       user.profile.education.university = university;

//     if (graduationYear !== undefined)
//       user.profile.education.graduationYear = graduationYear;

//     // ===== SOCIAL LINKS =====
//     if (github !== undefined)
//       user.profile.socialLinks.github = github;

//     if (linkedin !== undefined)
//       user.profile.socialLinks.linkedin = linkedin;

//     await user.save();

//     return res.status(200).json({
//       message: "Profile updated successfully",
//     });

//   } catch (error) {
//     console.error("Update Profile Error:", error);
//     return res.status(500).json({
//       message: "Server error",
//     });
//   }
// };
import JobSeeker from "../models/jobSeeker.js";
import Job from "../models/job.model.js";
import Application from "../models/application.model.js";
import Notification from "../models/notification.js";

/* =========================================
   GET MY PROFILE
========================================= */
export const getMyProfile = async (req, res) => {
  try {
    const user = await JobSeeker.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(user);

  } catch (error) {
    console.error("Get Profile Error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};


/* =========================================
   UPDATE PROFILE
========================================= */
export const updateProfile = async (req, res) => {
  try {
    const user = await JobSeeker.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const {
      altMobile,
      headline,
      skills,
      experience,
      currentCompany,
      designation,
      industry,
      expectedSalary,
      highestQualification,
      collegeName,
      university,
      course,
      stream,
      startingYear,
      graduationYear,
      courseType,
      gradingSystem,
      grade,
      certifications,
      github,
      linkedin,
      gender,
      dob,
      address,
      hometown,
      pincode,
      state,
      languagesKnown,
      employmentStatus,
    } = req.body;

    /* ===== BASIC PROFILE ===== */
    if (!user.profile) user.profile = {};

    if (headline !== undefined) user.profile.headline = headline;
    if (altMobile !== undefined) user.altMobile = altMobile;
    if (employmentStatus !== undefined) user.profile.employmentStatus = employmentStatus;
    
    // Normalize Skills
    if (skills !== undefined) {
      if (Array.isArray(skills)) {
        user.profile.skills = skills.map(s => s.trim().toLowerCase()).filter(Boolean);
      } else if (typeof skills === "string") {
        user.profile.skills = skills.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
      }
    }

    if (experience !== undefined) {
      const exp = Number(experience);
      user.profile.experience = isNaN(exp) ? 0 : exp;
    }

    if (currentCompany !== undefined) user.profile.currentCompany = currentCompany;
    if (designation !== undefined) user.profile.designation = designation;
    if (industry !== undefined) user.profile.industry = industry;
    
    if (expectedSalary !== undefined) {
      const salary = Number(expectedSalary);
      if (!isNaN(salary)) user.profile.expectedSalary = salary;
    }

    // Normalize Certifications
    if (certifications !== undefined) {
      if (Array.isArray(certifications)) {
        user.profile.certifications = certifications;
      } else if (typeof certifications === "string") {
        user.profile.certifications = certifications.split(",").map(c => c.trim()).filter(Boolean);
      }
    }

    /* ===== PERSONAL DETAILS EXTRAS ===== */
    // Only update gender if it's one of the enum values
    const validGenders = ["Male", "Female", "Other", "Prefer not to say"];
    if (gender && validGenders.includes(gender)) {
      user.profile.gender = gender;
    }

    if (dob) {
      const date = new Date(dob);
      if (!isNaN(date.getTime())) {
        user.profile.dob = date;
      }
    }

    if (address !== undefined) user.profile.address = address;
    if (hometown !== undefined) user.profile.hometown = hometown;
    if (pincode !== undefined) user.profile.pincode = pincode;
    if (state !== undefined) user.profile.state = state;
    
    // Normalize Languages
    if (languagesKnown !== undefined) {
      if (Array.isArray(languagesKnown)) {
        user.profile.languagesKnown = languagesKnown;
      } else if (typeof languagesKnown === "string") {
        user.profile.languagesKnown = languagesKnown.split(",").map(l => l.trim()).filter(Boolean);
      }
    }

    /* ===== EDUCATION ===== */
    if (!user.profile.education) user.profile.education = {};

    if (highestQualification !== undefined)
      user.profile.education.highestQualification = highestQualification;

    if (collegeName !== undefined)
      user.profile.education.collegeName = collegeName;

    if (university !== undefined)
      user.profile.education.university = university;

    if (course !== undefined)
      user.profile.education.course = course;

    if (stream !== undefined)
      user.profile.education.stream = stream;

    if (startingYear) {
      const year = Number(startingYear);
      if (!isNaN(year)) user.profile.education.startingYear = year;
    }

    if (graduationYear) {
      const year = Number(graduationYear);
      if (!isNaN(year)) user.profile.education.graduationYear = year;
    }

    const validCourseTypes = ["Full time", "Part time", "Correspondence/Distance learning"];
    if (courseType && validCourseTypes.includes(courseType)) {
      user.profile.education.courseType = courseType;
    }

    // Only update gradingSystem if it's one of the enum values
    const validGradingSystems = ["Percentage", "CGPA"];
    if (gradingSystem && validGradingSystems.includes(gradingSystem)) {
      user.profile.education.gradingSystem = gradingSystem;
    }

    if (grade !== undefined)
      user.profile.education.grade = grade;

    /* ===== SOCIAL LINKS ===== */
    if (!user.profile.socialLinks) user.profile.socialLinks = {};

    if (github !== undefined)
      user.profile.socialLinks.github = github;

    if (linkedin !== undefined)
      user.profile.socialLinks.linkedin = linkedin;

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
    });

  } catch (error) {
    console.error("Update Profile Error:", error);
    // Return specific validation error if available
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: "Validation Error",
        errors: messages,
      });
    }
    return res.status(500).json({
      message: "Server error",
      details: error.message, // Helpful for debugging
    });
  }
};


/* =========================================
   GRIDFS UPLOAD HELPER
========================================= */
const uploadToGridFS = (bucket, file) => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    const uploadStream = bucket.openUploadStream(file.originalname, {
      contentType: file.mimetype,
    });
    uploadStream.end(file.buffer);
    uploadStream.on("finish", () => resolve(uploadStream.id));
    uploadStream.on("error", reject);
  });
};

/* =========================================
   UPLOAD PROFILE PHOTO (GridFS)
========================================= */
export const uploadProfilePic = async (req, res) => {
  try {
    const bucket = req.app.locals.bucket;
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileId = await uploadToGridFS(bucket, req.file);
    const user = await JobSeeker.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.profile) user.profile = {};
    user.profile.profilePhotoId = fileId;
    
    await user.save();

    return res.status(200).json({
      message: "Profile picture uploaded successfully",
      fileId
    });

  } catch (error) {
    console.error("Upload Profile Pic Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


/* =========================================
   UPLOAD RESUME (GridFS)
========================================= */
export const uploadResume = async (req, res) => {
  try {
    const bucket = req.app.locals.bucket;
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileId = await uploadToGridFS(bucket, req.file);
    const user = await JobSeeker.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.profile) user.profile = {};
    user.profile.resumeId = fileId;
    
    await user.save();

    return res.status(200).json({
      message: "Resume uploaded successfully",
      fileId
    });

  } catch (error) {
    console.error("Upload Resume Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


/* =========================================
   GET DASHBOARD DATA
========================================= */
export const getDashboardData = async (req, res) => {
  try {
    const jobSeekerId = req.user.id;
    const user = await JobSeeker.findById(jobSeekerId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 1. Calculate Profile Completion
    const completionFields = [
      user.fullName,
      user.mobile,
      user.profile?.headline,
      user.profile?.skills?.length > 0,
      user.profile?.education?.highestQualification,
      user.profile?.education?.course,
      user.profile?.education?.collegeName,
      user.profile?.employmentStatus,
      user.profile?.profilePhotoId,
      user.profile?.resumeId,
      user.profile?.gender,
      user.profile?.dob,
      user.profile?.address || user.profile?.location,
    ];
    
    const filledFields = completionFields.filter(f => !!f).length;
    const completionPercentage = Math.round((filledFields / completionFields.length) * 100);

    // 2. Get Application Count
    const totalApplications = await Application.countDocuments({ applicant: jobSeekerId });

    // 3. Get Unread Notifications
    const unreadNotifications = await Notification.countDocuments({ 
      recipient: jobSeekerId, 
      isRead: false 
    });

    // 4. Recommended Jobs (Based on user skills)
    let recommendedJobs = [];
    if (user.profile?.skills?.length > 0) {
      recommendedJobs = await Job.find({
        status: "Open",
        $or: [
          { skillsRequired: { $in: user.profile.skills } },
          { title: { $regex: user.profile.skills.join("|"), $options: "i" } }
        ]
      })
      .limit(5)
      .sort({ createdAt: -1 });
    } else {
      // Fallback: Latest open jobs
      recommendedJobs = await Job.find({ status: "Open" })
        .limit(5)
        .sort({ createdAt: -1 });
    }

    return res.status(200).json({
      profileCompletion: completionPercentage,
      totalApplications,
      unreadNotifications,
      recommendedJobs,
      appliedJobs: await Application.find({ applicant: jobSeekerId }).select("job status appliedAt").limit(5).sort({ appliedAt: -1 })
    });

  } catch (error) {
    console.error("Dashboard Data Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =========================================
   GET PUBLIC PROFILE (For Recruiters)
========================================= */
export const getPublicProfile = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Only recruiters (and admins if they exist) should access this
    if (req.user.role !== "recruiter" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view profile" });
    }

    const seeker = await JobSeeker.findById(id).select("-password -resetOtp -resetOtpExpires");

    if (!seeker) {
      return res.status(404).json({ message: "Job seeker not found" });
    }

    return res.status(200).json(seeker);

  } catch (error) {
    console.error("Get Public Profile Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =========================================
   TOGGLE SAVE JOB
========================================= */
export const toggleSaveJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const user = await JobSeeker.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const jobIndex = user.savedJobs.indexOf(jobId);
    let isSaved = false;

    if (jobIndex === -1) {
      // Job not saved, add it
      user.savedJobs.push(jobId);
      isSaved = true;
    } else {
      // Job already saved, remove it
      user.savedJobs.splice(jobIndex, 1);
      isSaved = false;
    }

    await user.save();

    return res.status(200).json({
      message: isSaved ? "Job saved successfully" : "Job removed from saved list",
      isSaved,
      savedJobs: user.savedJobs
    });

  } catch (error) {
    console.error("Toggle Save Job Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =========================================
   GET SAVED JOBS
========================================= */
export const getSavedJobs = async (req, res) => {
  try {
    const user = await JobSeeker.findById(req.user.id).populate({
      path: "savedJobs",
      match: { status: "Open" }, // Only return open jobs
      select: "title companyName location jobType salary category skillsRequired createdAt"
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Filter out any nulls in case a job was deleted
    const validSavedJobs = user.savedJobs.filter(job => job != null);

    return res.status(200).json(validSavedJobs);

  } catch (error) {
    console.error("Get Saved Jobs Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};