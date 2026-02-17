// import mongoose from "mongoose";

// const jobSeekerSchema = new mongoose.Schema(
//   {
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

//     // ===== Job Seeker Fields =====
//     gender: {
//       type: String,
//       enum: ["Male", "Female", "Other"],
//       required: true,
//     },

//     qualification: {
//       type: String,
//       required: true,
//     },

//     status: {
//       type: String,
//       enum: ["Student", "Fresher", "Experienced"],
//       required: true,
//     },

//     experience: {
//       type: Number,
//       default: 0,
//     },

//     location: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     resetOtp: {
//       type: Number,
//     },

//     resetOtpExpires: {
//       type: Number,
//     },

//     // ===== System Fields =====
//     // isEmailVerified: {
//     //   type: Boolean,
//     //   default: true,          // because OTP is verified before signup
//     // },

//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//   },

//   {
//     timestamps: true,
//   }
// );

// const JobSeeker = mongoose.model("JobSeeker", jobSeekerSchema);
// export default JobSeeker;

// import mongoose from "mongoose";

// const jobSeekerSchema = new mongoose.Schema(
//   {
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

//     // ===== PROFILE SECTION =====
//     profile: {
//       profilePhoto: {
//         type: String, // image URL (Cloudinary or local)
//       },

//       headline: {
//         type: String,
//         trim: true,
//       },

//       skills: [
//         {
//           type: String,
//           trim: true,
//         },
//       ],

//       // Education (Highest Qualification)
//       education: {
//         highestQualification: {
//           type: String,
//         },
//         collegeName: {
//           type: String,
//         },
//         university: {
//           type: String,
//         },
//         graduationYear: {
//           type: Number,
//         },
//       },

//       // Professional Info
//       experience: {
//         type: Number, // total years
//         default: 0,
//       },

//       currentCompany: {
//         type: String,
//       },

//       designation: {
//         type: String,
//       },

//       industry: {
//         type: String,
//       },

//       expectedSalary: {
//         type: Number,
//       },

//       // Extras
//       certifications: [
//         {
//           type: String,
//         },
//       ],

//       socialLinks: {
//         github: {
//           type: String,
//         },
//         linkedin: {
//           type: String,
//         },
//       },

//       resumeUrl: {
//         type: String,
//       },
//     },

//     // ===== PROFILE COMPLETION TRACKING =====
//     profileCompletion: {
//       type: Number,
//       default: 0,
//     },

//     isProfileComplete: {
//       type: Boolean,
//       default: false,
//     },

//     // ===== SYSTEM =====
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   { timestamps: true }
// );

// const JobSeeker = mongoose.model("JobSeeker", jobSeekerSchema);

// export default JobSeeker;

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

    // ===== PROFILE SECTION =====
    profile: {
      // 🔹 GridFS File IDs
      profilePhotoId: {
        type: mongoose.Schema.Types.ObjectId,
      },

      resumeId: {
        type: mongoose.Schema.Types.ObjectId,
      },

      headline: {
        type: String,
        trim: true,
      },

      skills: [
        {
          type: String,
          trim: true,
        },
      ],

      // ===== Education =====
      education: {
        highestQualification: {
          type: String,
        },
        collegeName: {
          type: String,
        },
        university: {
          type: String,
        },
        graduationYear: {
          type: Number,
        },
      },

      // ===== Professional Info =====
      experience: {
        type: Number, // total years
        default: 0,
      },

      currentCompany: {
        type: String,
      },

      designation: {
        type: String,
      },

      industry: {
        type: String,
      },

      expectedSalary: {
        type: Number,
      },

      // ===== Extras =====
      certifications: [
        {
          type: String,
        },
      ],

      socialLinks: {
        github: {
          type: String,
        },
        linkedin: {
          type: String,
        },
      },
    },

    // ===== PROFILE COMPLETION TRACKING =====
    profileCompletion: {
      type: Number,
      default: 0,
    },

    isProfileComplete: {
      type: Boolean,
      default: false,
    },

    // ===== SYSTEM =====
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const JobSeeker = mongoose.model("JobSeeker", jobSeekerSchema);

export default JobSeeker;
