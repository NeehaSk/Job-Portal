import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Define model locally to avoid import issues from backend folder
const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: "JobSeeker" },
    status: String,
    applicantDetails: { fullName: String, email: String },
    createdAt: Date
  },
  { timestamps: true }
);
const Application = mongoose.model("Application", applicationSchema);

const jobSeekerSchema = new mongoose.Schema({
  fullName: String,
  email: String
});
const JobSeeker = mongoose.model("JobSeeker", jobSeekerSchema);

dotenv.config({ path: './backend/.env' });

async function checkApps() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("--- ALL APPLICATIONS IN DATABASE ---");
    const apps = await Application.find({}).sort({ createdAt: -1 });
    console.log(`Total Applications: ${apps.length}`);
    
    for (const app of apps) {
        const seeker = await JobSeeker.findById(app.applicant);
        console.log(`[${app.createdAt}] Status: ${app.status} | Applicant: ${seeker?.fullName || 'NOT FOUND'} (${seeker?.email || 'N/A'}) | AppDetails Email: ${app.applicantDetails?.email || 'N/A'}`);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
checkApps();
