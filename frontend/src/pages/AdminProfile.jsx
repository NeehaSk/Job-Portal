import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/apiCheck";
import toast from "react-hot-toast";
import { 
  UserIcon, 
  MailIcon, 
  PhoneIcon, 
  ShieldCheckIcon, 
  BriefcaseIcon, 
  CameraIcon,
  SaveIcon
} from "lucide-react";

const AdminProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    designation: "",
    bio: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        mobile: user.mobile || "",
        designation: user.designation || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const res = await api.put("/admin/profile/upload-photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser({ ...user, profilePhotoId: res.data.profilePhotoId });
      toast.success("Profile photo updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put("/admin/profile/update", formData);
      setUser(res.data.user);
      toast.success("Identity updated");
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-6 lg:padding-x-12 pt-28 text-slate-800 font-inter">
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
        
        {/* NAUKRI-STYLE HEADER CARD */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8">
          <div className="relative group cursor-pointer shrink-0" onClick={() => document.getElementById('photoInput').click()}>
            <div className="w-28 h-28 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden relative shadow-sm">
              {user.profilePhotoId ? (
                <img 
                  src={`http://localhost:5000/api/files/${user.profilePhotoId}`} 
                  alt="Admin" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                   <UserIcon size={48} strokeWidth={1} />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <CameraIcon size={20} />
              </div>
            </div>
            <input id="photoInput" type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
               <h1 className="text-2xl font-bold text-slate-900 font-outfit truncate leading-none">{user.fullName}</h1>
               <div className="mt-2 flex items-center justify-center md:justify-start gap-2">
                  <span className="text-sm font-semibold text-slate-600">{user.designation || "Platform Superintendent"}</span>
                  <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 italic">SYSTEM ROOT</span>
               </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-2">
               <div className="flex items-center gap-2 text-slate-600">
                  <MailIcon size={14} className="text-slate-500" />
                  <span className="text-xs font-semibold">{user.email}</span>
               </div>
               <div className="flex items-center gap-2 text-slate-600">
                  <PhoneIcon size={14} className="text-slate-500" />
                  <span className="text-xs font-semibold">{user.mobile || "1234567890"}</span>
               </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col gap-3">
             <button 
                onClick={() => setIsEditing(true)}
                className="px-8 py-3 bg-[#274472] text-white text-[11px] font-bold uppercase tracking-widest rounded-lg hover:bg-[#1a3050] transition-all shadow-md active:scale-95"
             >
                Edit Profile
             </button>
             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Version 3.2.0</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* STATS / METADATA COLUMN */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm space-y-8">
               <h3 className="text-sm font-extrabold text-slate-900 flex items-center justify-between uppercase tracking-tight">
                  Identity Signature
                  <ShieldCheckIcon size={16} className="text-emerald-600" />
               </h3>
               
               <div className="space-y-7">
                  <div className="space-y-1.5">
                     <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">System Unique ID</div>
                     <div className="text-xs font-bold text-slate-800 font-mono break-all bg-slate-50 p-2 rounded border border-slate-100">
                        {user.id?.toUpperCase() || "69C260493B310B52F57DB144"}
                     </div>
                  </div>
                  <div className="space-y-1.5">
                     <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Joined Network</div>
                     <div className="text-sm font-bold text-slate-800">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : "Infinity"}
                     </div>
                  </div>
                  <div className="space-y-1.5">
                     <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Authorizations</div>
                     <div className="flex gap-2 pt-1">
                        <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 border border-slate-200 rounded text-slate-700">ADMIN</span>
                        <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 border border-slate-200 rounded text-slate-700">ROOT</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-indigo-700 rounded-2xl p-7 text-white shadow-xl shadow-indigo-200 group overflow-hidden relative">
               <div className="relative z-10 space-y-3">
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-90">Security Status</div>
                  <div className="text-xl font-bold">System Secure</div>
                  <p className="text-[10px] font-medium opacity-80 leading-relaxed max-w-[90%]">All administrative nodes are currently synchronized and encrypted.</p>
               </div>
               <div className="absolute top-0 right-0 p-5 opacity-20 group-hover:scale-110 transition-transform">
                  <SaveIcon size={72} strokeWidth={1} />
               </div>
            </div>
          </div>

          {/* CONTENT COLUMN */}
          <div className="lg:col-span-2">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-8 animate-fade-in-up">
                 <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                    <h3 className="text-lg font-bold text-slate-900">Modify Identity Details</h3>
                    <div className="text-[10px] font-bold text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded">Interactive Session</div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2.5">
                       <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Full Legal Name</label>
                       <input 
                         name="fullName"
                         value={formData.fullName}
                         onChange={handleChange}
                         className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all"
                       />
                    </div>
                    <div className="space-y-2.5">
                       <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Public Designation</label>
                       <input 
                         name="designation"
                         value={formData.designation}
                         onChange={handleChange}
                         className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all"
                       />
                    </div>
                 </div>

                 <div className="space-y-2.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Administrative Narrative (Bio)</label>
                    <textarea 
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={5}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none resize-none transition-all"
                    />
                 </div>

                 <div className="flex items-center gap-5 pt-4">
                    <button 
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-indigo-600 text-white rounded-xl py-4 text-xs font-extrabold uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all disabled:opacity-50"
                    >
                      {loading ? "Synchronizing..." : "Apply Changes"}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 border-2 border-slate-200 text-slate-600 rounded-xl py-4 text-xs font-extrabold uppercase tracking-widest hover:bg-slate-50 transition-all"
                    >
                      Discard
                    </button>
                 </div>
              </form>
            ) : (
              <div className="space-y-8 animate-fade-in-up">
                 <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-10">
                    <section>
                       <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-6">Strategic Statement</h3>
                       <div className="text-sm font-bold text-slate-700 leading-relaxed bg-slate-50 p-7 rounded-2xl border border-slate-100 italic relative overflow-hidden">
                         <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500 rounded-full"></div>
                         "{user.bio || "No professional narrative established. Define your administrative impact here."}"
                       </div>
                    </section>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
                       <div className="space-y-4">
                          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Global Reach</h3>
                          <div className="flex gap-5 items-center">
                             <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm"><BriefcaseIcon size={20} /></div>
                             <div>
                                <div className="text-sm font-bold text-slate-800">Platform-wide</div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase">Governance Scope</div>
                             </div>
                          </div>
                       </div>
                       <div className="space-y-4">
                          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Privacy Controls</h3>
                          <div className="flex gap-5 items-center">
                             <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm"><ShieldCheckIcon size={20} /></div>
                             <div>
                                <div className="text-sm font-bold text-slate-800">Audit Enabled</div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase">Privacy Standard</div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="flex items-center justify-between px-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <div className="flex items-center gap-2.5">
                       <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                       Finalized Administrative Build 4.1
                    </div>
                    <div className="flex gap-8">
                       <span className="hover:text-indigo-600 cursor-pointer transition-colors border-b border-transparent hover:border-indigo-600">Privacy Schema</span>
                       <span className="hover:text-indigo-600 cursor-pointer transition-colors border-b border-transparent hover:border-indigo-600">System Logs</span>
                    </div>
                 </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );


};

export default AdminProfile;
