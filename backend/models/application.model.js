import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobSeeker",
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Shortlisted", "Interview", "Selected", "Rejected"],
      default: "Pending",
    },

    nextStep: {
      type: String,
      default: "Wait for recruiter review",
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    },

    // Snapshot of seeker info at time of application
    applicantDetails: {
      fullName: String,
      email: String,
      skills: [String],
      experience: String,
    },

    // Communication thread
    messages: [{
      sender: { type: mongoose.Schema.Types.ObjectId, required: true },
      senderModel: { type: String, enum: ['JobSeeker', 'Recruiter'], required: true },
      content: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }],

    interviewDetails: {
      date: Date,
      time: String,
      link: String,
      instructions: String
    }
  },
  { timestamps: true }
);

// Prevent duplicate applications
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);