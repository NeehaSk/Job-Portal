import Recruiter from "../models/recruiter.js";

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
        const user = await Recruiter.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "Recruiter not found" });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error("Get Recruiter Profile Error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const user = await Recruiter.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "Recruiter not found" });
        }

        const {
            fullName,
            mobile,
            designation,
            alternateMobile,
            linkedin,
            bio,
            companyName,
            location,
            website,
            industry,
            companySize,
            description,
        } = req.body;

        // Update basic fields
        if (fullName !== undefined) user.fullName = fullName;
        if (mobile !== undefined) user.mobile = mobile;
        if (designation !== undefined) user.designation = designation;
        if (alternateMobile !== undefined) user.alternateMobile = alternateMobile;
        if (linkedin !== undefined) user.linkedin = linkedin;
        if (bio !== undefined) user.bio = bio;

        // Update company details
        if (companyName !== undefined) user.companyDetails.name = companyName;
        if (location !== undefined) user.companyDetails.location = location;
        if (website !== undefined) user.companyDetails.website = website;
        if (industry !== undefined) user.companyDetails.industry = industry;
        if (companySize !== undefined) user.companyDetails.companySize = companySize;
        if (description !== undefined) user.companyDetails.description = description;
                                                    
        await user.save();

        return res.status(200).json({
            message: "Profile updated successfully",
            user
        });
    } catch (error) {
        console.error("Update Recruiter Profile Error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const uploadProfilePic = async (req, res) => {
    try {
        const bucket = req.app.locals.bucket;

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const fileId = await uploadToGridFS(bucket, req.file);

        const user = await Recruiter.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "Recruiter not found" });
        }

        // Assuming we might want to store the photo ID in the recruiter model
        // Note: The recruiter model doesn't have a profilePhotoId field yet,
        // but we can add it or just return the ID for now.
        user.profilePhotoId = fileId;
        await user.save();

        return res.status(200).json({
            message: "Profile picture uploaded successfully",
            fileId
        });
    } catch (error) {
        console.error("Upload Recruiter Profile Pic Error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
