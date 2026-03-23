import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/apiCheck";
import toast from "react-hot-toast";

const PublicSeekerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get(`/jobseeker/profile/${id}`);
        setProfile(data);
      } catch (err) {
        toast.error("Failed to load candidate profile");
        navigate("/recruiter/applicants");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id, navigate]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-[#fafbfc] pb-24 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* PROFESSIONAL HEADER / BANNER */}
      <div className="bg-white border-b border-slate-100 pt-16 pb-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            
            {/* LARGE CIRCULAR PROFILE PIC */}
            <div className="relative">
              <div className="w-48 h-48 bg-white rounded-full p-2 shadow-2xl border border-slate-100/50">
                <div className="w-full h-full rounded-full overflow-hidden bg-slate-50">
                  {profile.profile?.profilePhotoId ? (
                    <img
                      src={`http://localhost:5000/api/files/${profile.profile.profilePhotoId}`}
                      className="w-full h-full object-cover"
                      alt={profile.fullName}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-8xl opacity-10 font-black">
                      {profile.fullName.charAt(0)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* IDENTITY INFO */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-2">
                  Candidate Profile
                </div>
                <h1 className="text-5xl font-black text-slate-800 tracking-tight leading-none mb-2">
                  {profile.fullName}
                </h1>
                <p className="text-xl font-bold text-slate-500 max-w-2xl leading-relaxed">
                  {profile.profile?.headline || "Aspiring Professional"}
                </p>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-8 pt-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest mb-1">Email Address</span>
                  <a href={`mailto:${profile.email}`} className="text-sm font-bold text-indigo-600 hover:underline">{profile.email}</a>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest mb-1">Contact</span>
                  <span className="text-sm font-bold text-slate-600">{profile.mobile}</span>
                </div>
                {profile.profile?.socialLinks?.linkedin && (
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest mb-1">LinkedIn</span>
                    <a href={profile.profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-sm font-bold text-indigo-600 hover:underline">View Profile</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="max-w-5xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT COLUMN: DETAILS */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* SKILLS */}
          <section className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/30 rounded-full -mr-16 -mt-16 blur-3xl"></div>
             <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
               <span className="w-8 h-[1px] bg-slate-100"></span> Core Competencies
             </h3>
             <div className="flex flex-wrap gap-3">
               {profile.profile?.skills?.map((skill, idx) => (
                 <span key={idx} className="px-6 py-2.5 bg-slate-50 text-slate-600 text-xs font-black uppercase tracking-widest rounded-full border border-slate-100 hover:border-indigo-200 hover:bg-white transition-all">
                   {skill}
                 </span>
               )) || <p className="text-slate-400 font-bold italic">No skills listed</p>}
             </div>
          </section>

          {/* EDUCATION & EXPERIENCE SUMMARY */}
          <section className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm">
               <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-8">Education</h3>
               <div className="space-y-4">
                 <p className="text-sm font-black text-slate-800 leading-tight uppercase">
                    {profile.profile?.education?.highestQualification || "Not specified"}
                 </p>
                 <p className="text-xs font-bold text-slate-400">
                    {profile.profile?.education?.collegeName || "Institution details not available"}
                 </p>
                 {profile.profile?.education?.graduationYear && (
                   <span className="inline-block px-3 py-1 bg-slate-50 text-slate-400 text-[9px] font-black rounded-full uppercase">Class of {profile.profile.education.graduationYear}</span>
                 )}
               </div>
            </div>

            <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm">
               <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-8">Experience</h3>
               <div className="space-y-4">
                 <p className="text-sm font-black text-slate-800 leading-tight">
                    {profile.profile?.experience || 0} Years in Industry
                 </p>
                 <p className="text-xs font-bold text-slate-400">
                    {profile.profile?.currentCompany ? `Currently at ${profile.profile.currentCompany}` : "Available for immediate hire"}
                 </p>
                 {profile.profile?.designation && (
                   <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-[9px] font-black rounded-full uppercase">{profile.profile.designation}</span>
                 )}
               </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: ACTIONS */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* RESUME CARD */}
          <div className="bg-slate-900 rounded-[40px] p-8 text-center relative overflow-hidden shadow-2xl shadow-indigo-200">
             <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-transparent"></div>
             <div className="relative z-10 space-y-6">
                <div className="w-16 h-16 bg-white/10 rounded-2xl mx-auto flex items-center justify-center text-3xl">📄</div>
                <div>
                  <h4 className="text-white font-black text-lg tracking-tight uppercase mb-1">Resume / CV</h4>
                  <p className="text-indigo-200/50 text-[10px] font-bold uppercase tracking-widest">Formal Documentation</p>
                </div>
                
                {profile.profile?.resumeId ? (
                  <a 
                    href={`http://localhost:5000/api/files/${profile.profile.resumeId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full py-4 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-3xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-900/50 active:scale-95"
                  >
                    Download Resume
                  </a>
                ) : (
                  <div className="w-full py-4 bg-white/5 text-white/20 text-[10px] font-black uppercase tracking-widest rounded-3xl cursor-not-allowed border border-white/5">
                    No Resume Uploaded
                  </div>
                )}
             </div>
          </div>

          {/* BACK ACTION */}
          <button 
            onClick={() => navigate(-1)}
            className="w-full py-4 bg-white border border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-3xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Applicants
          </button>
        </div>

      </div>
    </div>
  );
};

export default PublicSeekerProfile;
