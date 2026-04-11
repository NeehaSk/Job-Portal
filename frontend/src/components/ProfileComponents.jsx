import React from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Zap, Briefcase, MapPin, Calendar, IndianRupee, Clock } from "lucide-react";

/**
 * Standard White Card for Profile Sections
 */
export const ProfileCard = ({ title, onAdd, onEdit, children, id, isEditing }) => {
    return (
        <div id={id} className="mb-6">
            <div
                key={isEditing ? 'editing' : 'viewing'}
                className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm transition-all hover:shadow-md group relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/20 rounded-full translate-x-12 -translate-y-12 group-hover:bg-indigo-50/40 transition-all duration-700"></div>

                <div className="flex items-center justify-between mb-6 relative z-10">
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                        {title}
                    </h3>
                    <div className="flex gap-2">
                        {onAdd && !isEditing && (
                            <button
                                onClick={onAdd}
                                className="h-9 px-4 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95"
                            >
                                Add New
                            </button>
                        )}
                        {onEdit && !isEditing && (
                            <button
                                onClick={onEdit}
                                className="h-9 px-4 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm active:scale-95 flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                                Edit
                            </button>
                        )}
                    </div>
                </div>
                <div className="text-slate-500 text-sm leading-7 font-medium relative z-10">
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
    <div className="hidden lg:block sticky top-20 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-50">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Section Map</h4>
            </div>
            <nav className="flex flex-col p-2 gap-1">
                {links.map((link) => (
                    <a
                        key={link.id}
                        href={`#${link.id}`}
                        className={`px-5 py-3 text-sm font-semibold transition-all rounded-xl flex items-center justify-between group ${activeId === link.id
                            ? "text-indigo-600 bg-indigo-50/50"
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                            }`}
                    >
                        {link.label}
                        {activeId === link.id && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>}
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
    <span className="inline-block px-3 py-1 bg-slate-50 text-slate-600 text-[9px] font-bold uppercase tracking-wider rounded-md border border-slate-100 mr-2 mb-2 transition-all hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100">
        {label}
    </span>
);

/**
 * Row for simple key-value info
 */
export const InfoRow = ({ label, value }) => (
    <div className="mb-4">
        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</div>
        <div className="text-sm text-slate-700 font-bold">{value || <span className="text-slate-300 italic font-normal">Pending Update</span>}</div>
    </div>
);

/**
 * Professional Job Card
 */
export const JobCard = ({ job, isApplied, onApply, onManage, onDelete, isRecruiter }) => {
    const navigate = useNavigate();

    const handleCardClick = (e) => {
        if (e.target.closest('button') || e.target.closest('a')) return;
        navigate(`/job/${job._id}`);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Active Listing";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div
            onClick={handleCardClick}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all group relative cursor-pointer"
        >
            {isApplied && (
                <div className="absolute top-4 right-4 z-10">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-bold uppercase tracking-wider rounded-md border border-emerald-100">Applied</span>
                </div>
            )}

            <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-500 group-hover:border-indigo-100 transition-all duration-300">
                    {isRecruiter ? <Zap size={22} strokeWidth={2.5} /> : <Building2 size={22} strokeWidth={2.5} />}
                </div>
                <div className="flex-1 min-w-0 pr-8">
                    <h3 className="text-base font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{job.title}</h3>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5 truncate uppercase tracking-wider">{job.companyName || "NEXAL ENTITIY"}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-y-3 mb-6">
                <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-0.5">Location</span>
                    <p className="text-xs font-bold text-slate-600 flex items-center gap-1.5 truncate">
                        <MapPin size={12} className="text-slate-300" /> {job.location}
                    </p>
                </div>
                <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-0.5">Role Type</span>
                    <p className="text-xs font-bold text-slate-600 flex items-center gap-1.5 truncate">
                        <Clock size={12} className="text-slate-300" /> {job.jobType || "Permanent"}
                    </p>
                </div>
                <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-0.5">Compensation</span>
                    <p className="text-xs font-bold text-slate-600 flex items-center gap-1.5 truncate">
                        <IndianRupee size={12} className="text-slate-400" /> 
                        {job.salary && typeof job.salary === 'object'
                            ? `${job.salary.min/1000}k - ${job.salary.max/1000}k`
                            : (job.salary || "Competitive")}
                    </p>
                </div>
                <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-0.5">Experience</span>
                    <p className="text-xs font-bold text-slate-600 flex items-center gap-1.5 truncate">
                        <Briefcase size={12} className="text-slate-300" /> {job.experienceLevel || "Mid-Level"}
                    </p>
                </div>
            </div>

            <div className="pt-5 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400">
                    {formatDate(job.applicationDeadline)}
                </span>
                
                {isRecruiter ? (
                    <div className="flex gap-2">
                         <button
                            onClick={(e) => { e.stopPropagation(); onDelete(job._id); }}
                            className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                            title="Delete"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                        <button
                            onClick={onManage}
                            className="bg-slate-900 text-white px-5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all active:scale-95"
                        >
                            Manage
                        </button>
                    </div>
                ) : (
                    <button
                        disabled={isApplied}
                        onClick={onApply}
                        className={`px-5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${isApplied
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm active:scale-95"
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
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-50">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Filter By</h4>
        </div>
        <div className="p-3">
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => onSelect(cat)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all mb-1 flex items-center justify-between group ${selectedCategory === cat 
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
    <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center gap-6 group">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-slate-50 text-${color}-600 border border-slate-100 group-hover:bg-white group-hover:border-indigo-100 group-hover:scale-105 transition-all duration-300`}>
            {icon}
        </div>
        <div className="space-y-0.5">
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em]">{label}</div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">{value}</div>
        </div>
    </div>
);
