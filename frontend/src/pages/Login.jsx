import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/apiCheck";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

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

function Login() {
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const [role, setRole] = useState("jobseeker");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("All fields are required");
      return;
    }
    try {
      setLoading(true);
      const res = await api.post("/auth/login", { email, password, role });
      if (!res.data || !res.data.token) {
        toast.error("Invalid server response");
        return;
      }
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user.id);
      localStorage.setItem("userRole", role);
      toast.success("Login successful 🎉");
      loginUser({ token: res.data.token, user: res.data.user });
      if (role === "jobseeker") navigate("/jobseeker/profile");
      else if (role === "admin") navigate("/admin/dashboard");
      else navigate("/recruiter/dashboard");
    } catch (error) {
      const errorMsg = error.response?.data?.message;
      if (errorMsg === "User not found") {
        toast.error("User not found. Are you logging in with the correct role?");
      } else {
        toast.error(errorMsg || "Login failed");
      }
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
        
        {/* LEFT SIDE: BRANDING */}
        <div className="hidden lg:flex flex-col text-white space-y-12 animate-fadeInUp">
          <div className="space-y-8">
            <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-2xl shadow-indigo-500/40 border border-white/10 transition-transform group-hover:rotate-6">
                    <span className="text-2xl font-bold tracking-tighter">N</span>
                </div>
                <div className="flex flex-col leading-none">
                    <span className="text-2xl font-bold tracking-tighter uppercase">NEXAL <span className="text-indigo-400">ELITE</span></span>
                    <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-500">Talent Ecosystem</span>
                </div>
            </div>
            
            <h1 className="text-4xl xl:text-5xl font-bold leading-[1.2] tracking-tight mb-6">
                Connecting Talent with <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-200">Opportunity.</span>
            </h1>
            
            <p className="text-slate-400 text-sm font-medium max-w-md leading-relaxed opacity-60">
                Sign in to your account to continue your professional journey. The future of high-impact roles awaits.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-6">
             <div className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-6">
                <span>&copy; 2026 Nexal Elite Inc.</span>
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
             </div>
          </div>
        </div>

        {/* RIGHT SIDE: MINIMALIST FORM CARD */}
        <div className="flex justify-center lg:justify-end animate-fadeInRight">
          <div className="w-full max-w-sm bg-white rounded-[3rem] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.6)] p-10 md:p-14 relative overflow-hidden">
            
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-xl font-semibold text-slate-900 mb-2 tracking-tight uppercase">Identity Auth</h2>
              <p className="text-slate-500 font-medium text-xs tracking-tight">
                Sign in as a {role === "jobseeker" ? "Job Seeker" : role.charAt(0).toUpperCase() + role.slice(1)}.
              </p>
            </div>

            {/* ROLE SWITCH */}
            <div className="bg-slate-50 p-1.5 rounded-2xl flex gap-1 mb-8 border border-slate-100/50 shadow-inner">
              {["jobseeker", "recruiter", "admin"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-3 px-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all duration-500 ${role === r
                      ? "bg-white text-indigo-600 shadow-md transform scale-[1.02]"
                      : "text-slate-400 hover:text-slate-600"
                    }`}
                >
                  {r === "jobseeker" ? "Job Seeker" : r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="group">
                <label className="text-[8px] font-semibold text-slate-400 uppercase tracking-widest pl-2 mb-2 block group-focus-within:text-indigo-600 transition-colors">Email Interface</label>
                <input
                  className="w-full bg-slate-50/50 border border-slate-100 px-6 py-4.5 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white transition-all text-slate-900 font-medium text-sm placeholder:text-slate-300 shadow-sm"
                  type="email"
                  placeholder="name@nexal.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="group">
                <div className="flex items-center justify-between mb-2 pl-2">
                    <label className="text-[8px] font-semibold text-slate-400 uppercase tracking-widest group-focus-within:text-indigo-600 transition-colors">Access Key</label>
                    <Link to="/forgot-password" size="tiny" className="text-[8px] font-semibold text-indigo-500/60 hover:text-indigo-600 uppercase tracking-widest">Restore</Link>
                </div>
                <div className="relative">
                  <input
                    className="w-full bg-slate-50/50 border border-slate-100 px-6 py-4.5 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white transition-all text-slate-900 font-medium text-sm placeholder:text-slate-300 shadow-sm"
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

              <button
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-black text-white py-5 rounded-[2rem] font-bold text-xs uppercase tracking-widest shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] transition-all active:scale-[0.98] disabled:opacity-50 mt-4 flex items-center justify-center gap-3 group hover:-translate-y-1"
              >
                {loading ? "Verifying..." : "Authorize Identity"}
                {!loading && (
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-slate-400 font-bold text-[10px] uppercase tracking-widest">
              New to Nexal?{" "}
              <Link to="/signup" className="text-indigo-600 font-bold hover:text-indigo-700 ml-1">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>

    <style dangerouslySetInnerHTML={{ __html: `
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
        .animate-fadeInUp { animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fadeInRight { animation: fadeInRight 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    `}} />
    </div>
  );
}

export default Login;