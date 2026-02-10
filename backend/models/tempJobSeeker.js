// import mongoose from "mongoose";

// const tempJobSeekerSchema = new mongoose.Schema(
//   {
//     fullName: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     email: {
//       type: String,
//       required: true,
//       lowercase: true,
//       trim: true,
//     },

//     otp: {
//       type: String,
//       required: true,
//     },

//     otpExpiresAt: {
//       type: Date,
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Auto-delete after 10 minutes
// tempJobSeekerSchema.index(
//   { createdAt: 1 },
//   { expireAfterSeconds: 600 }
// );

// const TempJobSeeker = mongoose.model(
//   "TempJobSeeker",
//   tempJobSeekerSchema
// );

// export default TempJobSeeker;

import mongoose from "mongoose";

const tempJobSeekerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ["jobseeker"],
      default: "jobseeker",
    },

    otp: {
      type: String,
      required: true,
    },

    otpExpiresAt: {
      type: Date,
      required: true,
    },

    // ✅ ADD THIS
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-delete after 10 minutes
tempJobSeekerSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 600 }
);

const TempJobSeeker = mongoose.model(
  "TempJobSeeker",
  tempJobSeekerSchema
);

export default TempJobSeeker;
