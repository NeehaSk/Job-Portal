// import mongoose from "mongoose";

// const companyDetailsSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     website: {
//       type: String,
//       trim: true,
//     },
//     industry: {
//       type: String,
//       trim: true,
//     },
//     location: {
//       type: String,
//       trim: true,
//     },
//   },

// );

// const userSchema = new mongoose.Schema(
//   {
//     // Common fields
//     fullName: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },

//     password: {
//       type: String,
//       required: true,
//     },

//     mobile: {
//       type: String,
//       required: true,
//     },

//     role: {
//       type: String,
//       enum: ["recruiter", "jobseeker", "admin"],
//       required: true,
//     },



//     // Recruiter-specific
//     designation: {
//       type: String,
//       trim: true,
//     },

//     companyDetails: {
//       type: companyDetailsSchema,
//       required: function () {
//         return this.role === "recruiter";
//       },
//     },

//     // OTP fields (✅ CORRECT PLACE)
//     otp: {
//       type: String,
//     },

//     otpExpiresAt: {
//       type: Date,
//     },

//     // System fields

//   },
//   {
//     timestamps: true,
//   }
// );

// const User = mongoose.model("User", userSchema);//
// export default User;
import mongoose from "mongoose";

const companyDetailsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const recruiterSchema = new mongoose.Schema(
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

    designation: {
      type: String,
      trim: true,
    },
    alternateMobile: { type: String, 
      trim: true },

    companyDetails: {
      name: { type: String, required: true, trim: true },
      location: { type: String, trim: true },
      website: { type: String, trim: true },
      industry: { type: String, trim: true },
      companySize: { type: String, trim: true },
      description: { type: String, trim: true },
    },
    linkedin: { type: String, trim: true },
    bio: { type: String, trim: true },
    profilePhotoId: { type: String }, // Explicitly add this for clarity
    resetOtp: {
      type: Number,
    },

    resetOtpExpires: {
      type: Number,
    },

    // email verification status
    // isEmailVerified: {
    //   type: Boolean,
    //   default: false,
    // },

    // admin approval
    // isApproved: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  {
    timestamps: true,
  }
);

const Recruiter = mongoose.model("Recruiter", recruiterSchema);
export default Recruiter;
