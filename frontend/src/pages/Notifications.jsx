import React, { useEffect, useState } from "react";
import api from "../api/apiCheck";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await api.get("/notifications");
            setNotifications(res.data);
        } catch (error) {
            toast.error("Failed to load notifications");
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error(error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put("/notifications/read-all");
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            toast.success("All marked as read");
        } catch (error) {
            toast.error("Failed to update");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-indigo-600 font-black tracking-widest uppercase">
                Loading Alerts...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-20">
            <div className="h-64 bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900 w-full relative overflow-hidden flex flex-col justify-center items-center">
                <div className="absolute inset-0 opacity-10">
                    <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <circle cx="50" cy="50" r="40" fill="white" fillOpacity="0.1" />
                        <circle cx="20" cy="80" r="20" fill="white" fillOpacity="0.05" />
                    </svg>
                </div>
                <h1 className="text-3xl font-black text-white tracking-widest uppercase mb-2 relative z-10">Notifications</h1>
                <p className="text-indigo-300 text-sm font-bold relative z-10 uppercase tracking-tighter">Your career updates in real-time</p>
            </div>

            <div className="max-w-3xl mx-auto -mt-10 px-4 sm:px-6 relative z-20">
                <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h2 className="text-slate-800 font-black uppercase tracking-wider text-sm">Recent Alerts</h2>
                        {notifications.some(n => !n.isRead) && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest transition-colors"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                            <div className="p-12 text-center">
                                <p className="text-slate-400 font-bold">No notifications yet.</p>
                            </div>
                        ) : (
                            notifications.map((n) => (
                                <div
                                    key={n._id}
                                    className={`p-6 hover:bg-slate-50 transition-all duration-300 flex items-start gap-4 ${!n.isRead ? 'bg-indigo-50/30' : ''}`}
                                    onClick={() => !n.isRead && markAsRead(n._id)}
                                >
                                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-sm ${n.type === 'NewJob' ? 'bg-emerald-100 text-emerald-600' :
                                            n.type === 'ApplicationStatus' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                        {n.type === 'NewJob' ? '💼' : n.type === 'ApplicationStatus' ? '🔔' : '📢'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className={`text-base font-black truncate ${!n.isRead ? 'text-slate-900' : 'text-slate-600'}`}>
                                                {n.title}
                                            </h4>
                                            <span className="text-[10px] text-slate-400 font-black uppercase whitespace-nowrap ml-2">
                                                {new Date(n.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className={`text-sm leading-relaxed ${!n.isRead ? 'text-slate-700 font-bold' : 'text-slate-500 font-medium'}`}>
                                            {n.message}
                                        </p>
                                        {n.link && (
                                            <Link
                                                to={n.link}
                                                className="inline-block mt-3 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline"
                                            >
                                                View Details →
                                            </Link>
                                        )}
                                    </div>
                                    {!n.isRead && (
                                        <div className="h-2.5 w-2.5 bg-indigo-600 rounded-full shrink-0 mt-2 shadow-[0_0_8px_rgba(79,70,229,0.5)] animate-pulse"></div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
