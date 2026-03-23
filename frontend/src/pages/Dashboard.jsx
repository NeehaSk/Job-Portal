import React, { useState, useEffect, useCallback, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api/apiCheck";
import { AuthContext } from "../context/AuthContext";
import { AreaChart, SkillBar, DonutChart } from "../components/Visualizations";

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

    const fetchDashboardData = useCallback(async () => {
        try {
            const { data } = await api.get("/jobseeker/dashboard");
            setStats(data);
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
        <div className="min-h-screen flex items-center justify-center bg-white font-sans text-slate-400 font-bold uppercase tracking-[0.2em] animate-pulse">
            Nexus Intelligence...
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
            
            {/* CLEAN SaaS HEADER */}
            <header className="bg-white border-b border-slate-200/60 py-12 mb-12 shadow-sm">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-indigo-50 border border-indigo-100 rounded text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
                                Job Seeker Edition
                            </div>
                            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">
                                How's it going, {user?.fullName?.split(" ")[0]}?
                            </h1>
                            <p className="text-slate-500 font-medium">Keep track of your applications and find your next big opportunity.</p>
                        </div>
                        <div className="flex gap-4">
                            <Link 
                                to="/jobseeker/profile" 
                                className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                            >
                                Edit Profile
                            </Link>
                            <Link 
                                to="/jobs" 
                                className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 active:scale-95"
                            >
                                Browse Jobs
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    
                    {/* LEFT ANALYTICS PANEL */}
                    <div className="lg:col-span-8 space-y-10">
                        
                        {/* THE "BLACK GRAPH" ACCENT CARD */}
                        <div className="bg-[#0B0F19] rounded-[2rem] p-10 shadow-2xl relative overflow-hidden group border border-white/5">
                            <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/10 blur-[100px] -translate-x-1/2 -translate-y-1/2 rounded-full"></div>
                            
                            <div className="relative z-10 space-y-8">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Application Momentum</p>
                                        <h3 className="text-2xl font-black text-white">Engagement Pulse</h3>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-emerald-400">+18%</p>
                                        <p className="text-[9px] font-bold text-slate-500 uppercase">Weekly Delta</p>
                                    </div>
                                </div>
                                <div className="h-44 w-full">
                                    <AreaChart data={[30, 50, 45, 85, 60, 95, 80]} color="#6366f1" isDark={true} />
                                </div>
                                <div className="grid grid-cols-3 gap-8 pt-6 border-t border-white/5">
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total</p>
                                        <p className="text-lg font-black text-white">{stats.totalApplications}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">In Review</p>
                                        <p className="text-lg font-black text-indigo-400">12</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Interviews</p>
                                        <p className="text-lg font-black text-emerald-400">03</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RECENT APPLICATIONS (SaaS STYLE) */}
                        <div className="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm overflow-hidden">
                            <div className="px-10 py-7 border-b border-slate-100 flex items-center justify-between bg-white">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Application Ledger</h3>
                                <Link to="/my-applications" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">See All History</Link>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {stats.appliedJobs.length > 0 ? stats.appliedJobs.map((app) => (
                                    <div key={app._id} className="px-10 py-8 flex items-center justify-between hover:bg-slate-50/50 transition-all group">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-sm font-bold text-slate-300 group-hover:bg-white group-hover:border-slate-300 transition-all transition-duration-300">
                                                {app.job?.companyName?.charAt(0) || "C"}
                                            </div>
                                            <div>
                                                <h4 className="text-base font-bold text-slate-900">{app.job?.title}</h4>
                                                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-0.5">{app.job?.companyName} • {new Date(app.appliedAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                                app.status === 'Selected' ? 'bg-emerald-50 text-emerald-600' :
                                                app.status === 'Rejected' ? 'bg-rose-50 text-rose-600' :
                                                'bg-indigo-50 text-indigo-600'
                                            }`}>
                                                {app.status}
                                            </span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-300 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="p-20 text-center opacity-40">
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">System Awaiting Data Records</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR PANEL */}
                    <div className="lg:col-span-4 space-y-10">
                        
                        {/* PROFILE & SKILLS (CLEAN SaaS) */}
                        <div className="bg-white p-10 rounded-[2rem] border border-slate-200/60 shadow-sm flex flex-col items-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-10 w-full">Opportunity Alignment</p>
                            <div className="mb-12">
                                <DonutChart percentage={stats.profileCompletion} label="Profile" color="#6366f1" />
                            </div>
                            <div className="space-y-8 w-full">
                                <SkillBar label="Market Demand" percentage={92} color="bg-slate-900" />
                                <SkillBar label="Technical Fit" percentage={85} color="bg-indigo-500" />
                                <SkillBar label="Communication" percentage={76} color="bg-slate-200" />
                            </div>
                        </div>

                        {/* RECOMMENDATIONS (CLEAN SaaS) */}
                        <div className="bg-white p-10 rounded-[2rem] border border-slate-200/60 shadow-sm">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Recommended</h3>
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                            </div>
                            <div className="space-y-8">
                                {stats.recommendedJobs.length > 0 ? stats.recommendedJobs.map((job) => (
                                    <Link key={job._id} to={`/job/${job._id}`} className="block group">
                                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">{job.title}</h4>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                            <span>{job.companyName}</span>
                                            <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                            <span>{job.location}</span>
                                        </div>
                                    </Link>
                                )) : (
                                    <p className="text-xs italic text-slate-300">Scanning market map...</p>
                                )}
                            </div>
                            <Link 
                                to="/jobs" 
                                className="block text-center mt-12 py-4 bg-slate-50 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100 hover:text-slate-700 transition-all border border-slate-200/30"
                            >
                                Explorer Mode
                            </Link>
                        </div>

                        {/* QUICK STATS (MINIMALIST) */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-6 rounded-3xl border border-slate-200/60 text-center shadow-sm">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Inbox</p>
                                <p className="text-2xl font-black text-slate-800">{stats.unreadNotifications}</p>
                            </div>
                            <div className="bg-white p-6 rounded-3xl border border-slate-200/60 text-center shadow-sm">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Views</p>
                                <p className="text-2xl font-black text-slate-800">482</p>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Dashboard;
