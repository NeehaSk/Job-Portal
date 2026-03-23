import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/apiCheck";
import toast from "react-hot-toast";

const SeekerATSView = () => {
    const { applicationId } = useParams();
    const [loading, setLoading] = useState(true);
    const [application, setApplication] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                // We use the generic job applicants endpoint or a personal one if we had it
                // Actually, let's create a dedicated one or find another way.
                // For now, getMyApplications returns all, so we can filter or use a specific detail endpoint.
                const res = await api.get("/jobs/my-applications");
                const found = res.data.applications.find(a => a._id === applicationId);
                if (found) {
                    setApplication(found);
                } else {
                    toast.error("Application not found");
                }
            } catch (error) {
                toast.error("Failed to load tracking data");
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [applicationId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-black uppercase tracking-widest text-[10px] text-slate-400">Syncing Pipeline...</p>
                </div>
            </div>
        );
    }

    if (!application) return null;

    const stages = [
        { name: "Applied", status: "Completed", icon: "📝", date: application.createdAt },
        { name: "Shortlisted", status: application.status === "Pending" ? "Pending" : "Completed", icon: "🎯" },
        { name: "Interview", status: ["Pending", "Shortlisted"].includes(application.status) ? "Upcoming" : application.status === "Interview" ? "In Progress" : "Completed", icon: "📅" },
        { name: "Decision", status: ["Pending", "Shortlisted", "Interview"].includes(application.status) ? "Upcoming" : "Completed", icon: "🏆" }
    ];

    return (
        <div className="min-h-screen bg-[#fcfdfe] pb-32 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* HERO SECTION */}
            <div className="h-80 bg-slate-900 relative overflow-hidden flex flex-col justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-transparent to-transparent"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
                
                <div className="max-w-5xl mx-auto w-full px-6 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                                Application Tracker
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none mb-3">
                                {application.job?.title}
                            </h1>
                            <p className="text-indigo-300 font-bold uppercase tracking-widest text-xs flex items-center gap-3">
                                <span>{application.job?.companyName}</span>
                                <span className="w-1.5 h-1.5 bg-slate-700 rounded-full"></span>
                                <span>{application.job?.location}</span>
                            </p>
                        </div>
                        <div className="flex gap-4">
                             <Link to="/my-applications" className="px-8 py-4 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-3xl hover:bg-white/10 transition-all backdrop-blur-md">Back to List</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN TRACKER CONTENT */}
            <div className="max-w-5xl mx-auto px-6 -mt-12 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT: TIMELINE */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 p-12">
                            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-12">Hiring Progress</h2>
                            
                            <div className="relative space-y-12">
                                {/* VERTICAL LINE */}
                                <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-slate-50"></div>
                                
                                {stages.map((stage, idx) => (
                                    <div key={idx} className="relative flex items-start gap-10 group">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl relative z-10 transition-all duration-500 shadow-sm border ${
                                            stage.status === "Completed" ? "bg-indigo-600 border-indigo-600 scale-110 shadow-indigo-100" : 
                                            stage.status === "In Progress" ? "bg-white border-indigo-600 animate-pulse" : 
                                            "bg-white border-slate-100 grayscale opacity-40"
                                        }`}>
                                            <span className={stage.status === "Completed" ? "filter brightness-0 invert" : ""}>{stage.icon}</span>
                                        </div>
                                        
                                        <div className="flex-1 pt-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className={`text-lg font-black uppercase tracking-tight ${stage.status === "Completed" ? "text-slate-800" : "text-slate-400"}`}>
                                                    {stage.name}
                                                </h3>
                                                {stage.status === "Completed" && (
                                                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-lg">Done</span>
                                                )}
                                            </div>
                                            <p className="text-sm font-bold text-slate-400">
                                                {stage.status === "Completed" ? "Your application successfully passed this phase." : 
                                                 stage.status === "In Progress" ? "You are currently at this stage. Check details below." : 
                                                 "Awaiting previous stage completion."}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* INTERVIEW DETAILS CARD (CONDITIONAL) */}
                        {application.status === "Interview" && application.interviewDetails && (
                            <div className="bg-indigo-600 rounded-[48px] shadow-2xl shadow-indigo-200 p-12 text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-1000"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-md">📅</div>
                                        <div>
                                            <h3 className="text-2xl font-black uppercase tracking-tight">Interview Scheduled</h3>
                                            <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest opacity-80">Get ready to shine!</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
                                            <span className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em] block mb-2">When</span>
                                            <p className="text-xl font-black">
                                                {new Date(application.interviewDetails.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                            <p className="text-indigo-200 font-bold mt-1 uppercase tracking-tighter text-sm">at {application.interviewDetails.time}</p>
                                        </div>
                                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
                                            <span className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em] block mb-2">Platform / Link</span>
                                            <a 
                                                href={application.interviewDetails.link} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-xl font-black underline decoration-indigo-300 underline-offset-4 hover:text-indigo-200 transition-colors block truncate"
                                            >
                                                Open Meeting Link
                                            </a>
                                            <p className="text-indigo-200 font-bold mt-1 uppercase tracking-tighter text-sm truncate">{application.interviewDetails.link}</p>
                                        </div>
                                    </div>

                                    {application.interviewDetails.instructions && (
                                        <div className="bg-black/10 rounded-3xl p-6 border border-white/5">
                                            <span className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em] block mb-2">Instructions from Recruiter</span>
                                            <p className="text-sm font-bold leading-relaxed italic text-indigo-50">
                                                "{application.interviewDetails.instructions}"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* REJECTION CARD */}
                        {application.status === "Rejected" && (
                            <div className="bg-rose-50 rounded-[48px] border border-rose-100 p-12">
                                <div className="flex items-center gap-6 mb-4">
                                    <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white text-xl">💔</div>
                                    <h3 className="text-2xl font-black text-rose-900 uppercase tracking-tight">Application Status</h3>
                                </div>
                                <p className="text-rose-700 font-bold leading-relaxed">
                                    {application.nextStep || "We appreciate your interest in this role. Unfortunately, the team has decided not to proceed with your application at this time. Keep going - the perfect role is waiting for you!"}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: JOB SNAPSHOT */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 p-10">
                            <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em] mb-8">Role Snapshot</h3>
                            
                            <div className="space-y-6">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest mb-1">Company</span>
                                    <p className="text-lg font-black text-slate-700">{application.job?.companyName}</p>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest mb-1">Type</span>
                                    <p className="text-lg font-black text-slate-700">{application.job?.jobType}</p>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest mb-1">Expectation</span>
                                    <p className="text-lg font-black text-slate-700">
                                        {application.job?.salary && typeof application.job.salary === 'object'
                                            ? `${application.job.salary.min?.toLocaleString() || ''} - ${application.job.salary.max?.toLocaleString() || ''} ${application.job.salary.currency || 'INR'}`
                                            : (application.job?.salary || "Not Disclosed")} / yr
                                    </p>
                                </div>
                            </div>

                            <hr className="my-8 border-slate-50" />

                            <Link 
                                to={`/job/${application.job?._id}`}
                                className="w-full py-4 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2 border border-slate-100"
                            >
                                View Full Job Description
                            </Link>
                        </div>

                        <div className="bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 p-10 text-center">
                            <p className="text-[9px] font-black text-slate-200 uppercase tracking-widest mb-6">Need Help?</p>
                            <p className="text-xs font-bold text-slate-400 mb-6">Want to ask the recruiter something about this application?</p>
                            <button 
                                onClick={() => {/* Conversation logic if needed */}}
                                className="w-full py-4 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all"
                            >
                                Open Message Thread
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SeekerATSView;
