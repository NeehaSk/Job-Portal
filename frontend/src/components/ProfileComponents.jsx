import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * Standard White Card for Profile Sections
 */
export const ProfileCard = ({ title, onAdd, onEdit, children, id, isEditing }) => {
    return (
        <div id={id} className="mb-6">
            <div
                key={isEditing ? 'editing' : 'viewing'}
                className="bg-white rounded-[2.5rem] border border-slate-100 p-8 sm:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] group relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/20 rounded-full translate-x-16 -translate-y-16 group-hover:bg-indigo-50/40 transition-all duration-700"></div>

                <div className="flex items-center justify-between mb-8 relative z-10">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                        {title}
                    </h3>
                    <div className="flex gap-3">
                        {onAdd && !isEditing && (
                            <button
                                onClick={onAdd}
                                className="h-10 px-6 bg-indigo-50 text-indigo-600 rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95"
                            >
                                Add New
                            </button>
                        )}
                        {onEdit && !isEditing && (
                            <button
                                onClick={onEdit}
                                className="h-10 px-6 bg-slate-50 text-slate-600 rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm active:scale-95 flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                                Edit
                            </button>
                        )}
                    </div>
                </div>
                <div className="text-slate-500 text-sm leading-8 font-medium relative z-10">
                    {children}
                </div>
            </div>
        </div>
    );
};

/**
 * Quick Links Sidebar for Navigation
 */
export const QuickLinksSidebar = ({ links, activeId, children }) => (
    <div className="hidden lg:block sticky top-24 space-y-8">
        <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
            <div className="p-8 border-b border-slate-50">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Contextual Flow</h4>
            </div>
            <nav className="flex flex-col p-4 gap-2">
                {links.map((link) => (
                    <a
                        key={link.id}
                        href={`#${link.id}`}
                        className={`px-6 py-4 text-sm font-bold transition-all rounded-2xl flex items-center justify-between group ${activeId === link.id
                            ? "text-indigo-600 bg-indigo-50/50 shadow-sm"
                            : "text-slate-400 hover:bg-slate-50 hover:text-slate-800"
                            }`}
                    >
                        {link.label}
                        {activeId === link.id && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>}
                    </a>
                ))}
            </nav>
        </div>
        {children}
    </div>
);

/**
 * Modern Tag styling for skills
 */
export const SkillTag = ({ label }) => (
    <span className="inline-block px-4 py-1.5 bg-indigo-50/50 text-indigo-700 text-[10px] font-bold uppercase tracking-widest rounded-full border border-indigo-100/50 mr-2 mb-2 transition-all hover:bg-indigo-100">
        {label}
    </span>
);

/**
 * Row for simple key-value info
 */
export const InfoRow = ({ label, value }) => (
    <div className="mb-6">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{label}</div>
        <div className="text-[15px] text-slate-800 font-bold">{value || <span className="text-slate-300 italic font-normal">Pending Update</span>}</div>
    </div>
);

/**
 * Professional Job Card
 */
export const JobCard = ({ job, isApplied, onApply, onManage, onDelete, isRecruiter }) => {
    const navigate = useNavigate();

    const handleCardClick = (e) => {
        if (e.target.closest('button')) return;
        navigate(`/job/${job._id}`);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Rolling Intake";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div
            onClick={handleCardClick}
            className="bg-white rounded-[2.5rem] border border-slate-50 p-8 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_60px_-15px_rgba(79,70,229,0.12)] hover:border-indigo-100 transition-all group relative overflow-hidden cursor-pointer active:scale-[0.99]"
        >
            {isApplied && (
                <div className="absolute top-8 right-8 z-10">
                    <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[9px] font-bold uppercase tracking-widest rounded-full border border-emerald-100">Synchronized</span>
                </div>
            )}

            <div className="flex items-start gap-6 mb-10 relative z-10">
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-xl text-white shadow-lg transition-transform duration-500 group-hover:rotate-6">
                    {isRecruiter ? "⚡" : "🏢"}
                </div>
                <div className="flex-1 min-w-0 pr-10">
                    <h3 className="text-lg font-semibold text-slate-900 transition-colors group-hover:text-indigo-600 line-clamp-1">{job.title}</h3>
                    <p className="text-sm font-medium text-slate-600 mt-1">{job.companyName || "Global Enterprise"}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-y-4 mb-8 relative z-10">
                <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-500">Location</span>
                    <p className="text-sm font-medium text-slate-800 truncate">{job.location}</p>
                </div>
                <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-500">Job Type</span>
                    <p className="text-sm font-medium text-slate-800 truncate">{job.jobType || "Permanent"}</p>
                </div>
                <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-500">Salary</span>
                    <p className="text-sm font-medium text-slate-800 truncate">
                        {job.salary && typeof job.salary === 'object'
                            ? `${job.salary.min/1000}k - ${job.salary.max/1000}k`
                            : (job.salary || "Competitive")}
                    </p>
                </div>
                <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-500">Experience</span>
                    <p className="text-sm font-medium text-slate-800 truncate">{job.experienceLevel || "Mid-Level"}</p>
                </div>
            </div>

            <div className="pt-6 border-t border-slate-50 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">Posted:</span>
                    <span className="text-xs font-medium text-slate-800">{formatDate(job.applicationDeadline)}</span>
                </div>
                
                {isRecruiter ? (
                    <button
                        onClick={onManage}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all shadow-sm active:scale-95"
                    >
                        Manage
                    </button>
                ) : (
                    <button
                        disabled={isApplied}
                        onClick={onApply}
                        className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm ${isApplied
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95"
                            }`}
                    >
                        {isApplied ? "Applied" : "Apply Now"}
                    </button>
                )}
            </div>
        </div>
    );
};

/**
 * Filter Sidebar for Job Listings
 */
export const FilterSidebar = ({ categories, selectedCategory, onSelect }) => (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm sticky top-24">
        <div className="p-6 border-b border-slate-100">
            <h4 className="text-lg font-bold text-slate-800">Filters</h4>
        </div>
        <div className="p-4">
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => onSelect(cat)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all mb-1 flex items-center justify-between group ${selectedCategory === cat 
                        ? "bg-indigo-50 text-indigo-700" 
                        : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                        }`}
                >
                    {cat}
                </button>
            ))}
        </div>
    </div>
);

/**
 * Recruiter Analytics Stat Card
 */
export const StatCard = ({ label, value, icon, color = "indigo" }) => (
    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-1 flex items-center gap-10 group">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl bg-${color}-50 text-${color}-600 group-hover:scale-110 transition-transform duration-500`}>
            {icon}
        </div>
        <div className="space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{label}</div>
            <div className="text-4xl font-bold text-slate-900 leading-none tracking-tight">{value}</div>
        </div>
    </div>
);
