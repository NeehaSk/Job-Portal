import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    // Who posted the job
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recruiter",
      required: true,
    },

    //  Basic Info
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    companyLogo: {
      type: String, // store logo URL from recruiter profile
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    //  Modern Filters (Important)
    category: {
      type: String,
      required: true,
      trim: true,
    },

    workMode: {
      type: String,
      enum: ["Remote", "On-site", "Hybrid"],
      required: true,
    },

    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Contract"],
      required: true,
    },

    experienceLevel: {
      type: String,
      enum: ["Fresher", "1-3 years", "3-5 years", "5+ years"],
      required: true,
    },

    //  Salary Structure (Better than string)
    salary: {
      min: {
        type: Number,
        required: true,
      },
      max: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        default: "INR",
      },
      period: {
        type: String,
        enum: ["Yearly", "Monthly"],
        default: "Yearly",
      },
    },

    //  Skills & Requirements
    skillsRequired: [
      {
        type: String,
        trim: true,
      },
    ],

    requirements: [
      {
        type: String,
        trim: true,
      },
    ],

    description: {
      type: String,
      required: true,
      minlength: 10,
    },

    //  Application Tracking (Lightweight)
    applicantsCount: {
      type: Number,
      default: 0,
    },

    applicationDeadline: {
      type: Date,
    },

    //  Status Control
    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
    },
  },
  { timestamps: true }
);




//  TEXT INDEX FOR SEARCH (Very Important)
jobSchema.index({
  title: "text",
  companyName: "text",
  skillsRequired: "text",
  category: "text",
});

export default mongoose.model("Job", jobSchema);