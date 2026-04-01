import mongoose from 'mongoose';
import Application from './models/application.model.js';
import JobSeeker from './models/jobSeeker.js';
import dotenv from 'dotenv';
dotenv.config();

async function checkApps() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const totalApps = await Application.countDocuments({});
    console.log(`Total applications in entire database: ${totalApps}`);
    
    const seekers = await JobSeeker.find({}, 'fullName email');
    console.log(`Found ${seekers.length} job seekers.`);
    
    for (const seeker of seekers) {
      const count = await Application.countDocuments({ applicant: seeker._id });
      if (count > 0) {
        console.log(`- Seeker: ${seeker.fullName} (${seeker.email}) has ${count} applications.`);
      }
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkApps();
