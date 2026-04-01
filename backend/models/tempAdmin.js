import mongoose from "mongoose";

const tempAdminSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  otpExpiresAt: { type: Date, required: true },
  isVerified: { type: Boolean, default: false },
});

const TempAdmin = mongoose.model("TempAdmin", tempAdminSchema);
export default TempAdmin;
