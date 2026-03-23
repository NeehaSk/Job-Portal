import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/apiCheck";
import toast from "react-hot-toast";
import ApplicationThreadModal from "../components/ApplicationThreadModal";

const RecruiterApplicants = () => {
    const [loading, setLoading] = useState(true);
    const [applicants, setApplicants] = useState([]);
    
    // Modal States
    const [selectedApp, setSelectedApp] = useState(null);
    const [isThreadOpen, setIsThreadOpen] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [pendingStatus, setPendingStatus] = useState(null);
    const [pendingAppId, setPendingAppId] = useState(null);
    const [statusMessage, setStatusMessage] = useState("");
    
    // Interview Scheduling States
    const [interviewData, setInterviewData] = useState({
        date: "",
        time: "",
        link: "",
        instructions: ""
    });

    const fetchApplicants = async () => {
        setLoading(true);
        try {
            const res = await api.get("/jobs/recruiter-applicants");
            setApplicants(res.data.applications || []);
        } catch (error) {
            toast.error("Failed to load applicants");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplicants();
    }, []);

    const handleStatusUpdate = (applicationId, status) => {
        setPendingAppId(applicationId);
        setPendingStatus(status);
        setShowStatusModal(true);
    };

    const confirmStatusUpdate = async () => {
        try {
            const payload = { 
                status: pendingStatus,
                message: statusMessage 
            };

            if (pendingStatus === "Interview") {
                if (!interviewData.date || !interviewData.time || !interviewData.link) {
                    return toast.error("Please fill in interview date, time and link");
                }
                payload.interviewDetails = interviewData;
            }

            await api.put(`/jobs/application/${pendingAppId}/status`, payload);
            toast.success(`Candidate ${pendingStatus} successful`);
            
            // Success cleanup
            setShowStatusModal(false);
            setStatusMessage("");
            setInterviewData({ date: "", time: "", link: "", instructions: "" });
            
            // Refresh list
            fetchApplicants(); 
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-indigo-600 font-medium bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-bold uppercase tracking-widest text-xs">Syncing Applicants Console...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 pb-20">
            {/* HEADER */}
            <div className="h-56 bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 w-full flex flex-col justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white"></path>
                    </svg>
                </div>
                <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 relative z-10 text-center">
                    <h2 className="text-white text-4xl font-black uppercase tracking-widest leading-none mb-3">
                        Applicants Console
                    </h2>
                    <p className="text-indigo-200 text-sm font-bold uppercase tracking-widest">Review candidates from all your active listings</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto -mt-10 px-4 sm:px-6 relative z-20">
                {applicants.length === 0 ? (
                    <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 p-20 text-center">
                        <div className="text-6xl mb-6 grayscale opacity-20">👥</div>
                        <h3 className="text-xl font-extrabold text-slate-800 mb-2 tracking-tight uppercase">No applicants found</h3>
                        <p className="text-slate-400 font-bold text-sm">When candidates apply to your jobs, they will appear here.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        <div className="flex items-center justify-between mb-2 px-4">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Showing {applicants.length} applications</span>
                        </div>
                        {applicants.map((app) => (
                            <div
                                key={app._id}
                                className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 p-8 flex flex-col md:flex-row md:items-center gap-8 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0">
                                    <div className="bg-indigo-600 text-white text-[9px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-tighter shadow-sm">
                                        {app.job?.title}
                                    </div>
                                </div>

                                <div className="w-24 h-24 rounded-[32px] bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0 relative group-hover:scale-105 transition-transform duration-500">
                                    {app.applicant?.profile?.profilePhotoId ? (
                                        <img
                                            src={`http://localhost:5000/api/files/${app.applicant.profile.profilePhotoId}`}
                                            className="w-full h-full object-cover"
                                            alt="Avatar"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl opacity-20 bg-indigo-50 text-indigo-600 font-black">
                                            {app.applicant?.fullName?.charAt(0) || "U"}
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                        <Link 
                                            to={`/recruiter/seeker/${app.applicant?._id}`}
                                            className="text-2xl font-black text-slate-800 tracking-tight uppercase hover:text-indigo-600 transition-colors"
                                        >
                                            {app.applicantDetails?.fullName || app.applicant?.fullName || "Applicant"}
                                        </Link>
                                        <span
                                            className={`px-4 py-1 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm border ${app.status === "Pending"
                                                ? "bg-amber-50 text-amber-600 border-amber-100"
                                                : app.status === "Interview"
                                                    ? "bg-purple-50 text-purple-600 border-purple-100"
                                                    : app.status === "Selected"
                                                        ? "bg-green-50 text-green-600 border-green-100"
                                                        : app.status === "Shortlisted"
                                                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                            : "bg-rose-50 text-rose-600 border-rose-100"
                                                }`}
                                        >
                                            {app.status}
                                        </span>
                                    </div>

                                    <p className="text-sm font-bold text-slate-400 mb-6 flex items-center gap-2">
                                        <span className="text-indigo-400">✉</span> {app.applicantDetails?.email || app.applicant?.email}
                                    </p>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest mb-1">Experience</span>
                                            <span className="text-sm font-bold text-slate-600">{app.applicantDetails?.experience || app.applicant?.profile?.experience || "N/A"}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest mb-1">Skills</span>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {(app.applicantDetails?.skills || app.applicant?.profile?.skills || []).slice(0, 3).map((skill, idx) => (
                                                    <span key={idx} className="bg-slate-50 text-[10px] px-2 py-0.5 rounded border border-slate-100 text-slate-500 font-bold">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex flex-col col-span-2">
                                            <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest mb-1">Applied For</span>
                                            <span className="text-sm font-black text-indigo-600 uppercase tracking-tight truncate">{app.job?.title}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap md:flex-nowrap gap-3 pt-6 md:pt-0">
                                    {app.status === "Pending" && (
                                        <button
                                            onClick={() => handleStatusUpdate(app._id, "Shortlisted")}
                                            className="px-8 py-3 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-100 active:scale-95"
                                        >
                                            Shortlist
                                        </button>
                                    )}

                                    {app.status === "Shortlisted" && (
                                        <button
                                            onClick={() => handleStatusUpdate(app._id, "Interview")}
                                            className="px-8 py-3 bg-purple-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-purple-600 transition-all shadow-xl shadow-purple-100 active:scale-95"
                                        >
                                            Interview
                                        </button>
                                    )}

                                    {app.status === "Interview" && (
                                        <button
                                            onClick={() => handleStatusUpdate(app._id, "Selected")}
                                            className="px-8 py-3 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-green-600 transition-all shadow-xl shadow-green-100 active:scale-95"
                                        >
                                            Select
                                        </button>
                                    )}

                                    {app.status !== "Rejected" && app.status !== "Selected" && (
                                        <button
                                            onClick={() => handleStatusUpdate(app._id, "Rejected")}
                                            className="px-8 py-3 bg-white text-rose-600 border border-rose-100 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-rose-50 transition-all active:scale-95"
                                        >
                                            Reject
                                        </button>
                                    )}

                                    <button
                                        onClick={() => { setSelectedApp(app); setIsThreadOpen(true); }}
                                        className="px-8 py-3 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-100 transition-all active:scale-95 flex items-center gap-2"
                                    >
                                        <span>Chat</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                        </svg>
                                    </button>

                                    {app.applicant?.resume && (
                                        <a
                                            href={`http://localhost:5000/api/files/${app.applicant.resume}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-8 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-black transition-all flex items-center gap-3 shadow-xl shadow-slate-200 active:scale-95"
                                        >
                                            <span>CV</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* INTEGRATED STATUS MODAL (SHORTLIST, INTERVIEW, REJECT, SELECT) */}
            {showStatusModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-xl">
                    <div className="bg-white w-full max-w-lg rounded-[48px] shadow-2xl p-12 animate-in fade-in zoom-in duration-300 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16"></div>
                        
                        <div className="relative z-10">
                            <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tight mb-2 leading-none">
                                {pendingStatus === "Interview" ? "Schedule Interview" : `Confirm ${pendingStatus}`}
                            </h3>
                            <p className="text-sm font-bold text-slate-400 mb-8 uppercase tracking-widest leading-relaxed">
                                {pendingStatus === "Interview" 
                                    ? "Set up the technical or managerial round" 
                                    : `Provide feedback or instructions for this ${pendingStatus.toLowerCase()} candidate`}
                            </p>

                            {/* CONDITIONAL INTERVIEW FIELDS */}
                            {pendingStatus === "Interview" && (
                                <div className="space-y-4 mb-8">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-4">Date</label>
                                            <input 
                                                type="date" 
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                                                value={interviewData.date}
                                                onChange={(e) => setInterviewData({...interviewData, date: e.target.value})}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-4">Time</label>
                                            <input 
                                                type="time" 
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                                                value={interviewData.time}
                                                onChange={(e) => setInterviewData({...interviewData, time: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-4">Interview Link (Zoom/Meet)</label>
                                        <input 
                                            type="url" 
                                            placeholder="https://meet.google.com/..."
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                                            value={interviewData.link}
                                            onChange={(e) => setInterviewData({...interviewData, link: e.target.value})}
                                        />
                                    </div>
                                     <div className="space-y-1">
                                        <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-4">Internal Instructions (Optional)</label>
                                        <input 
                                            type="text" 
                                            placeholder="Code editor ready, 45 mins technical interview"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                                            value={interviewData.instructions}
                                            onChange={(e) => setInterviewData({...interviewData, instructions: e.target.value})}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1 mb-8">
                                <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest ml-4">Candidate Message / Feedback</label>
                                <textarea
                                    value={statusMessage}
                                    onChange={(e) => setStatusMessage(e.target.value)}
                                    placeholder={pendingStatus === "Interview" ? "Join the link 5 mins early with your CV." : "Add a custom note..."}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-[32px] p-6 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all min-h-[120px]"
                                />
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => { setShowStatusModal(false); setStatusMessage(""); setInterviewData({date:"", time:"", link:"", instructions:""}); }}
                                    className="flex-1 py-5 bg-slate-50 text-slate-300 text-[10px] font-black uppercase tracking-[0.2em] rounded-3xl hover:bg-slate-100 hover:text-slate-400 transition-all border border-slate-100/50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmStatusUpdate}
                                    className="flex-1 py-5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-3xl hover:bg-black shadow-2xl shadow-indigo-100 transition-all active:scale-95 border border-slate-800"
                                >
                                    Confirm Action
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MESSAGE THREAD MODAL */}
            <ApplicationThreadModal
                isOpen={isThreadOpen}
                onClose={() => setIsThreadOpen(false)}
                applicationId={selectedApp?._id}
                application={selectedApp}
                role="Recruiter"
            />
        </div>
    );
};

export default RecruiterApplicants;
