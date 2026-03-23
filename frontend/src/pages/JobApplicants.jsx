import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/apiCheck";
import toast from "react-hot-toast";
import ApplicationThreadModal from "../components/ApplicationThreadModal";

const JobApplicants = () => {
    const { jobId } = useParams();
    const [loading, setLoading] = useState(true);
    const [applicants, setApplicants] = useState([]);
    const [jobDetails, setJobDetails] = useState(null);

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

    useEffect(() => {
        const loadPage = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/jobs/${jobId}/applicants`);
                setApplicants(res.data.applicants || []);
                setJobDetails(res.data.job);
            } catch (error) {
                toast.error("Failed to load applicants");
            } finally {
                setLoading(false);
            }
        };
        loadPage();
    }, [jobId]);

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
            toast.success(`Candidate ${pendingStatus} successfully`);
            
            // Success cleanup
            setShowStatusModal(false);
            setStatusMessage("");
            setInterviewData({ date: "", time: "", link: "", instructions: "" });
            
            // Refresh list
            const res = await api.get(`/jobs/${jobId}/applicants`);
            setApplicants(res.data.applicants);
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-black uppercase tracking-[0.2em] text-[10px] text-slate-400">Syncing Candidates...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafbfc] pb-32 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* DYNAMIC HEADER */}
            <div className="h-72 bg-slate-900 relative overflow-hidden flex flex-col justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-transparent"></div>
                <div className="absolute inset-0 opacity-5">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <circle cx="90" cy="10" r="30" fill="white" />
                        <circle cx="10" cy="80" r="20" fill="white" />
                    </svg>
                </div>
                
                <div className="max-w-7xl mx-auto w-full px-6 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                                Recruitment Console
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none mb-2">
                                {jobDetails?.title || "Role Applicants"}
                            </h1>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs flex items-center gap-3">
                                <span>{applicants.length} Total Applications</span>
                                <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                                <span>{jobDetails?.companyName}</span>
                            </p>
                        </div>
                        <div className="flex gap-4 pb-1">
                             <Link to="/recruiter/jobs" className="px-6 py-3 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all">Back to Listings</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
                {applicants.length === 0 ? (
                    <div className="bg-white rounded-[48px] shadow-sm border border-slate-100 p-24 text-center">
                        <div className="text-7xl mb-6 opacity-10 grayscale">📬</div>
                        <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-2">Empty Inbox</h3>
                        <p className="text-slate-400 font-bold">No candidates have applied for this position yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8">
                        {applicants.map((app) => (
                            <div
                                key={app._id}
                                className="bg-white rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 p-10 flex flex-col lg:flex-row lg:items-center gap-10 transition-all hover:shadow-[0_20px_50px_rgba(79,70,229,0.06)] group border-l-4 border-l-transparent hover:border-l-indigo-600 overflow-hidden relative"
                            >
                                {/* LEFT: IDENTITY */}
                                <div className="flex items-center gap-8 lg:w-1/3">
                                    <div className="w-24 h-24 rounded-[32px] bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-700">
                                        {app.applicant?.profile?.profilePhotoId ? (
                                            <img
                                                src={`http://localhost:5000/api/files/${app.applicant.profile.profilePhotoId}`}
                                                className="w-full h-full object-cover"
                                                alt="Avatar"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-4xl opacity-20 bg-indigo-50 text-indigo-600 font-black italic">
                                                {app.applicant?.fullName?.charAt(0) || "U"}
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <Link 
                                            to={`/recruiter/seeker/${app.applicant?._id}`}
                                            className="text-2xl font-black text-slate-800 tracking-tight uppercase hover:text-indigo-600 transition-colors leading-none block mb-1"
                                        >
                                            {app.applicantDetails?.fullName || app.applicant?.fullName || "Candidate"}
                                        </Link>
                                        <p className="text-sm font-bold text-slate-400">
                                            {app.applicantDetails?.email || app.applicant?.email}
                                        </p>
                                        <div className="pt-2">
                                            <span
                                                className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-full shadow-sm border ${app.status === "Pending"
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
                                    </div>
                                </div>

                                {/* MIDDLE: SKILLS & STATS */}
                                <div className="flex-1 border-y lg:border-y-0 lg:border-x border-slate-50 py-8 lg:py-0 lg:px-10 grid grid-cols-2 gap-8">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-200 uppercase tracking-[0.2em] mb-3">Applicant Skills</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {(app.applicantDetails?.skills || app.applicant?.profile?.skills || []).slice(0, 4).map((skill, idx) => (
                                                <span key={idx} className="bg-slate-50 text-[10px] px-2.5 py-1 rounded-lg border border-slate-100 text-slate-500 font-black uppercase tracking-tighter">
                                                    {skill}
                                                </span>
                                            ))}
                                            {(app.applicantDetails?.skills || app.applicant?.profile?.skills || []).length > 4 && (
                                                <span className="text-[9px] font-bold text-slate-300">+{ (app.applicantDetails?.skills || app.applicant?.profile?.skills).length - 4 } more</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-200 uppercase tracking-[0.2em] mb-3">Experience</span>
                                        <p className="text-xl font-black text-slate-700 leading-none">
                                            {app.applicantDetails?.experience || app.applicant?.profile?.experience || "N/A"}
                                        </p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Self-declared industrial years</p>
                                    </div>
                                </div>

                                {/* RIGHT: ACTIONS */}
                                <div className="flex flex-wrap lg:flex-nowrap gap-3 lg:w-1/4 justify-end">
                                    <div className="grid grid-cols-2 gap-3 w-full">
                                        {app.status === "Pending" && (
                                            <button
                                                onClick={() => handleStatusUpdate(app._id, "Shortlisted")}
                                                className="px-4 py-4 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-100 active:scale-95"
                                            >
                                                Shortlist
                                            </button>
                                        )}

                                        {app.status === "Shortlisted" && (
                                            <button
                                                onClick={() => handleStatusUpdate(app._id, "Interview")}
                                                className="px-4 py-4 bg-purple-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-purple-600 transition-all shadow-xl shadow-purple-100 active:scale-95"
                                            >
                                                Schedule
                                            </button>
                                        )}

                                        {app.status === "Interview" && (
                                            <button
                                                onClick={() => handleStatusUpdate(app._id, "Selected")}
                                                className="px-4 py-4 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-green-600 transition-all shadow-xl shadow-green-100 active:scale-95"
                                            >
                                                Approve
                                            </button>
                                        )}

                                        {app.status !== "Rejected" && app.status !== "Selected" && (
                                            <button
                                                onClick={() => handleStatusUpdate(app._id, "Rejected")}
                                                className="px-4 py-4 bg-white text-rose-600 border border-rose-100 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-rose-50 transition-all active:scale-95"
                                            >
                                                Reject
                                            </button>
                                        )}

                                        <button
                                            onClick={() => { setSelectedApp(app); setIsThreadOpen(true); }}
                                            className="px-4 py-4 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-100 transition-all active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            Chat
                                        </button>

                                        {app.applicant?.resume && (
                                            <a
                                                href={`http://localhost:5000/api/files/${app.applicant.resume}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200 active:scale-95"
                                            >
                                                CV
                                            </a>
                                        )}
                                    </div>
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

export default JobApplicants;