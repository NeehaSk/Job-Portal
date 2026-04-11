import mongoose from "mongoose";
import bcrypt from "bcrypt";
import "dotenv/config";
import Admin from "../models/admin.js";

const createAdmin = async () => {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected Successfully.");

    const email = "admin@test.com";
    const password = "adminpassword";

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log("Admin already exists:", email);
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      await Admin.create({
        fullName: "System Admin",
        email,
        password: hashedPassword,
        mobile: "1234567890",
        role: "admin",
        designation: "Platform Master",
        bio: "Managing the Nexal ecosystem."
      });
      console.log("Admin Created Successfully!");
      console.log("Email: admin@test.com");
      console.log("Password: adminpassword");
    }
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
