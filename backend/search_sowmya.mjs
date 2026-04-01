import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: './.env' });

const applicationSchema = new mongoose.Schema({
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: "JobSeeker" },
    applicantDetails: { fullName: String, email: String },
    createdAt: Date
}, { timestamps: true });
const Application = mongoose.model("Application", applicationSchema);

const jobSeekerSchema = new mongoose.Schema({ email: String, fullName: String });
const JobSeeker = mongoose.model("JobSeeker", jobSeekerSchema);

async function check() {
  await mongoose.connect(process.env.MONGODB_URL);
  
  const targetEmail = "pothurajusowmya29@gmail.com";
  let output = `--- SEARCHING FOR ${targetEmail} ---\n`;
  
  // 1. Find all seeker accounts with this email
  const seekers = await JobSeeker.find({ email: targetEmail });
  const seekerIds = seekers.map(s => s._id);
  output += `Found ${seekers.length} seeker accounts for this email: ${JSON.stringify(seekerIds)}\n\n`;
  
  // 2. Find applications by seeker IDs OR by applicantDetails email
  const apps = await Application.find({
      $or: [
          { applicant: { $in: seekerIds } },
          { "applicantDetails.email": targetEmail }
      ]
  }).sort({ createdAt: -1 });
  
  output += `Found ${apps.length} applications linked to this email.\n`;
  for (const app of apps) {
      output += `[${app.createdAt}] AppID: ${app._id} | ApplicantID: ${app.applicant} | DetailsEmail: ${app.applicantDetails?.email}\n`;
  }
  
  fs.writeFileSync('search_results.txt', output);
  console.log("Written to search_results.txt");
  process.exit(0);
}
check();
