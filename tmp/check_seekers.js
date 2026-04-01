import mongoose from 'mongoose';
import dotenv from 'dotenv';
import JobSeeker from './backend/models/jobSeeker.js';

dotenv.config({ path: './backend/.env' });

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to DB");

    const seekers = await JobSeeker.find({ isActive: true });
    console.log(`Total Active Seekers: ${seekers.length}`);

    seekers.forEach(s => {
      console.log(`Seeker: ${s.fullName}, Email: ${s.email}, Skills: ${JSON.stringify(s.profile.skills)}`);
    });

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
