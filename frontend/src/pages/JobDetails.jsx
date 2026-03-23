import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/apiCheck";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const JobDetails = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isApplying, setIsApplying] = useState(false);
    const [applyModalOpen, setApplyModalOpen] = useState(false);
    const [applyFormData, setApplyFormData] = useState({
        fullName: "",
        email: "",
        skills: "",
        experience: ""
    });

    // Edit states
    const [editData, setEditData] = useState({
        title: "",
        description: "",
        requirements: "",
        location: "",
        salaryMin: "",
        salaryMax: "",
        jobType: "",
        workMode: ""
    });

    useEffect(() => {
        fetchJobDetails();
        if (user && user.role === "jobseeker") {
            setApplyFormData({
                fullName: user.fullName || "",
                email: user.email || "",
                skills: "",
                experience: ""
            });
        }
    }, [jobId, user]);

    const fetchJobDetails = async () => {
        try {
            const res = await api.get(`/jobs/${jobId}`);
            setJob(res.data);
            setEditData({
                title: res.data.title || "",
                description: res.data.description || "",
                requirements: res.data.requirements ? (Array.isArray(res.data.requirements) ? res.data.requirements.join(", ") : res.data.requirements) : "",
                location: res.data.location || "",
                salaryMin: res.data.salary?.min || "",
                salaryMax: res.data.salary?.max || "",
                jobType: res.data.jobType || "Full-time",
                workMode: res.data.workMode || "On-site"
            });
        } catch (error) {
            toast.error("Failed to fetch job details");
            navigate("/jobs");
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (e) => {
        e.preventDefault();
        setIsApplying(true);
        try {
            await api.post(`/jobs/${jobId}/apply`, applyFormData);
            toast.success("Applied successfully! 🚀");
            setApplyModalOpen(false);
            fetchJobDetails(); // Refresh to show applied status
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to apply");
        } finally {
            setIsApplying(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...editData,
                requirements: editData.requirements.split(",").map(r => r.trim()).filter(Boolean),
                salary: {
                    min: Number(editData.salaryMin),
                    max: Number(editData.salaryMax),
                    currency: job.salary?.currency || "INR",
                    period: job.salary?.period || "Yearly"
                }
            };
            await api.put(`/jobs/update/${jobId}`, payload);
            toast.success("Job updated successfully!");
            setIsEditing(false);
            fetchJobDetails();
        } catch (error) {
            toast.error("Failed to update job");
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this job listing?")) return;
        try {
            await api.delete(`/jobs/delete/${jobId}`);
            toast.success("Job deleted successfully");
            navigate("/recruiter/jobs");
        } catch (error) {
            toast.error("Failed to delete job");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
    );

    const isRecruiter = user?.role === "recruiter";
    const ownsJob = isRecruiter && job?.recruiter?._id === user?.id;

    if (!loading && !job) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-4">Job Not Found</h2>
                <button 
                    onClick={() => navigate("/jobs")}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-full font-bold uppercase tracking-widest text-xs"
                >
                    Back to Jobs
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24">
            {/* Header */}
            <div className="bg-slate-900 w-full pt-36 pb-24 relative overflow-hidden">
                {/* Subtle Grid Background */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                <div className="max-w-7xl mx-auto px-6 w-full relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-10">
                    <div className="space-y-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="bg-white/5 text-indigo-300 hover:bg-white/10 hover:text-white px-4 py-2 rounded-full text-[10px] font-black transition-all uppercase tracking-[0.2em] backdrop-blur-sm border border-white/5"
                        >
                            ← Back to search
                        </button>
                        <div>
                            <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none mb-3">
                                {job?.title}
                            </h1>
                            <div className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <p className="text-2xl text-indigo-300 font-bold uppercase tracking-wide">
                                    {job?.companyName}
                                </p>
                            </div>
                        </div>
                    </div>
                    {!isRecruiter && (
                        <div className="pb-2">
                            <button
                                onClick={() => setApplyModalOpen(true)}
                                disabled={job?.hasApplied}
                                className={`px-14 py-6 font-black rounded-[2rem] transition-all transform uppercase tracking-widest text-sm
                                    ${job?.hasApplied 
                                        ? 'bg-emerald-500 text-white cursor-not-allowed shadow-[0_25px_50px_-12px_rgba(16,185,129,0.5)]' 
                                        : 'bg-indigo-600 text-white shadow-[0_25px_50px_-12px_rgba(79,70,229,0.5)] hover:bg-indigo-500 active:scale-95'
                                    }`}
                            >
                                {job?.hasApplied ? "Applied ✅" : "Express Interest Now"}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                            {isEditing ? (
                                <form onSubmit={handleUpdate} className="space-y-6">
                                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-6">Edit Job Listing</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Job Title</label>
                                            <input
                                                className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                                value={editData.title}
                                                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Location</label>
                                            <input
                                                className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                                value={editData.location}
                                                onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Min Salary</label>
                                            <input
                                                type="number"
                                                className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                                value={editData.salaryMin}
                                                onChange={(e) => setEditData({ ...editData, salaryMin: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Max Salary</label>
                                            <input
                                                type="number"
                                                className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                                value={editData.salaryMax}
                                                onChange={(e) => setEditData({ ...editData, salaryMax: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Job Description</label>
                                        <textarea
                                            rows="6"
                                            className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                            value={editData.description}
                                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Requirements (comma separated)</label>
                                        <textarea
                                            rows="3"
                                            className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                            value={editData.requirements}
                                            onChange={(e) => setEditData({ ...editData, requirements: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="submit"
                                            className="flex-1 bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-100 uppercase tracking-widest text-xs"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="flex-1 bg-slate-100 text-slate-600 font-black py-4 rounded-2xl uppercase tracking-widest text-xs"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-10">
                                    <section>
                                        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-4">Job Description</h2>
                                        <p className="text-slate-600 leading-relaxed whitespace-pre-line text-base">
                                            {job?.description}
                                        </p>
                                    </section>

                                    <section>
                                        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-4">Requirements</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {job?.requirements && job.requirements.length > 0 ? (
                                                job.requirements.map((req, i) => (
                                                    <div key={i} className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                        <span className="text-indigo-600 font-bold">•</span>
                                                        <span className="text-slate-700 text-sm font-medium">{req}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="col-span-1 md:col-span-2 text-slate-500 italic">No specific requirements listed.</div>
                                            )}
                                        </div>
                                    </section>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Key Stats & Actions */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Key Insights</h3>

                            <div className="space-y-6">
                                <Insight icon="📍" label="Location" value={job?.location} />
                                <Insight icon="⏳" label="Job Type" value={job?.jobType} />
                                <Insight icon="🏢" label="Work Mode" value={job?.workMode} />
                                <Insight icon="💰" label="Salary Range" value={`${job?.salary?.min?.toLocaleString()} - ${job?.salary?.max?.toLocaleString()} ${job?.salary?.currency}`} />
                                <Insight icon="🎓" label="Experience" value={job?.experienceLevel} />
                            </div>

                            {ownsJob && (
                                <div className="pt-6 border-t border-slate-50 space-y-4">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="w-full py-4 bg-indigo-50 text-indigo-700 font-black rounded-2xl flex items-center justify-center gap-2 transition hover:bg-indigo-100 uppercase tracking-widest text-xs"
                                    >
                                        Edit Posting
                                    </button>
                                    <button
                                        onClick={() => navigate(`/recruiter/job/${jobId}/applicants`)}
                                        className="w-full py-4 bg-slate-800 text-white font-black rounded-2xl flex items-center justify-center gap-2 transition hover:bg-slate-900 uppercase tracking-widest text-xs shadow-lg shadow-slate-200"
                                    >
                                        View Applicants ({job?.applicantsCount || 0})
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="w-full py-4 border-2 border-red-50 text-red-500 font-black rounded-2xl flex items-center justify-center gap-2 transition hover:bg-red-50 uppercase tracking-widest text-xs"
                                    >
                                        Delete Position
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* APPLY MODAL */}
            {applyModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setApplyModalOpen(false)}></div>
                    <div className="bg-white rounded-[2.5rem] w-full max-w-xl relative shrink-0 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="bg-indigo-600 p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                            <h2 className="text-3xl font-black uppercase tracking-tighter leading-none mb-2">Apply for this Role</h2>
                            <p className="text-indigo-100 text-[11px] font-bold uppercase tracking-widest">Confirm your professional details</p>
                        </div>

                        <form onSubmit={handleApply} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                                    <input
                                        required
                                        className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-bold text-slate-700"
                                        value={applyFormData.fullName}
                                        onChange={(e) => setApplyFormData({ ...applyFormData, fullName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Official Email</label>
                                    <input
                                        required
                                        type="email"
                                        className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-bold text-slate-700"
                                        value={applyFormData.email}
                                        onChange={(e) => setApplyFormData({ ...applyFormData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expertise & Skills (Comma separated)</label>
                                <input
                                    required
                                    placeholder="e.g. React, Node.js, TypeScript"
                                    className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-bold text-slate-700"
                                    value={applyFormData.skills}
                                    onChange={(e) => setApplyFormData({ ...applyFormData, skills: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Years of Experience</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. 3+ years"
                                    className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-bold text-slate-700"
                                    value={applyFormData.experience}
                                    onChange={(e) => setApplyFormData({ ...applyFormData, experience: e.target.value })}
                                />
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setApplyModalOpen(false)}
                                    className="flex-1 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest text-[10px]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isApplying}
                                    className="flex-[2] py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-100 disabled:opacity-50"
                                >
                                    {isApplying ? "Submitting..." : "Submit Application"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const Insight = ({ icon, label, value }) => (
    <div className="flex items-center gap-4 group">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50/50 text-xl flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
            {icon}
        </div>
        <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</div>
            <div className="text-sm font-black text-slate-700 truncate max-w-[150px]">{value}</div>
        </div>
    </div>
);

export default JobDetails;
