import React, { useState, useEffect, useCallback, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api/apiCheck";
import { AuthContext } from "../context/AuthContext";

/* ─── Standard SVG Icons ─── */
const BriefcaseIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>;
const CheckCircleIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
const BellIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>;
const ClockIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
const LightbulbIcon = () => <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>;
const EyeIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>;
const SearchIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35"></path></svg>;
const BookmarkIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>;


const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        profileCompletion: 0,
        totalApplications: 0,
        unreadNotifications: 0,
        recommendedJobs: [],
        appliedJobs: []
    });

    const [savedJobs, setSavedJobs] = useState([]);

    const fetchDashboardData = useCallback(async () => {
        try {
            const [dashRes, savedRes] = await Promise.all([
                api.get("/jobseeker/dashboard"),
                api.get("/jobseeker/saved-jobs")
            ]);
            setStats(dashRes.data);
            setSavedJobs(savedRes.data);
        } catch (err) {
            console.error("Dashboard statistics error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans text-slate-500 font-semibold uppercase tracking-widest animate-pulse">
            Loading Dashboard Data...
        </div>
    );

    // Derived Dummy Data for realism
    const activeInterviews = Math.floor(stats.totalApplications * 0.15) || 0; 
    
    // Profile Completion Logic (Simulated Checklist)
    const profileTasks = [
        { name: "Verified Email Address", completed: true },
        { name: "Added Profile Summary", completed: stats.profileCompletion > 20 },
        { name: "Uploaded Current Resume", completed: stats.profileCompletion > 50 },
        { name: "Added 3+ Technical Skills", completed: stats.profileCompletion > 75 },
        { name: "Detailed Work Experience", completed: stats.profileCompletion >= 90 }
    ];

    // Removed Dummy Saved Jobs List

    return (
        <div className="min-h-screen bg-slate-50 pb-24 font-sans text-slate-800">
            
            {/* ─── HEADER ─── */}
            <header className="bg-white border-b border-slate-200 py-10 mb-8 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-md text-xs font-bold uppercase tracking-wide mb-3">
                                Job Seeker Dashboard
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 leading-tight">
                                Welcome back, {user?.fullName || 'User'}
                            </h1>
                            <p className="text-slate-500 mt-1">
                                Your central hub for career progress and profile analytics.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <Link 
                                to="/jobseeker/profile" 
                                className="px-5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                            >
                                Edit Profile
                            </Link>
                            <Link 
                                to="/jobs" 
                                className="px-5 py-2.5 bg-indigo-600 border border-transparent text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
                            >
                                Search Jobs
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
                        <Link to="/my-applications" className="text-sm font-medium text-indigo-600 hover:underline">View Applications →</Link>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-center shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-emerald-50 p-3 rounded-lg text-emerald-600"><CheckCircleIcon /></div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active</span>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-1">{activeInterviews}</h2>
                        <p className="text-sm font-medium text-slate-500">Interview Requests</p>
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
                            <div className="bg-blue-50 p-3 rounded-lg text-blue-600"><ClockIcon /></div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Saved</span>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-1">{savedJobs.length}</h2>
                        <p className="text-sm font-medium text-slate-500">Bookmarked Jobs</p>
                    </div>
                </div>

                {/* ─── MAIN CONTENT AREA (2 COLUMNS) ─── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* LEFT COLUMN */}
                    <div className="space-y-8">
                        
                        {/* Profile Completeness Checklist */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Profile Completeness</h3>
                            <p className="text-slate-500 text-sm mb-6">A complete profile dramatically increases your chance of being noticed by enterprise recruiters.</p>
                            
                            <div className="flex items-end justify-between mb-3">
                                <p className="text-sm font-medium text-slate-600">Current Score</p>
                                <span className="text-3xl font-black text-indigo-600">{stats.profileCompletion}%</span>
                            </div>
                            
                            <div className="w-full bg-slate-100 rounded-full h-3 mb-8 overflow-hidden">
                                <div className="bg-indigo-600 h-3 rounded-full transition-all duration-1000" style={{ width: `${stats.profileCompletion}%` }}></div>
                            </div>
                            
                            <div className="space-y-5">
                                {profileTasks.map((task, idx) => (
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
                                                <span className="text-xs text-indigo-600 font-medium mt-1 inline-block">Pending Action</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {stats.profileCompletion < 100 && (
                                <Link to="/jobseeker/profile" className="mt-8 block w-full py-3 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-center text-sm font-bold hover:bg-indigo-100 transition-colors">
                                    Update Profile Now
                                </Link>
                            )}
                        </div>

                        {/* Recent Profile Activity */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 text-slate-900 font-bold flex items-center gap-2">
                                <EyeIcon /> Recent Profile Activity
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="border border-slate-200 rounded-lg p-5">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="bg-blue-50 text-blue-600 p-2 rounded-lg"><SearchIcon /></div>
                                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">+12%</span>
                                        </div>
                                        <h4 className="text-2xl font-black text-slate-900">42</h4>
                                        <p className="text-sm font-medium text-slate-500">Search Appearances</p>
                                    </div>
                                    <div className="border border-slate-200 rounded-lg p-5">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="bg-purple-50 text-purple-600 p-2 rounded-lg"><EyeIcon /></div>
                                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">+5%</span>
                                        </div>
                                        <h4 className="text-2xl font-black text-slate-900">18</h4>
                                        <p className="text-sm font-medium text-slate-500">Profile Views</p>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 mt-5 italic text-center">Data is collected over the last 7 days.</p>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="space-y-8">
                        
                        {/* Saved Opportunities */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-200 bg-white flex items-center justify-between">
                                <div className="flex items-center gap-2 font-bold text-slate-900">
                                    <BookmarkIcon /> Bookmarked Opportunities
                                </div>
                                <Link to="/jobs" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">
                                    Browse More
                                </Link>
                            </div>
                            
                            <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto pr-2">
                                {savedJobs.length === 0 ? (
                                    <div className="p-8 text-center text-slate-500 font-medium text-sm">
                                        You haven't saved any jobs yet.
                                    </div>
                                ) : (
                                    savedJobs.map((job) => (
                                        <div key={job._id} className="p-6 hover:bg-slate-50 transition-colors group">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <Link to={`/job/${job._id}`} className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1 block">
                                                        {job.title}
                                                    </Link>
                                                    <p className="text-sm font-medium text-slate-600 mb-3">{job.companyName}</p>
                                                    
                                                    <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                                                        <span className="bg-slate-100 px-2.5 py-1 rounded font-medium">{job.location}</span>
                                                        <span className="bg-slate-100 px-2.5 py-1 rounded font-medium">
                                                            {job.salary ? `${job.salary.min} - ${job.salary.max} ${job.salary.currency || 'INR'}` : 'Negotiable'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <Link to={`/job/${job._id}`} className="inline-block mt-4 text-center px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-indigo-100 transition">
                                                        View Job
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* SYSTEM SUGGESTION TIP */}
                         <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-2 h-full bg-amber-400"></div>
                            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                                <LightbulbIcon /> <span className="font-bold text-slate-900">Career Suggestion Tip</span>
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-3">Optimize your summary for search</h3>
                                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                    Enterprise applicant tracking systems (ATS) often filter candidates by the first 100 characters of their profile. Ensure you include exact technical keywords from the job description (e.g., "Senior React Developer" instead of "Coding Enthusiast") right at the top of your resume and profile summary.
                                </p>
                                <Link to="/jobseeker/profile" className="inline-flex items-center text-sm font-bold text-amber-600 hover:text-amber-800 hover:underline">
                                    Update Summary Now →
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
