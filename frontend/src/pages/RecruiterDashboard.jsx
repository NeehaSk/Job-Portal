import React, { useState, useEffect, useCallback, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api/apiCheck";
import { AuthContext } from "../context/AuthContext";

/* ─── Standard SVG Icons (Matching Dashboard.jsx) ─── */
const BriefcaseIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>;
const CheckCircleIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
const BellIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>;
const MegaPhoneIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>;
const EyeIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>;
const UserGroupIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>;
const BookmarkIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>;

const RecruiterDashboard = () => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalJobs: 0,
        totalApplications: 0,
        statusBreakdown: [],
        recentApplications: [],
        unreadNotifications: 0,
        shortlistedCount: 0,
        profileCompletion: 0
    });

    const fetchDashboardData = useCallback(async () => {
        try {
            const res = await api.get("/recruiter/dashboard");
            setStats(res.data);
        } catch (err) {
            console.error("Recruiter dashboard error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans text-slate-500 font-semibold uppercase tracking-widest animate-pulse">
            Loading Recruiter Dashboard...
        </div>
    );

    const recruiterTasks = [
        { name: "Verified Account Identity", completed: true },
        { name: "Complete Company Profile", completed: stats.profileCompletion > 40 },
        { name: "Active Job Listings", completed: stats.totalJobs > 0 },
        { name: "Professional Bio Added", completed: stats.profileCompletion > 70 },
        { name: "Branding Assets (Logo/Banner)", completed: stats.profileCompletion >= 90 }
    ];

    return (
        <div className="min-h-screen bg-slate-50 pb-24 font-sans text-slate-800">
            
            {/* ─── HEADER ─── */}
            <header className="bg-white border-b border-slate-200 py-10 mb-8 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-md text-xs font-bold uppercase tracking-wide mb-3">
                                Recruiter Console
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 leading-tight">
                                Welcome back, {user?.fullName || 'User'}
                            </h1>
                            <p className="text-slate-500 mt-1">
                                Your central hub for talent acquisition and hiring analytics.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <Link 
                                to="/recruiter/profile" 
                                className="px-5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                            >
                                Edit Profile
                            </Link>
                            <Link 
                                to="/recruiter/create-job" 
                                className="px-5 py-2.5 bg-indigo-600 border border-transparent text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
                            >
                                Post Job
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* ─── TOP KPI METRICS GRID ─── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-center shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-indigo-50 p-3 rounded-lg text-indigo-600"><BriefcaseIcon /></div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total</span>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-1">{stats.totalApplications}</h2>
                        <Link to="/recruiter/applicants" className="text-sm font-medium text-indigo-600 hover:underline">View Applications →</Link>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-center shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-emerald-50 p-3 rounded-lg text-emerald-600"><CheckCircleIcon /></div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active</span>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-1">{stats.shortlistedCount}</h2>
                        <p className="text-sm font-medium text-slate-500">Shortlisted Candidates</p>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-center shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-amber-50 p-3 rounded-lg text-amber-600"><BellIcon /></div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Inbox</span>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-1">{stats.unreadNotifications}</h2>
                        <p className="text-sm font-medium text-slate-500">Unread Notifications</p>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-center shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-blue-50 p-3 rounded-lg text-blue-600"><MegaPhoneIcon /></div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Listings</span>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-1">{stats.totalJobs}</h2>
                        <p className="text-sm font-medium text-slate-500">Active Job Posts</p>
                    </div>
                </div>

                {/* ─── MAIN CONTENT AREA (2 COLUMNS) ─── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* LEFT COLUMN: Recruiter Status */}
                    <div className="space-y-8">
                        
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Recruiter Health Score</h3>
                            <p className="text-slate-500 text-sm mb-6">A complete company profile increases candidate trust and application quality significantly.</p>
                            
                            <div className="flex items-end justify-between mb-3">
                                <p className="text-sm font-medium text-slate-600">Current Score</p>
                                <span className="text-3xl font-black text-indigo-600">{stats.profileCompletion}%</span>
                            </div>
                            
                            <div className="w-full bg-slate-100 rounded-full h-3 mb-8 overflow-hidden">
                                <div className="bg-indigo-600 h-3 rounded-full transition-all duration-1000" style={{ width: `${stats.profileCompletion}%` }}></div>
                            </div>
                            
                            <div className="space-y-5">
                                {recruiterTasks.map((task, idx) => (
                                    <div key={idx} className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                        <div className={`shrink-0 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center border ${
                                            task.completed ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-slate-100 border-slate-300 text-transparent'
                                        }`}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                                        </div>
                                        <div>
                                            <span className={`text-base block font-semibold ${task.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                                                {task.name}
                                            </span>
                                            {!task.completed && (
                                                <span className="text-xs text-indigo-600 font-medium mt-1 inline-block">Action Required</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {stats.profileCompletion < 100 && (
                                <Link to="/recruiter/profile" className="mt-8 block w-full py-3 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-center text-sm font-bold hover:bg-indigo-100 transition-colors">
                                    Finalize Enterprise Identity
                                </Link>
                            )}
                        </div>

                        {/* Marketplace Activity */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 text-slate-900 font-bold flex items-center gap-2">
                                <UserGroupIcon /> Pipeline Overview
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="border border-slate-200 rounded-lg p-5">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="bg-blue-50 text-blue-600 p-2 rounded-lg"><EyeIcon /></div>
                                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Normal</span>
                                        </div>
                                        <h4 className="text-2xl font-black text-slate-900">{stats.totalApplications}</h4>
                                        <p className="text-sm font-medium text-slate-500">Active Pipeline</p>
                                    </div>
                                    <div className="border border-slate-200 rounded-lg p-5">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="bg-purple-50 text-purple-600 p-2 rounded-lg"><CheckCircleIcon /></div>
                                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Top 15%</span>
                                        </div>
                                        <h4 className="text-2xl font-black text-slate-900">{stats.shortlistedCount}</h4>
                                        <p className="text-sm font-medium text-slate-500">Selected Talent</p>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 mt-5 italic text-center">Talent distribution across all active managed roles.</p>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Recent Apps */}
                    <div className="space-y-8">
                        
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-200 bg-white flex items-center justify-between">
                                <div className="flex items-center gap-2 font-bold text-slate-900">
                                    <BookmarkIcon /> Recent Applicants
                                </div>
                                <Link to="/recruiter/applicants" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">
                                    View All
                                </Link>
                            </div>
                            
                            <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto pr-2">
                                {stats.recentApplications.length === 0 ? (
                                    <div className="p-8 text-center text-slate-500 font-medium text-sm">
                                        No recent candidates detected.
                                    </div>
                                ) : (
                                    stats.recentApplications.map((app) => (
                                        <div key={app._id} className="p-6 hover:bg-slate-50 transition-colors group">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1 block">
                                                        {app.applicant?.fullName}
                                                    </h4>
                                                    <p className="text-sm font-medium text-slate-600 mb-2 truncate">Applied for: {app.job?.title}</p>
                                                    
                                                    <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                                                        <span className="bg-slate-100 px-2.5 py-1 rounded font-medium">{app.status}</span>
                                                        <span className="bg-slate-100 px-2.5 py-1 rounded font-medium">
                                                            {new Date(app.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right ml-4">
                                                    <Link to={`/recruiter/job/${app.job?._id}/applicants`} className="inline-block mt-4 text-center px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-indigo-100 transition whitespace-nowrap">
                                                        View Profile
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Recruiter Tip */}
                         <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-2 h-full bg-amber-400"></div>
                            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <span className="font-bold text-slate-900">Talent Acquisition Tip</span>
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-3">Faster response times attract better talent</h3>
                                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                    Candidates are 3x more likely to accept an offer if they receive a recruiter response within the first 48 hours of applying. Check your application console daily to shortlist top talent before competitors do.
                                </p>
                                <Link to="/recruiter/applicants" className="inline-flex items-center text-sm font-bold text-amber-600 hover:text-amber-800 hover:underline">
                                    Shortlist Now →
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default RecruiterDashboard;
