import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Mail, Briefcase, Calendar, FileText, ChevronRight, MoreHorizontal, Send } from "lucide-react";
import api from "../api/apiCheck";
import ApplicationThreadModal from "../components/ApplicationThreadModal";
import toast from "react-hot-toast";

const RecruiterApplicants = () => {
    const [applicants, setApplicants] = useState([]);
    const [viewMode, setViewMode] = useState("board"); // 'list' or 'board'

    // Modal States
    const [selectedApp, setSelectedApp] = useState(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [pendingStatus, setPendingStatus] = useState(null);
    const [pendingAppId, setPendingAppId] = useState(null);
    const [statusMessage, setStatusMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [chatOpen, setChatOpen] = useState(false);
    const [chatApp, setChatApp] = useState(null);

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
        const app = applicants.find(a => a._id === applicationId);
        if (app && app.status === status) return;

        setPendingAppId(applicationId);
        setPendingStatus(status);
        setShowStatusModal(true);
    };

    // Drag and Drop Helpers
    const onDragStart = (e, appId) => {
        e.dataTransfer.setData("appId", appId);
    };

    const onDragOver = (e) => {
        e.preventDefault();
    };

    const onDrop = (e, newStatus) => {
        const appId = e.dataTransfer.getData("appId");
        if (appId) {
            handleStatusUpdate(appId, newStatus);
        }
    };

    const columns = ["Pending", "Shortlisted", "Interview", "Selected", "Rejected"];
    const groupedApplicants = columns.reduce((acc, col) => {
        acc[col] = applicants.filter((a) => a.status === col);
        return acc;
    }, {});

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

            setShowStatusModal(false);
            setStatusMessage("");
            setInterviewData({ date: "", time: "", link: "", instructions: "" });
            fetchApplicants();
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Pending": return "bg-amber-50 text-amber-700 border-amber-100";
            case "Shortlisted": return "bg-indigo-50 text-indigo-700 border-indigo-100";
            case "Interview": return "bg-purple-50 text-purple-700 border-purple-100";
            case "Selected": return "bg-emerald-50 text-emerald-700 border-emerald-100";
            case "Rejected": return "bg-rose-50 text-rose-700 border-rose-100";
            default: return "bg-slate-50 text-slate-700 border-slate-100";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loading Console...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20 font-sans pt-16">
            {/* COMPACT PROFESSIONAL HEADER */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-8 md:py-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                                Applicants Console
                            </h2>
                            <p className="text-slate-500 text-xs font-medium">Review and manage candidates across all active job listings</p>
                        </div>

                        <div className="flex items-center gap-3 bg-slate-100 p-1 rounded-xl w-fit">
                            <button
                                onClick={() => setViewMode("board")}
                                className={`px-4 py-1.5 text-[10px] font-bold rounded-lg transition-all ${viewMode === "board" ? "bg-white text-indigo-600 shadow-sm shadow-slate-200" : "text-slate-500 hover:text-slate-700"}`}
                            >
                                Board
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`px-4 py-1.5 text-[10px] font-bold rounded-lg transition-all ${viewMode === "list" ? "bg-white text-indigo-600 shadow-sm shadow-slate-200" : "text-slate-500 hover:text-slate-700"}`}
                            >
                                List
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10">
                {applicants.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-slate-200 p-24 text-center">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-6">
                            <Users size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">No Candidates Yet</h3>
                        <p className="text-slate-500 text-sm max-w-xs mx-auto">Applications for your job listings will automatically appear here once candidates apply.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
                                {applicants.length} Total Applications
                            </span>
                        </div>

                        {viewMode === "list" ? (
                            <div className="grid grid-cols-1 gap-4">
                                {applicants.map((app) => (
                                    <div
                                        key={app._id}
                                        className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-5 hover:border-indigo-200 transition-all hover:shadow-lg hover:shadow-slate-200/50 group"
                                    >
                                        {/* AVATAR - COMPACT */}
                                        <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0">
                                            {app.applicant?.profile?.profilePhotoId ? (
                                                <img
                                                    src={`http://localhost:5000/api/files/${app.applicant.profile.profilePhotoId}`}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    alt="Avatar"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-lg bg-indigo-50 text-indigo-600 font-bold">
                                                    {app.applicant?.fullName?.charAt(0) || "U"}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-3 mb-1">
                                                <Link
                                                    to={`/recruiter/seeker/${app.applicant?._id}`}
                                                    className="text-base font-bold text-slate-900 truncate hover:text-indigo-600 transition-colors"
                                                >
                                                    {app.applicantDetails?.fullName || app.applicant?.fullName || "Applicant"}
                                                </Link>
                                                <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md border ${getStatusColor(app.status)}`}>
                                                    {app.status}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-400">
                                                <span className="flex items-center gap-1.5 min-w-0">
                                                    <Mail size={12} className="text-slate-300 shrink-0" />
                                                    <span className="truncate">{app.applicantDetails?.email || app.applicant?.email}</span>
                                                </span>
                                                <span className="flex items-center gap-1.5 min-w-0">
                                                    <Briefcase size={12} className="text-slate-300 shrink-0" />
                                                    <span className="truncate uppercase tracking-tight text-[10px] font-bold">{app.job?.title}</span>
                                                </span>
                                            </div>
                                        </div>

                                        {/* INFO GRID - COMPACT */}
                                        <div className="hidden lg:grid grid-cols-2 gap-x-6 border-l border-slate-100 pl-6 h-full">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Exp</span>
                                                <span className="text-xs font-bold text-slate-700">{app.applicantDetails?.experience || app.applicant?.profile?.experience || "0"}y</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Skills</span>
                                                <div className="flex gap-1 mt-0.5 overflow-hidden">
                                                    {(app.applicantDetails?.skills || app.applicant?.profile?.skills || []).slice(0, 2).map((skill, idx) => (
                                                        <span key={idx} className="bg-slate-50 text-[8px] px-1.5 py-0.5 rounded border border-slate-100 text-slate-500 font-bold whitespace-nowrap">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-slate-50">
                                            {app.status === "Pending" && (
                                                <button
                                                    onClick={() => handleStatusUpdate(app._id, "Shortlisted")}
                                                    className="flex-1 md:flex-none px-4 py-2 bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-widest rounded-lg hover:bg-emerald-700 transition-all active:scale-95"
                                                >
                                                    Shortlist
                                                </button>
                                            )}
                                            {app.status === "Shortlisted" && (
                                                <button
                                                    onClick={() => handleStatusUpdate(app._id, "Interview")}
                                                    className="flex-1 md:flex-none px-4 py-2 bg-purple-600 text-white text-[9px] font-bold uppercase tracking-widest rounded-lg hover:bg-purple-700 transition-all active:scale-95"
                                                >
                                                    Interview
                                                </button>
                                            )}
                                            {app.status === "Interview" && (
                                                <button
                                                    onClick={() => handleStatusUpdate(app._id, "Selected")}
                                                    className="flex-1 md:flex-none px-4 py-2 bg-green-600 text-white text-[9px] font-bold uppercase tracking-widest rounded-lg hover:bg-green-700 transition-all active:scale-95"
                                                >
                                                    Select
                                                </button>
                                            )}
                                            {app.status !== "Rejected" && app.status !== "Selected" && (
                                                <button
                                                    onClick={() => handleStatusUpdate(app._id, "Rejected")}
                                                    className="flex-1 md:flex-none px-4 py-2 bg-white text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-200 text-[9px] font-bold uppercase tracking-widest rounded-lg transition-all"
                                                >
                                                    Reject
                                                </button>
                                            )}

                                            <div className="flex gap-2 ml-2">
                                                {app.applicant?.profile?.resumeId && (
                                                    <a
                                                        href={`http://localhost:5000/api/files/${app.applicant.profile.resumeId}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-black transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
                                                        title="View CV"
                                                    >
                                                        <FileText size={14} />
                                                        <span>CV</span>
                                                    </a>
                                                )}
                                                <button
                                                    onClick={() => { setChatApp(app); setChatOpen(true); }}
                                                    className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
                                                    title="Send Message"
                                                >
                                                    <Mail size={14} />
                                                    <span>Send Mail</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex gap-4 overflow-x-auto pb-8 snap-x" style={{ scrollbarWidth: "thin" }}>
                                {columns.map(col => (
                                    <div
                                        key={col}
                                        className="min-w-[260px] max-w-[260px] flex-shrink-0 snap-current flex flex-col h-full"
                                    >
                                        <div className="flex items-center justify-between mb-4 px-2">
                                            <h3 className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.15em] flex items-center gap-2">
                                                <span className={`w-1.5 h-1.5 rounded-full ${col === "Pending" ? "bg-amber-400" :
                                                        col === "Shortlisted" ? "bg-indigo-400" :
                                                            col === "Interview" ? "bg-purple-400" :
                                                                col === "Selected" ? "bg-green-400" :
                                                                    "bg-rose-400"
                                                    }`}></span>
                                                {col}
                                            </h3>
                                            <span className="bg-slate-200 text-slate-600 font-bold px-1.5 py-0.5 rounded text-[8px]">{groupedApplicants[col].length}</span>
                                        </div>

                                        <div className="space-y-3 min-h-[450px] bg-slate-100/50 p-2 rounded-2xl border border-slate-100/50"
                                            onDragOver={onDragOver}
                                            onDrop={(e) => onDrop(e, col)}
                                        >
                                            {groupedApplicants[col].map(app => (
                                                <div
                                                    draggable
                                                    onDragStart={(e) => onDragStart(e, app._id)}
                                                    key={app._id}
                                                    className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm cursor-grab active:cursor-grabbing hover:border-indigo-300 transition-all group"
                                                >
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0">
                                                            {app.applicant?.profile?.profilePhotoId ? (
                                                                <img src={`http://localhost:5000/api/files/${app.applicant.profile.profilePhotoId}`} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-600 font-bold text-xs">{app.applicantDetails?.fullName?.charAt(0) || "U"}</div>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <Link to={`/recruiter/seeker/${app.applicant?._id}`} className="text-[11px] font-bold text-slate-900 hover:text-indigo-600 block transition-colors truncate">
                                                                {app.applicantDetails?.fullName || app.applicant?.fullName || "Applicant"}
                                                            </Link>
                                                            <p className="text-[8px] font-medium text-slate-400 truncate uppercase mt-0.5 tracking-tight">{app.job?.title}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-50">
                                                        <span className="bg-slate-50 text-[8px] font-bold px-1.5 py-0.5 rounded text-slate-500 border border-slate-100">
                                                            {app.applicantDetails?.experience || app.applicant?.profile?.experience || "0"}y Exp
                                                        </span>
                                                        <div className="flex gap-1.5">
                                                            {app.applicant?.profile?.resumeId && (
                                                                <a
                                                                    href={`http://localhost:5000/api/files/${app.applicant.profile.resumeId}`}
                                                                    target="_blank"
                                                                    className="px-2.5 py-1.5 bg-slate-900 text-white rounded-lg flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider hover:bg-black"
                                                                >
                                                                    <FileText size={12} />
                                                                    <span>CV</span>
                                                                </a>
                                                            )}
                                                            <button
                                                                onClick={() => { setChatApp(app); setChatOpen(true); }}
                                                                className="px-2.5 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider hover:bg-indigo-100"
                                                            >
                                                                <Mail size={12} />
                                                                <span>Message</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {groupedApplicants[col].length === 0 && (
                                                <div className="h-16 border border-dashed border-slate-200 rounded-xl flex items-center justify-center text-[9px] font-bold text-slate-400 uppercase tracking-widest italic opacity-50">
                                                    Empty
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* STATUS MODAL - COMPACT */}
            {showStatusModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1">
                                {pendingStatus === "Interview" ? "Schedule Interview" : `Confirm ${pendingStatus}`}
                            </h3>
                            <p className="text-xs text-slate-500 mb-6 font-medium">
                                {pendingStatus === "Interview"
                                    ? "Define the session details."
                                    : `Apply status update to this candidate.`}
                            </p>

                            {pendingStatus === "Interview" && (
                                <div className="space-y-4 mb-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase ml-0.5 tracking-wider">Date</label>
                                            <input
                                                type="date"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-semibold outline-none focus:border-indigo-600 transition-all"
                                                value={interviewData.date}
                                                onChange={(e) => setInterviewData({ ...interviewData, date: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase ml-0.5 tracking-wider">Time</label>
                                            <input
                                                type="time"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-semibold outline-none focus:border-indigo-600 transition-all"
                                                value={interviewData.time}
                                                onChange={(e) => setInterviewData({ ...interviewData, time: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-0.5 tracking-wider">Meet Link</label>
                                        <input
                                            type="url"
                                            placeholder="https://..."
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-semibold outline-none focus:border-indigo-600 transition-all"
                                            value={interviewData.link}
                                            onChange={(e) => setInterviewData({ ...interviewData, link: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1 mb-6">
                                <label className="text-[10px] font-bold text-slate-500 uppercase ml-0.5 tracking-wider">Message (Optional)</label>
                                <textarea
                                    value={statusMessage}
                                    onChange={(e) => setStatusMessage(e.target.value)}
                                    placeholder="Brief note to candidate..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-semibold outline-none focus:border-indigo-600 transition-all min-h-[80px]"
                                />
                            </div>

                            <div className="flex gap-2.5">
                                <button
                                    onClick={() => { setShowStatusModal(false); setStatusMessage(""); setInterviewData({ date: "", time: "", link: "", instructions: "" }); }}
                                    className="flex-1 py-2.5 text-[10px] font-bold text-slate-400 rounded-lg hover:bg-slate-50 uppercase tracking-widest transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmStatusUpdate}
                                    className="flex-[2] py-2.5 bg-indigo-600 text-white text-[10px] font-bold rounded-lg hover:bg-indigo-700 uppercase tracking-widest shadow-lg shadow-indigo-100/50 transition-all active:scale-95"
                                >
                                    Update Status
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {chatApp && (
                <ApplicationThreadModal
                    isOpen={chatOpen}
                    onClose={() => setChatOpen(false)}
                    applicationId={chatApp._id}
                    application={chatApp}
                    role="Recruiter"
                />
            )}
        </div>
    );
};

export default RecruiterApplicants;
