import mongoose from "mongoose";
import dotenv from "dotenv";
import Job from "./models/job.model.js";
import Recruiter from "./models/recruiter.js";

dotenv.config({ path: "./.env" });

async function check() {
    try {
        const url = process.env.MONGODB_URL;
        if (!url) {
            console.error("MONGODB_URL is not defined in .env");
            process.exit(1);
        }
        await mongoose.connect(url);
        console.log("Connected to MongoDB");

        const jobs = await Job.find({});
        console.log(`Total Jobs in DB: ${jobs.length}`);
        
        if (jobs.length > 0) {
            console.log("Last 3 jobs:");
            jobs.slice(-3).forEach(j => {
                console.log(`- Title: ${j.title}, RecruiterID: ${j.recruiter}, Status: ${j.status}, CreatedAt: ${j.createdAt}`);
            });
        }

        const recruiters = await Recruiter.find({});
        console.log(`Total Recruiters in DB: ${recruiters.length}`);
        if (recruiters.length > 0) {
            console.log("Last 3 recruiters:");
            recruiters.slice(-3).forEach(r => {
                console.log(`- Name: ${r.fullName}, Email: ${r.email}, ID: ${r._id}`);
            });
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
