import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/apiCheck";
import toast from "react-hot-toast";

export default function VerifyReset() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerifyOtp = async () => {
    if (!otp) return toast.error("Enter OTP");

    try {
      setLoading(true);

      const res = await API.post("/auth/verify-forgot-otp", {
        email,
        otp,
      });

      toast.success(res.data.message);
      setOtpVerified(true);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) return toast.error("Enter new password");

    try {
      setLoading(true);

      const res = await API.post("/auth/reset-password", {
        email,
        otp,
        password: newPassword,
      });

      toast.success(res.data.message);
      navigate("/login");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Password reset failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-[380px] bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Verify OTP & Reset Password
        </h2>

        {!otpVerified && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full border border-gray-300 p-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {otpVerified && (
          <>
            <input
              type="password"
              placeholder="Enter New Password"
              className="w-full border border-gray-300 p-2 rounded-lg mb-4 mt-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
