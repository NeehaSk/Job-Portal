import mongoose from 'mongoose';
import Application from '../backend/models/application.model.js';
import JobSeeker from '../backend/models/jobSeeker.js';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

async function checkApps() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const totalApps = await Application.countDocuments({});
    console.log(`Total applications in entire database: ${totalApps}`);
    
    // Find all job seekers to see who they belong to
    const seekers = await JobSeeker.find({}, 'fullName email');
    console.log(`Found ${seekers.length} job seekers.`);
    
    for (const seeker of seekers) {
      const count = await Application.countDocuments({ applicant: seeker._id });
      console.log(`- Seeker: ${seeker.fullName} (${seeker.email}) has ${count} applications.`);
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkApps();
