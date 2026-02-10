import mongoose from "mongoose";

const jobSeekerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    mobile: {
      type: String,
      required: true,
    },

    // ===== Job Seeker Fields =====
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    qualification: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Student", "Fresher", "Experienced"],
      required: true,
    },

    experience: {
      type: Number,
      default: 0,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    // ===== System Fields =====
    // isEmailVerified: {
    //   type: Boolean,
    //   default: true,          // because OTP is verified before signup
   // },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const JobSeeker = mongoose.model("JobSeeker", jobSeekerSchema);
export default JobSeeker;
