import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/apiCheck";
import toast from "react-hot-toast";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const sendOtp = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    try {
      await api.post("/auth/forgot-password", { email });

      toast.success("OTP sent successfully");

      navigate("/verify-reset", {
        state: { email },
      });

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to send OTP"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={sendOtp}
        className="w-[380px] bg-white p-6 rounded-xl shadow-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">
          Forgot Password
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border border-gray-300 p-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-black transition"
        >
          Send OTP
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
