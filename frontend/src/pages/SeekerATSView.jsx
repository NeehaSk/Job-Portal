import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Building2, Briefcase, MapPin, IndianRupee } from "lucide-react";
import api from "../api/apiCheck";
import toast from "react-hot-toast";

const STAGE_CONFIG = [
    { name: "Applied", desc: "Your application was received and logged successfully." },
    { name: "Under Review", desc: "The hiring team is evaluating your profile and credentials." },
    { name: "Interview", desc: "Direct engagement with the team — a great sign!" },
    { name: "Decision", desc: "Final outcome has been determined by the hiring team." },
];

const SeekerATSView = () => {
    const { applicationId } = useParams();
    const [loading, setLoading] = useState(true);
    const [application, setApplication] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await api.get("/jobs/my-applications");
                const apps = res.data.applications || res.data;
                const found = Array.isArray(apps) ? apps.find(a => a._id === applicationId) : null;
                if (found) setApplication(found);
                else toast.error("Application not found");
            } catch (error) {
                toast.error("Failed to load tracking data");
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [applicationId]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!application) return (
        <div className="min-h-screen flex items-center justify-center bg-white p-6">
            <div className="text-center max-w-sm">
                <p className="text-slate-500 text-sm mb-6 font-medium">We couldn't find this application in our records.</p>
                <Link to="/my-applications" className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-black transition-all">← Back to Dashboard</Link>
            </div>
        </div>
    );

    const getStageStatus = (idx) => {
        const current = application.status;
        if (idx === 0) return "Completed";
        if (idx === 1) return (current === "Pending") ? "In Progress" : "Completed";
        if (idx === 2) {
            if (["Pending", "Shortlisted"].includes(current)) return "Upcoming";
            if (current === "Interview") return "In Progress";
            return "Completed";
        }
        if (idx === 3) {
            if (["Pending", "Shortlisted", "Interview"].includes(current)) return "Upcoming";
            return "Completed";
        }
        return "Upcoming";
    };

    const getStatusTheme = (status) => {
        switch (status) {
            case "Pending": return "text-amber-600 bg-amber-50 border-amber-100";
            case "Interview": return "text-indigo-600 bg-indigo-50 border-indigo-100";
            case "Selected": return "text-emerald-600 bg-emerald-50 border-emerald-100";
            case "Rejected": return "text-slate-600 bg-slate-50 border-slate-100";
            default: return "text-slate-600 bg-slate-50 border-slate-100";
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* SUB-NAVBAR / HEADER */}
            <div className="border-b border-slate-100 pt-28 pb-8 px-8">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Application Insight</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span className="text-[10px] font-bold text-slate-400">ID: {applicationId.slice(-8).toUpperCase()}</span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">{application.job?.title}</h1>
                        <p className="text-slate-500 font-medium">{application.job?.companyName}</p>
                    </div>
                    <Link to="/my-applications" className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest flex items-center gap-2">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Exit Tracker
                    </Link>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    
                    {/* LEFT: TIMELINE */}
                    <div className="lg:col-span-8">
                        <div className="flex items-center justify-between mb-10 pb-4 border-b border-slate-50">
                            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Hiring Progress</h2>
                            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusTheme(application.status)}`}>
                                {application.status}
                            </div>
                        </div>

                        <div className="relative space-y-0">
                            {/* Vertical Line Connector */}
                            <div className="absolute left-[11px] top-2 bottom-6 w-[2px] bg-slate-100"></div>

                            {STAGE_CONFIG.map((stage, idx) => {
                                const status = getStageStatus(idx);
                                const isActive = status === "In Progress";
                                const isCompleted = status === "Completed";
                                const isUpcoming = status === "Upcoming";

                                return (
                                    <div key={idx} className={`relative pl-12 pb-10 group last:pb-0`}>
                                        {/* State Indicator Circle */}
                                        <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 transition-all duration-500 z-10 ${
                                            isCompleted ? "bg-indigo-600 border-indigo-100" :
                                            isActive ? "bg-white border-indigo-600 scale-110" :
                                            "bg-white border-slate-100"
                                        }`}>
                                            {isCompleted && (
                                                <svg className="w-3 h-3 text-white m-auto mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>

                                        <div className={`transition-opacity duration-500 ${isUpcoming ? "opacity-40" : "opacity-100"}`}>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className={`text-sm font-bold tracking-tight ${isActive ? "text-indigo-600" : "text-slate-800"}`}>
                                                    {stage.name}
                                                </h3>
                                                {isActive && (
                                                    <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-600 animate-ping"></span>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-500 leading-relaxed max-w-xl">
                                                {stage.desc}
                                            </p>
                                            
                                            {idx === 0 && application.createdAt && (
                                                <span className="inline-block mt-3 text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                                    Applied on {new Date(application.createdAt).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* RIGHT: JOB CONTEXT */}
                    <div className="lg:col-span-4">
                        <div className="bg-slate-50 rounded-3xl p-8 sticky top-32 border border-slate-100">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Role Particulars</h3>
                            
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm text-lg text-indigo-600">
                                        <Building2 size={20} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight block">Organization</label>
                                        <p className="text-sm font-bold text-slate-800">{application.job?.companyName}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm text-lg text-indigo-600">
                                        <Briefcase size={20} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight block">Position Type</label>
                                        <p className="text-sm font-bold text-slate-800">{application.job?.jobType}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm text-lg text-indigo-600">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight block">Workstation</label>
                                        <p className="text-sm font-bold text-slate-800">{application.job?.location}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm text-lg text-indigo-600">
                                        <IndianRupee size={20} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight block">Comp. Structure</label>
                                        <p className="text-sm font-bold text-slate-800">
                                            {application.job?.salary && typeof application.job.salary === 'object'
                                                ? `${(application.job.salary.min / 1000).toFixed(0)}K – ${(application.job.salary.max / 1000).toFixed(0)}K`
                                                : (application.job?.salary || "Market Rate")}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Link
                                to={`/job/${application.job?._id}`}
                                className="mt-10 w-full inline-flex items-center justify-center gap-2 py-3 bg-white text-slate-900 text-xs font-bold uppercase tracking-widest rounded-2xl border border-slate-200 hover:bg-slate-900 hover:text-white transition-all duration-300"
                            >
                                Review Listing
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </Link>
                        </div>
                    </div>

                </div>
            </main>

            {/* INTERVIEW MODAL OVERLAY (Optional integration if user wants it later) */}
            {application.status === "Interview" && application.interviewDetails && (
                <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom duration-700">
                    <div className="bg-slate-900 border border-white/10 shadow-2xl rounded-[32px] px-10 py-6 flex items-center gap-8 text-white">
                        <div className="flex items-center gap-4 border-r border-white/10 pr-8">
                            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center animate-pulse">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Next Scheduled Event</p>
                                <p className="text-sm font-bold">Interview Discussion</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <p className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">Date</p>
                                <p className="text-xs font-bold">{new Date(application.interviewDetails.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">Time</p>
                                <p className="text-xs font-bold">{application.interviewDetails.time}</p>
                            </div>
                            <a href={application.interviewDetails.link} target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 bg-white text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-50 transition-colors">
                                Join Now
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeekerATSView;
