import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

/* ─── Icons ───────────────────────────────────────────────────────────────── */
const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState("jobseeker");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mobile, setMobile] = useState("");

  const [gender, setGender] = useState("");
  const [qualification, setQualification] = useState("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");

  const [designation, setDesignation] = useState("");
  const [companyName, setCompanyName] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async () => {
    setError("");
    if (!fullName || !email) {
      toast.error("Full name and email are required");
      return;
    }
    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/auth/send-otp", { fullName, email, role });
      setOtpSent(true);
      toast.success("OTP sent to your email");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    if (!otp) {
      toast.error("Enter OTP");
      return;
    }
    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp, role });
      setOtpVerified(true);
      toast.success("Email verified successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      toast.error("Please verify email first");
      return;
    }
    try {
      setLoading(true);
      let payload = { fullName, email, password, mobile };
      let signupUrl = "http://localhost:5000/api/auth/signup-jobseeker";

      if (role === "recruiter") {
        payload.designation = designation;
        payload.companyDetails = { name: companyName, location };
        signupUrl = "http://localhost:5000/api/auth/signup-recruiter";
      } else if (role === "admin") {
        signupUrl = "http://localhost:5000/api/auth/signup-admin";
      } else {
        payload.gender = gender;
        payload.qualification = qualification;
        payload.status = status;
        payload.location = location;
      }
      
      await axios.post(signupUrl, payload);
      toast.success("Signup successful 🎉");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-slate-950 flex items-center justify-center p-6 pt-32 overflow-hidden selection:bg-indigo-500 selection:text-white font-inter">
      
      {/* DYNAMIC MESH BACKGROUND */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-slate-950"></div>
        <div className="mesh-gradient absolute inset-0 opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/80 to-indigo-950/50"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
        
        {/* LEFT SIDE: PREMIUM BRANDING */}
        <div className="hidden lg:flex flex-col text-white space-y-12 animate-fadeInUp">
          <div className="space-y-8">
            <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-2xl shadow-indigo-500/40 border border-white/10 transition-transform group-hover:rotate-6">
                    <span className="text-2xl font-semibold tracking-tighter">N</span>
                </div>
                <div className="flex flex-col leading-none">
                    <span className="text-2xl font-semibold tracking-tighter uppercase">NEXAL <span className="text-indigo-400">ELITE</span></span>
                    <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-slate-500">Talent Ecosystem</span>
                </div>
            </div>
            
            <h1 className="text-4xl xl:text-5xl font-semibold leading-[1.2] tracking-tight mb-6">
               Architect Your <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-200">Financial Future.</span>
            </h1>
            
            <p className="text-slate-400 text-base font-medium max-w-md leading-relaxed opacity-70">
               Join 12,000+ elite professionals securing high-impact mandates at global frontier firms.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all group overflow-hidden relative">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
                <div className="text-white text-3xl font-semibold mb-1 relative z-10">10k+</div>
                <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 relative z-10">Live Assets</div>
            </div>
            <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all group overflow-hidden relative">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
                <div className="text-white text-3xl font-semibold mb-1 relative z-10">98%</div>
                <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 relative z-10">Legacy Fit</div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: MINIMALIST FORM CARD */}
        <div className="flex justify-center lg:justify-end animate-fadeInRight">
          <div className="w-full max-w-xl bg-white rounded-[3rem] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.6)] p-10 md:p-14 relative overflow-hidden">
            
            <div className="mb-10 text-center lg:text-left">
                <div className="hidden lg:flex items-center justify-between mb-2">
                    <h2 className="text-xl font-semibold text-slate-900 tracking-tight uppercase">Identity Creation</h2>
                    <span className="text-[8px] font-semibold uppercase border border-slate-100 px-3 py-1 rounded-full text-slate-400 tracking-widest bg-slate-50 shadow-sm">Secured</span>
                </div>
                <p className="text-slate-500 font-semibold text-xs tracking-tight">Initiate your career protocol as a {role}.</p>
            </div>

            {/* ROLE SWITCH */}
            <div className="bg-slate-50 p-1.5 rounded-2xl flex gap-1 mb-8 border border-slate-100/50 shadow-inner">
              {["jobseeker", "recruiter", "admin"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-3 px-2 rounded-xl text-[9px] font-semibold uppercase tracking-widest transition-all duration-500 ${role === r
                      ? "bg-white text-indigo-600 shadow-md transform scale-[1.02]"
                      : "text-slate-400 hover:text-slate-600"
                    }`}
                >
                  {r === "jobseeker" ? "Job Seeker" : r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar p-1">
              
              <div className="space-y-5">
                <div className="group">
                  <label className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest pl-2 mb-2 block group-focus-within:text-indigo-600 transition-colors">Full Name</label>
                  <input
                    className="w-full bg-slate-50/50 border border-slate-100 px-6 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white transition-all text-slate-900 font-semibold text-sm placeholder:text-slate-300 disabled:opacity-50 shadow-sm"
                    placeholder="E.g. Alexander Pierce"
                    value={fullName}
                    disabled={otpVerified || loading}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="group">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pl-2 mb-2 block group-focus-within:text-indigo-600 transition-colors">Email Interface</label>
                  <div className="flex gap-2">
                    <input
                      className="flex-1 bg-slate-50/50 border border-slate-100 px-6 py-4.5 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white transition-all text-slate-900 font-semibold text-sm placeholder:text-slate-300 disabled:opacity-50 shadow-sm"
                      placeholder="protocol@nexal.io"
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
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 rounded-2xl text-[9px] font-semibold uppercase tracking-widest transition-all shadow-xl shadow-indigo-100 disabled:opacity-50 active:scale-95 whitespace-nowrap"
                    >
                      {otpSent ? "Resend" : "Send OTP"}
                    </button>
                  </div>
                </div>

                {otpSent && !otpVerified && (
                  <div className="bg-indigo-50/50 p-6 rounded-[2rem] border border-indigo-100 space-y-4 animate-fadeIn">
                    <label className="block text-[9px] font-semibold text-indigo-700 uppercase tracking-widest text-center">Protocol Code</label>
                    <div className="flex gap-3">
                      <input
                        className="flex-1 bg-white border border-indigo-200 px-4 py-4 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 text-center tracking-[0.8em] font-semibold text-lg text-indigo-900 shadow-inner"
                        placeholder="••••••"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={loading}
                        className="bg-slate-900 hover:bg-black text-white px-8 rounded-xl text-[9px] font-semibold uppercase tracking-widest shadow-xl shadow-slate-200 transition-all hover:-translate-y-0.5"
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {otpVerified && (
                <div className="space-y-5 pt-5 border-t border-slate-50 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="group">
                      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pl-2 mb-2 block group-focus-within:text-indigo-600">Access Key</label>
                      <div className="relative">
                        <input
                          className="w-full bg-slate-50/50 border border-slate-100 px-6 py-4.5 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white transition-all text-slate-900 font-semibold text-sm placeholder:text-slate-300 shadow-sm"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-500 transition-colors"
                        >
                          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                      </div>
                    </div>
                    <div className="group">
                      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pl-2 mb-2 block group-focus-within:text-indigo-600">Global Contact</label>
                      <input
                        className="w-full bg-slate-50/50 border border-slate-100 px-6 py-4.5 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white transition-all text-slate-900 font-semibold text-sm placeholder:text-slate-300 shadow-sm"
                        placeholder="+XX..."
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {role === "jobseeker" ? (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pl-2 mb-2 block">Gender</label>
                          <select
                            className="w-full bg-slate-50/50 border border-slate-100 px-6 py-4.5 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 text-slate-900 font-semibold text-xs appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%23cbd5e1%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px] bg-[right_1.25rem_center] bg-no-repeat shadow-sm"
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
                        <div>
                          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pl-2 mb-2 block">Seniority</label>
                          <select
                            className="w-full bg-slate-50/50 border border-slate-100 px-6 py-4.5 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 text-slate-900 font-semibold text-xs appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%23cbd5e1%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px] bg-[right_1.25rem_center] bg-no-repeat shadow-sm"
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
                      <div>
                        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pl-2 mb-2 block">Qualification Base</label>
                        <input
                          className="w-full bg-slate-50/50 border border-slate-100 px-6 py-4.5 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white transition-all text-slate-900 font-semibold text-xs placeholder:text-slate-300 shadow-sm"
                          placeholder="E.g. MBA, Stanford University"
                          value={qualification}
                          onChange={(e) => setQualification(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pl-2 mb-2 block">Primary Hub</label>
                        <input
                          className="w-full bg-slate-50/50 border border-slate-100 px-6 py-4.5 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white transition-all text-slate-900 font-semibold text-xs placeholder:text-slate-300 shadow-sm"
                          placeholder="London, UK / remote"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  ) : role === "recruiter" ? (
                    <div className="space-y-5">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pl-2 mb-2 block">Title</label>
                        <input
                          className="w-full bg-slate-50/50 border border-slate-100 px-6 py-4.5 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-900 font-semibold text-xs placeholder:text-slate-300 shadow-sm"
                          placeholder="Head of Talent Acquisition"
                          value={designation}
                          onChange={(e) => setDesignation(e.target.value)}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pl-2 mb-2 block">Firm Name</label>
                          <input
                            className="w-full bg-slate-50/50 border border-slate-100 px-6 py-4.5 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-900 font-semibold text-sm placeholder:text-slate-300 shadow-sm"
                            placeholder="Nexal Corp"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pl-2 mb-2 block">Work Mode</label>
                          <input
                            className="w-full bg-slate-50/50 border border-slate-100 px-6 py-4.5 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-900 font-semibold text-sm placeholder:text-slate-300 shadow-sm"
                            placeholder="HQ Location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <button
                    disabled={loading}
                    className="w-full bg-slate-900 hover:bg-black text-white py-6 rounded-[2rem] font-semibold text-sm uppercase tracking-widest shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] transition-all active:scale-95 disabled:opacity-50 mt-8 flex items-center justify-center gap-4 hover:-translate-y-1"
                  >
                    {loading ? "Establishing Protocol..." : "Activate Nexus Identity"}
                  </button>
                </div>
              )}
            </form>

            <div className="mt-8 pt-8 border-t border-slate-50 text-center">
              <p className="text-slate-400 font-semibold text-[11px] uppercase tracking-widest">
                Member of Nexal?{" "}
                <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold ml-2 transition-colors">
                  Authorize Key
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

    <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        
        .mesh-gradient {
          background-color: #020617;
          background-image: 
            radial-gradient(at 0% 0%, hsla(243,98%,51%,0.15) 0, transparent 50%), 
            radial-gradient(at 50% 0%, hsla(225,100%,48%,0.15) 0, transparent 50%), 
            radial-gradient(at 100% 0%, hsla(199,100%,48%,0.15) 0, transparent 50%), 
            radial-gradient(at 0% 100%, hsla(243,98%,51%,0.15) 0, transparent 50%), 
            radial-gradient(at 50% 100%, hsla(225,100%,48%,0.15) 0, transparent 50%), 
            radial-gradient(at 100% 100%, hsla(199,100%,48%,0.15) 0, transparent 50%);
          filter: blur(80px);
          animation: mesh 20s ease infinite;
        }

        @keyframes mesh {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeInUp { animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fadeInRight { animation: fadeInRight 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
    `}} />
    </div>
  );
}

export default Signup;
