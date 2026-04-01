import mongoose from 'mongoose';
import Application from './models/application.model.js';
import JobSeeker from './models/jobSeeker.js';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

async function checkApps() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    let out = [];
    const totalApps = await Application.countDocuments({});
    out.push(`Total applications in entire database: ${totalApps}`);
    
    const seekers = await JobSeeker.find({}, 'fullName email');
    out.push(`Found ${seekers.length} job seekers.`);
    
    for (const seeker of seekers) {
      const count = await Application.countDocuments({ applicant: seeker._id });
      if (count > 0) {
        out.push(`- Seeker: ${seeker.fullName} (${seeker.email}) has ${count} applications.`);
      }
    }
    
    fs.writeFileSync('output2.txt', out.join('\n'), 'utf8');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkApps();
