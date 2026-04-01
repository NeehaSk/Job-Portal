
import mongoose from "mongoose";
import "dotenv/config";

const checkFiles = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to DB");

        const db = mongoose.connection.db;
        const filesCollection = db.collection("uploads.files");
        const files = await filesCollection.find({}).limit(5).toArray();

        console.log("Files in uploads.files:", files.length);
        files.forEach(f => {
            console.log(`ID: ${f._id}, Filename: ${f.filename}, ContentType: ${f.contentType}`);
        });

        const seekers = await db.collection("jobseekers").find({ "profile.resumeId": { $exists: true } }).limit(5).toArray();
        console.log("Seekers with resumes:", seekers.length);
        seekers.forEach(s => {
            console.log(`Seeker: ${s.fullName}, ResumeID: ${s.profile.resumeId}`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkFiles();
