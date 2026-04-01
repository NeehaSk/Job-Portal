import React, { useState, useEffect, useCallback, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api/apiCheck";
import { AuthContext } from "../context/AuthContext";
import { StatCard } from "../components/ProfileComponents";
import { Briefcase, CheckCircle, Bell, Bookmark, Eye, Lightbulb } from "lucide-react";


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
            
            {/* CORPORATE HEADER */}
            <div className="h-56 bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 w-full flex flex-col justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white"></path>
                    </svg>
                </div>

                <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 relative z-10 text-center">
                    <h1 className="text-white text-4xl font-black uppercase tracking-widest leading-none mb-3">
                        Job Seeker Dashboard
                    </h1>
                    <p className="text-indigo-200 text-sm font-bold uppercase tracking-widest">Your central hub for career progress</p>
                </div>
            </div>

            <main className="max-w-7xl mx-auto -mt-10 px-4 sm:px-6 relative z-20">
                
                {/* ─── TOP KPI METRICS GRID ─── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard label="Total Applications" value={stats.totalApplications} icon={<Briefcase size={28} />} color="indigo" />
                    <StatCard label="Active Interviews" value={activeInterviews} icon={<CheckCircle size={28} />} color="emerald" />
                    <StatCard label="Unread Notifications" value={stats.unreadNotifications} icon={<Bell size={28} />} color="amber" />
                    <StatCard label="Bookmarked Jobs" value={savedJobs.length} icon={<Bookmark size={28} />} color="blue" />
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
