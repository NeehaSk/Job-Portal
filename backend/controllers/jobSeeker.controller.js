import JobSeeker from "../models/jobSeeker.js";
import multer from "multer";

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

export const getMyProfile = async (req, res) => {
  try {
    const user = await JobSeeker
      .findById(req.user.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);

  } catch (error) {
    console.error("Get Profile Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const user = await JobSeeker.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const {
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
      graduationYear,
      certifications,
      github,
      linkedin,
    } = req.body;

    // ===== Update Basic Profile =====
    const profileUpdates = {
      headline,
      skills,
      experience,
      currentCompany,
      designation,
      industry,
      expectedSalary,
      certifications,
    };

    Object.keys(profileUpdates).forEach((key) => {
      if (profileUpdates[key] !== undefined) {
        user.profile[key] = profileUpdates[key];
      }
    });

    // ===== Update Education =====
    const educationUpdates = {
      highestQualification,
      collegeName,
      university,
      graduationYear,
    };

    Object.keys(educationUpdates).forEach((key) => {
      if (educationUpdates[key] !== undefined) {
        user.profile.education[key] = educationUpdates[key];
      }
    });

    // ===== Update Social Links =====
    if (github !== undefined) {
      user.profile.socialLinks.github = github;
    }

    if (linkedin !== undefined) {
      user.profile.socialLinks.linkedin = linkedin;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
    });

  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

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

    user.profile.profilePhotoId = fileId;

    await user.save();

    return res.status(200).json({
      message: "Profile picture uploaded successfully",
    });

  } catch (error) {
    console.error("Upload Profile Pic Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


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

    user.profile.resumeId = fileId;

    await user.save();

    return res.status(200).json({
      message: "Resume uploaded successfully",
    });

  } catch (error) {
    console.error("Upload Resume Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


