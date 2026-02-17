// import mongoose from "mongoose";

// const tempRecruiterSchema = new mongoose.Schema(
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

// // auto delete after 10 minutes
// tempRecruiterSchema.index(
//   { createdAt: 1 },
//   { expireAfterSeconds: 600 }
// );                                

// const TempRecruiter = mongoose.model("TempRecruiter", tempRecruiterSchema);

// export default TempRecruiter;

import mongoose from "mongoose";

const tempRecruiterSchema = new mongoose.Schema(
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

// auto delete after 10 minutes
tempRecruiterSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 600 }
);

const TempRecruiter = mongoose.model("TempRecruiter", tempRecruiterSchema);

export default TempRecruiter;
