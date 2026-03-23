import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * Standard White Card for Profile Sections
 * Matches Naukri's clean aesthetic
 */
export const ProfileCard = ({ title, onAdd, onEdit, children, id }) => (
    <div id={id} className="bg-white rounded-[32px] border border-slate-100 p-8 mb-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] group relative overflow-hidden">
        {/* Subtle Background Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/30 rounded-full translate-x-16 -translate-y-16 group-hover:bg-blue-50/50 transition-all duration-700"></div>

        <div className="flex items-center justify-between mb-6 relative z-10">
            <h3 className="text-lg font-black text-slate-800 tracking-tight uppercase">
                {title}
            </h3>
            <div className="flex gap-4">
                {onAdd && (
                    <button
                        onClick={onAdd}
                        className="h-10 px-6 bg-slate-50 text-blue-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95"
                    >
                        <span>Add</span>
                    </button>
                )}
                {onEdit && (
                    <button
                        onClick={onEdit}
                        className="h-10 px-6 bg-slate-50 text-blue-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95 flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        <span>Edit</span>
                    </button>
                )}
            </div>
        </div>
        <div className="text-slate-500 text-sm leading-8 font-medium relative z-10">
            {children}
        </div>
    </div>
);


/**
 * Quick Links Sidebar for Navigation
 */
export const QuickLinksSidebar = ({ links, activeId, children }) => (
    <div className="hidden lg:block sticky top-24 space-y-8">
        <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <div className="p-8 border-b border-slate-50">
                <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Jump to section</h4>
            </div>
            <nav className="flex flex-col p-4 gap-1">
                {links.map((link) => (
                    <a
                        key={link.id}
                        href={`#${link.id}`}
                        className={`px-6 py-4 text-[13px] font-black transition-all rounded-[20px] flex items-center justify-between group uppercase spacing tracking-wider ${activeId === link.id
                            ? "text-blue-600 bg-blue-50/50 shadow-sm"
                            : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                            }`}
                    >
                        {link.label}
                        {activeId === link.id && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>}
                        {link.secondaryAction && activeId !== link.id && (
                            <span className="text-[9px] font-black text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity tracking-tighter">{link.secondaryAction}</span>
                        )}
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
    <span className="inline-block px-4 py-1.5 bg-slate-50 text-slate-700 text-xs font-medium rounded-full border border-slate-200 mr-2 mb-2 transition-colors hover:border-indigo-200 hover:bg-blue-50">
        {label}
    </span>
);

/**
 * Row for simple key-value info
 */
export const InfoRow = ({ label, value }) => (
    <div className="mb-3">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</div>
        <div className="text-sm text-slate-700 font-semibold">{value || "Not updated"}</div>
    </div>
);

/**
 * Professional Job Card
 */
export const JobCard = ({ job, isApplied, onApply, onManage, onDelete, isRecruiter }) => {
    const navigate = useNavigate();

    const handleCardClick = (e) => {
        // Prevent navigation if clicking buttons
        if (e.target.closest('button')) return;
        navigate(`/job/${job._id}`);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "No deadline set";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div
            onClick={handleCardClick}
            className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-blue-100 transition-all group relative overflow-hidden cursor-pointer"
        >
            {isApplied && (
                <div className="absolute top-0 right-0 z-10">
                    <div className="bg-emerald-500 text-white text-[9px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-tighter">Applied</div>
                </div>
            )}

            {isRecruiter && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(job._id);
                    }}
                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white shadow-sm"
                    title="Delete Posting"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            )}

            <div className="flex items-start gap-5 mb-8">
                <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-3xl grayscale group-hover:grayscale-0 group-hover:bg-blue-50 group-hover:scale-110 transition-all duration-500 shadow-inner">
                    {isRecruiter ? "📢" : "💼"}
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors uppercase tracking-tight line-clamp-1">{job.title}</h3>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">{job.companyName || "Confidential Organization"}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-y-4 mb-8 relative z-0">
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black text-slate-200 uppercase tracking-widest">Location</span>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <span className="text-blue-600/50">📍</span> <span className="truncate">{job.location}</span>
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black text-slate-200 uppercase tracking-widest">Type</span>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <span className="text-blue-600/50">⏳</span> <span>{job.jobType || "Full Time"}</span>
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black text-slate-200 uppercase tracking-widest">Salary</span>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <span className="text-blue-600/50">💰</span>
                        <span className="truncate">
                            {typeof job.salary === 'object' && job.salary !== null
                                ? `${job.salary.min?.toLocaleString() || ''} - ${job.salary.max?.toLocaleString() || ''}`
                                : (job.salary || "Not Disclosed")}
                        </span>
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black text-slate-200 uppercase tracking-widest">Experience</span>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <span className="text-blue-600/50">🎓</span> <span>{job.experienceLevel || " Fresher"}</span>
                    </div>
                </div>
            </div>

            <div className="mb-8 p-4 bg-slate-50/50 rounded-2xl border border-slate-50 flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Last Date to Apply</span>
                    <span className="text-xs font-black text-slate-700">{formatDate(job.applicationDeadline)}</span>
                </div>
                {job.status === "Closed" && (
                    <span className="px-3 py-1 bg-rose-50 text-rose-500 text-[9px] font-black uppercase tracking-widest rounded-lg border border-rose-100">Closed</span>
                )}
            </div>

            {isRecruiter ? (
                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Total Candidates</span>
                        <span className="text-2xl font-black text-blue-600 leading-none">{job.applicantsCount || 0}</span>
                    </div>
                    <button
                        onClick={onManage}
                        className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-[10px] font-black shadow-xl shadow-slate-200 hover:bg-black transition-all transform active:scale-95 flex items-center gap-3 uppercase tracking-widest"
                    >
                        Manage Applicants <span className="text-base leading-none">→</span>
                    </button>
                </div>
            ) : (
                <button
                    disabled={isApplied}
                    onClick={onApply}
                    className={`w-full py-5 rounded-2xl text-[10px] font-black transition-all transform active:scale-[0.98] uppercase tracking-[0.2em] shadow-xl ${isApplied
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none"
                        : "bg-slate-900 text-white shadow-xl shadow-slate-200 hover:bg-black hover:shadow-slate-300"
                        }`}
                >
                    {isApplied ? "ALREADY APPLIED" : "⚡ APPLY NOW"}
                </button>
            )}
        </div>
    );
};

/**
 * Filter Sidebar for Job Listings
 */
export const FilterSidebar = ({ categories, selectedCategory, onSelect }) => (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm sticky top-24">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Filter by category</h4>
            <span className="text-[10px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full font-bold">ALL</span>
        </div>
        <div className="p-2">
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => onSelect(cat)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all mb-1 flex items-center justify-between ${selectedCategory === cat ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "text-slate-600 hover:bg-slate-50"
                        }`}
                >
                    {cat}
                    {selectedCategory === cat && <span>✓</span>}
                </button>
            ))}
        </div>
    </div>
);

/**
 * Recruiter Analytics Stat Card
 */
export const StatCard = ({ label, value, icon, color = "indigo" }) => (
    <div className="bg-white p-8 rounded-[40px] border border-slate-50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all hover:-translate-y-1 flex items-center gap-8 group">
        <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center text-3xl bg-${color}-50 text-${color}-600 group-hover:scale-110 transition-transform duration-500`}>
            {icon}
        </div>
        <div>
            <div className="text-[10px] font-black text-slate-200 uppercase tracking-[0.2em] mb-2">{label}</div>
            <div className="text-4xl font-black text-slate-800 leading-none tracking-tighter">{value}</div>
        </div>
    </div>
);

