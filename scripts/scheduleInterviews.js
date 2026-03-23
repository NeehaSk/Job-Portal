
import mongoose from "mongoose";
import Application from "../backend/models/application.model.js";
import Job from "../backend/models/job.model.js";
import Notification from "../backend/models/notification.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../backend/.env") });

async function scheduleInterviews() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // 1. Find all 'Shortlisted' applications
    const shortlistedApps = await Application.find({ status: "Shortlisted" }).populate('job');
    
    if (shortlistedApps.length === 0) {
      console.log("No shortlisted candidates found.");
      return;
    }

    console.log(`Found ${shortlistedApps.length} shortlisted candidates.`);

    for (const app of shortlistedApps) {
      console.log(`Scheduling interview for: ${app.applicantDetails?.fullName || 'Candidate'} (App ID: ${app._id})`);

      // 2. Update status to 'Interview' and add details
      app.status = "Interview";
      app.nextStep = "Prepare for technical round/interview";
      app.interviewDetails = {
        date: "2026-03-25",
        time: "10:00 AM",
        link: "https://meet.google.com/abc-defg-hij",
        instructions: "Please be ready with your resume and a stable internet connection."
      };
      
      app.messages.push({
        sender: app.job.recruiter,
        senderModel: "Recruiter",
        content: "Congratulations! You have been invited for an interview. Please join 5 mins early."
      });

      await app.save();

      // 3. Create Notification
      await Notification.create({
        recipient: app.applicant,
        recipientModel: "JobSeeker",
        title: "Interview Scheduled!",
        message: `Your interview for ${app.job.title} at ${app.job.companyName} is scheduled for 2026-03-25 at 10:00 AM.`,
        type: "ApplicationStatus",
        link: `/my-applications/${app._id}/tracker`
      });

      console.log(`Interview scheduled and notification sent for ${app._id}`);
    }

  } catch (error) {
    console.error("Error:", error);
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  }
}

scheduleInterviews();
