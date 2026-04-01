import mongoose from "mongoose";
import bcrypt from "bcrypt";
import "dotenv/config";
import JobSeeker from "./models/jobSeeker.js";
import Recruiter from "./models/recruiter.js";
import Job from "./models/job.model.js";
import Application from "./models/application.model.js";

const seedDatabase = async () => {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected Successfully.");

    console.log("Clearing existing test data...");
    await JobSeeker.deleteMany({ email: { $regex: "test" } });
    await Recruiter.deleteMany({ email: { $regex: "test" } });
    await Job.deleteMany({ title: { $regex: "Test" } });
    await Application.deleteMany({}); // Wipe applications to reset

    const hashedPassword = await bcrypt.hash("password123", 10);

    console.log("Creating Test Recruiters...");
    const recruiters = await Recruiter.insertMany([
      {
        fullName: "Alex Rivera",
        email: "alex.tech@test.com",
        password: hashedPassword,
        mobile: "1234567890",
        companyDetails: { name: "TechCorp Global", website: "https://techcorp.test" },
        isApproved: true,
      },
      {
        fullName: "Sarah Chen",
        email: "sarah.design@test.com",
        password: hashedPassword,
        mobile: "0987654321",
        companyDetails: { name: "Creative Studio", website: "https://creative.test" },
        isApproved: false, // Pending verification
      }
    ]);

    console.log("Creating Test Job Seekers...");
    const seekers = await JobSeeker.insertMany([
      {
        fullName: "John Doe",
        email: "john.seeker@test.com",
        password: hashedPassword,
        mobile: "1112223333",
        skills: ["React", "Node.js", "MongoDB"],
        resume: null
      },
      {
        fullName: "Emma Wilson",
        email: "emma.seeker@test.com",
        password: hashedPassword,
        mobile: "4445556666",
        skills: ["UI/UX", "Figma", "Tailwind"],
        resume: null
      },
      {
        fullName: "David Kim",
        email: "david.seeker@test.com",
        password: hashedPassword,
        mobile: "7778889999",
        skills: ["Python", "Django", "PostgreSQL"],
        resume: null
      }
    ]);

    console.log("Creating Test Jobs...");
    const jobs = await Job.insertMany([
      {
        title: "Senior Full Stack Test Engineer",
        description: "Looking for an experienced engineer...",
        category: "Engineering",
        salary: { min: 100000, max: 150000 },
        experienceLevel: "5+ years",
        location: "New York, NY",
        workMode: "Hybrid",
        jobType: "Full-time",
        skillsRequired: ["React", "Node.js"],
        recruiter: recruiters[0]._id,
        companyName: recruiters[0].companyDetails.name,
      },
      {
        title: "UX/UI Test Designer",
        description: "Creative designer needed...",
        category: "Design",
        salary: { min: 80000, max: 100000 },
        experienceLevel: "3-5 years",
        location: "San Francisco, CA",
        workMode: "Remote",
        jobType: "Contract",
        skillsRequired: ["Figma", "Design Systems"],
        recruiter: recruiters[0]._id,
        companyName: recruiters[0].companyDetails.name,
      }
    ]);

    console.log("Creating Test Applications...");
    await Application.insertMany([
      {
        job: jobs[0]._id,
        applicant: seekers[0]._id,
        status: "Pending"
      },
      {
        job: jobs[1]._id,
        applicant: seekers[1]._id,
        status: "Shortlisted"
      }
    ]);

    console.log("🎉 Database Successfully Seeded with Mock Data!");
    console.log("Refresh your Admin Dashboard to see the new data.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedDatabase();
