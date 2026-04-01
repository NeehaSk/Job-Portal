import Recruiter from "../models/recruiter.js";
import Job from "../models/job.model.js";
import Application from "../models/application.model.js";
import Notification from "../models/notification.js";

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

        // Ensure companyDetails exists
        if (!user.companyDetails) user.companyDetails = { name: "Pending" };

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
            user: {
                ...user.toObject(),
                profilePhotoId: user.profilePhotoId
            }
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

export const getDashboardData = async (req, res) => {
    try {
        const recruiterId = req.user.id;

        // 1. Total Jobs Posted
        const totalJobs = await Job.countDocuments({ recruiter: recruiterId });

        // 2. Fetch all job IDs for this recruiter to query applications
        const jobs = await Job.find({ recruiter: recruiterId }).select("_id");
        const jobIds = jobs.map(j => j._id);

        // 3. Total Applications Received
        const totalApplications = await Application.countDocuments({ job: { $in: jobIds } });

        // 4. Application Status Breakdown
        const statusBreakdown = await Application.aggregate([
            { $match: { job: { $in: jobIds } } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        // 5. Recent Applications (Latest 5)
        const recentApplications = await Application.find({ job: { $in: jobIds } })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("applicant", "fullName email")
            .populate("job", "title");

        // 6. Unread Notifications
        const unreadNotifications = await Notification.countDocuments({
            recipient: recruiterId,
            recipientModel: "Recruiter",
            isRead: false
        });

        // 7. Shortlisted count
        const shortlistedCount = await Application.countDocuments({
            job: { $in: jobIds },
            status: "Shortlisted"
        });

        // 8. Profile Completion Calculation
        const recruiter = await Recruiter.findById(recruiterId);
        let completion = 20; // Base for email
        if (recruiter.companyDetails?.name && recruiter.companyDetails.name !== "Pending") completion += 20;
        if (recruiter.designation) completion += 20;
        if (recruiter.bio) completion += 20;
        if (recruiter.profilePhotoId) completion += 20;

        res.status(200).json({
            totalJobs,
            totalApplications,
            shortlistedCount,
            statusBreakdown,
            recentApplications,
            unreadNotifications,
            profileCompletion: completion
        });
    } catch (error) {
        console.error("Get Recruiter Dashboard Data Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
