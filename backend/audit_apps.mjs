import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';

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

dotenv.config({ path: './.env' });

async function checkApps() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    let output = "--- ALL APPLICATIONS IN DATABASE ---\n";
    const apps = await Application.find({}).sort({ createdAt: -1 });
    output += `Total Applications: ${apps.length}\n`;
    
    for (const app of apps) {
        let seeker = null;
        try {
            seeker = await JobSeeker.findById(app.applicant);
        } catch (e) {}
        output += `[${app.createdAt}] Status: ${app.status} | ApplicantID: ${app.applicant} | Name: ${seeker?.fullName || 'NOT FOUND'} (${seeker?.email || 'N/A'}) | AppDetails Email: ${app.applicantDetails?.email || 'N/A'}\n`;
    }

    fs.writeFileSync('apps_audit_full.txt', output);
    console.log("Written to apps_audit_full.txt");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
checkApps();
