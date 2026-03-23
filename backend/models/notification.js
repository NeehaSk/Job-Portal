import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: "recipientModel",
        },
        recipientModel: {
            type: String,
            required: true,
            enum: ["JobSeeker", "Recruiter"],
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["NewJob", "ApplicationStatus", "System"],
            required: true,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        link: {
            type: String, // e.g. /job/:id or /my-applications
        },
    },
    { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
