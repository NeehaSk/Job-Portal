import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

function Signup() {
  /* =========================
     ROLE
  ========================= */
  const [role, setRole] = useState("jobseeker");

  /* =========================
     COMMON FIELDS
  ========================= */
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");

  /* =========================
     JOB SEEKER FIELDS
  ========================= */
  const [gender, setGender] = useState("");
  const [qualification, setQualification] = useState("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");

  /* =========================
     RECRUITER FIELDS
  ========================= */
  const [designation, setDesignation] = useState("");
  const [companyName, setCompanyName] = useState("");

  /* =========================
     OTP STATES
  ========================= */
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  /* =========================
     UI STATES
  ========================= */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =========================
     SEND OTP
  ========================= */
  const handleSendOtp = async () => {
    setError("");
    setSuccess("");

    if (!fullName || !email) {
      setError("Full name and email are required");
      toast.error("Full name and email are required");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/auth/send-otp", {
        fullName,
        email,
        role,
      });
      setOtpSent(true);
      setSuccess("OTP sent to your email");
      toast.success("OTP sent to your email");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to send OTP";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     VERIFY OTP
  ========================= */
  const handleVerifyOtp = async () => {
    setError("");
    setSuccess("");

    if (!otp) {
      setError("Enter OTP");
      toast.error("Enter OTP");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email,
        otp,
        role,
      });
      setOtpVerified(true);
      setSuccess("Email verified successfully");
      toast.success("Email verified successfully");
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid OTP";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     SIGNUP
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otpVerified) {
      setError("Please verify email first");
      toast.error("Please verify email first");
      return;
    }

    try {
      setLoading(true);

      let payload = {
        fullName,
        email,
        password,
        mobile,
      };

      if (role === "recruiter") {
        payload.designation = designation;
        payload.companyDetails = {
          name: companyName,
          location,
        };
      } else {
        payload.gender = gender;
        payload.qualification = qualification;
        payload.status = status;
        payload.location = location;
      }

      await axios.post(
        role === "recruiter"
          ? "http://localhost:5000/api/auth/signup-recruiter"
          : "http://localhost:5000/api/auth/signup-jobseeker",
        payload
      );

      setSuccess("Signup successful 🎉");
      toast.success("Signup successful 🎉");

      // reset
      setFullName("");
      setEmail("");
      setOtp("");
      setPassword("");
      setMobile("");
      setGender("");
      setQualification("");
      setStatus("");
      setLocation("");
      setDesignation("");
      setCompanyName("");
      setOtpSent(false);
      setOtpVerified(false);
    } catch (err) {
      const msg = err.response?.data?.message || "Signup failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-[#0a0f1c] flex items-center justify-center p-6 overflow-hidden">
      
      {/* DYNAMIC BACKGROUND ANIMATIONS (NAUKRI INSPIRED) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] bg-indigo-600/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[80px] animate-blob animation-delay-4000"></div>
        
        {/* Animated Grid Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0f1c] via-[#0a0f1c]/90 to-blue-900/20"></div>
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* LEFT SIDE: NEXUS BRANDING */}
        <div className="hidden lg:flex flex-col text-white space-y-8 animate-fadeIn">
          <div>
            <div className="flex items-center gap-3 mb-6 animate-float">
                <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20 border border-white/10">
                    <span className="text-3xl font-black italic tracking-tighter">N</span>
                </div>
                <span className="text-4xl font-black tracking-tighter uppercase">Nexus</span>
            </div>
            <h1 className="text-5xl xl:text-7xl font-black leading-[1.1] tracking-tight mb-6">
              Empowering <br />
              <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">Careers.</span>
            </h1>
            <p className="text-slate-400 text-xl font-medium max-w-md leading-relaxed">
              Join the ecosystem where talent meets vision. Let's build the future together.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-4">
            <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-300">
                <div className="text-blue-400 text-3xl font-black mb-1">10k+</div>
                <div className="text-xs font-black uppercase tracking-widest text-slate-500">Active Jobs</div>
            </div>
            <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-300">
                <div className="text-indigo-400 text-3xl font-black mb-1">2k+</div>
                <div className="text-xs font-black uppercase tracking-widest text-slate-500">Top Recruiters</div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: PREMIUM FORM CARD */}
        <div className="flex justify-center lg:justify-end animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-[3rem] shadow-[0_32px_120px_-15px_rgba(0,0,0,0.5)] p-10 relative overflow-hidden group">
            
            <div className="mb-10">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Join Nexus</h2>
                    <span className="text-[10px] font-black uppercase border border-slate-100 px-3 py-1 rounded-full text-slate-400 tracking-widest bg-slate-50">Secure Portal</span>
                </div>
                <p className="text-slate-400 font-bold text-sm uppercase tracking-tight">Create your official {role} profile</p>
            </div>

            {/* ROLE SWITCH */}
            <div className="bg-slate-50 p-1.5 rounded-3xl flex gap-1.5 mb-8 border border-slate-100">
              <button
                type="button"
                onClick={() => setRole("jobseeker")}
                className={`flex-1 py-3.5 px-4 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${role === "jobseeker"
                    ? "bg-white text-blue-600 shadow-xl shadow-blue-900/5 border border-slate-100"
                    : "text-slate-400 hover:text-slate-600"
                  }`}
              >
                Job Seeker
              </button>
              <button
                type="button"
                onClick={() => setRole("recruiter")}
                className={`flex-1 py-3.5 px-4 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${role === "recruiter"
                    ? "bg-white text-indigo-600 shadow-xl shadow-indigo-900/5 border border-slate-100"
                    : "text-slate-400 hover:text-slate-600"
                  }`}
              >
                Recruiter
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              
              {/* SECTION: PERSONAL INFO */}
              <div className="space-y-5">
                <div className="relative group/field">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 mb-2 block transition-colors group-focus-within/field:text-blue-500">Full Name</label>
                  <input
                    className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-slate-800 font-bold placeholder:text-slate-300 disabled:bg-slate-50/50 disabled:text-slate-400"
                    placeholder="Enter your full name"
                    value={fullName}
                    disabled={otpVerified || loading}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="relative group/field">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 mb-2 block transition-colors group-focus-within/field:text-blue-500">Email Address</label>
                  <div className="flex gap-3">
                    <input
                      className="flex-1 bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-slate-800 font-bold placeholder:text-slate-300 disabled:bg-slate-50/50"
                      placeholder="name@nexus.com"
                      type="email"
                      value={email}
                      disabled={otpVerified || loading}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={otpVerified || loading}
                      className="bg-slate-900 hover:bg-black text-white px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-200 disabled:opacity-50 active:scale-95 whitespace-nowrap"
                    >
                      {loading ? "..." : otpSent ? "Resend" : "Send OTP"}
                    </button>
                  </div>
                </div>

                {otpSent && !otpVerified && (
                  <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100/50 space-y-4 animate-fadeIn">
                    <label className="block text-[10px] font-black text-blue-600 uppercase tracking-widest text-center">Verify Email</label>
                    <div className="flex gap-3">
                      <input
                        className="flex-1 bg-white border border-blue-200 px-5 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/20 transition-all text-center tracking-[0.5em] font-black text-lg text-blue-700"
                        placeholder="······"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-200 transition-all active:scale-95"
                      >
                        {loading ? "..." : "Verify"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION: ACCOUNT SECURITY */}
              {otpVerified && (
                <div className="space-y-6 pt-4 animate-fadeIn">
                  <div className="h-px bg-slate-100 w-full mb-8"></div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="group/field">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 mb-2 block group-focus-within/field:text-blue-500">Password</label>
                      <input
                        className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-slate-800 font-bold placeholder:text-slate-300"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="group/field">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 mb-2 block group-focus-within/field:text-blue-500">Phone</label>
                      <input
                        className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-slate-800 font-bold placeholder:text-slate-300"
                        placeholder="+91"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* ROLE SPECIFIC FIELDS */}
                  {role === "jobseeker" ? (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="group/field">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 mb-2 block group-focus-within/field:text-blue-500">Gender</label>
                          <select
                            className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 cursor-pointer text-slate-800 font-bold appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2394A3B8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px] bg-[right_1.25rem_center] bg-no-repeat"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            required
                          >
                            <option value="">Select</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                          </select>
                        </div>
                        <div className="group/field">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 mb-2 block group-focus-within/field:text-blue-500">Status</label>
                          <select
                            className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 cursor-pointer text-slate-800 font-bold appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2394A3B8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px] bg-[right_1.25rem_center] bg-no-repeat"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            required
                          >
                            <option value="">Select</option>
                            <option>Student</option>
                            <option>Fresher</option>
                            <option>Experienced</option>
                          </select>
                        </div>
                      </div>
                      <div className="group/field">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 mb-2 block group-focus-within/field:text-blue-500">Highest Qualification</label>
                        <input
                          className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-slate-800 font-bold placeholder:text-slate-300"
                          placeholder="e.g. Master of Business Administration"
                          value={qualification}
                          onChange={(e) => setQualification(e.target.value)}
                          required
                        />
                      </div>
                      <div className="group/field">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 mb-2 block group-focus-within/field:text-blue-500">Location</label>
                        <input
                          className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-slate-800 font-bold placeholder:text-slate-300"
                          placeholder="Current City"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div className="group/field">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 mb-2 block group-focus-within/field:text-indigo-500">Designation</label>
                        <input
                          className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all text-slate-800 font-bold placeholder:text-slate-300"
                          placeholder="e.g. Talent Acquisition Lead"
                          value={designation}
                          onChange={(e) => setDesignation(e.target.value)}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="group/field">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 mb-2 block group-focus-within/field:text-indigo-500">Company</label>
                          <input
                            className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all text-slate-800 font-bold placeholder:text-slate-300"
                            placeholder="Company Name"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="group/field">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 mb-2 block group-focus-within/field:text-indigo-500">HQ Location</label>
                          <input
                            className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all text-slate-800 font-bold placeholder:text-slate-300"
                            placeholder="City, Country"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    disabled={!otpVerified || loading}
                    className={`w-full py-5 rounded-[1.5rem] font-black text-[12px] uppercase tracking-[0.2em] shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-6 flex items-center justify-center gap-3 ${role === 'jobseeker' ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-900/10' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-900/10'}`}
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Wait...
                      </>
                    ) : (
                      "Establish Profile"
                    )}
                  </button>
                </div>
              )}
            </form>

            <div className="mt-10 pt-8 border-t border-slate-50 text-center">
              <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 ml-2 border-b-2 border-blue-500/20 hover:border-blue-500 transition-all pb-0.5">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

    <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #e2e8f0;
            border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #cbd5e1;
        }
    `}} />
    </div>
  );
}

export default Signup;
