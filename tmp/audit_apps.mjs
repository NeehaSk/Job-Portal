import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

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
        let seeker = null;
        try {
            seeker = await JobSeeker.findById(app.applicant);
        } catch (e) {}
        console.log(`[${app.createdAt}] Status: ${app.status} | ApplicantID: ${app.applicant} | Name: ${seeker?.fullName || 'NOT FOUND'} (${seeker?.email || 'N/A'}) | AppDetails Email: ${app.applicantDetails?.email || 'N/A'}`);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
checkApps();
