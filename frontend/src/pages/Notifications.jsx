import React, { useState, useEffect } from "react";
import api from "../api/apiCheck";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Briefcase, FileText, Bell, Mailbox } from "lucide-react";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await api.get("/notifications");
            setNotifications(res.data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            toast.error("Failed to load notifications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put("/notifications/read-all");
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            toast.success("All marked as read");
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case "NewJob": return <Briefcase size={20} />;
            case "ApplicationStatus": return <FileText size={20} />;
            default: return <Bell size={20} />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-40 px-6 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F9FB] pt-40 pb-24 px-6 italic">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Notifications</h1>
                        <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-widest">Stay updated with your career progress</p>
                    </div>
                    {notifications.some(n => !n.isRead) && (
                        <button 
                            onClick={markAllAsRead}
                            className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors"
                        >
                            Mark all as read
                        </button>
                    )}
                </div>

                {notifications.length > 0 ? (
                    <div className="space-y-4">
                        {notifications.map((notif) => (
                            <div 
                                key={notif._id}
                                className={`p-6 rounded-[2rem] border transition-all flex gap-6 items-start ${
                                    notif.isRead 
                                    ? "bg-white border-slate-100 opacity-70" 
                                    : "bg-white border-indigo-100 shadow-xl shadow-indigo-100/20"
                                }`}
                            >
                                <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center text-xl ${
                                    notif.isRead ? "bg-slate-50" : "bg-indigo-50"
                                }`}>
                                    {getIcon(notif.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className={`font-black text-slate-900 ${notif.isRead ? "italic" : ""}`}>{notif.title}</h3>
                                        {!notif.isRead && (
                                            <button 
                                                onClick={() => markAsRead(notif._id)}
                                                className="w-2 h-2 rounded-full bg-indigo-600"
                                                title="Mark as read"
                                            />
                                        )}
                                    </div>
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed">{notif.message}</p>
                                    <div className="flex justify-between items-center mt-4">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            {new Date(notif.createdAt).toLocaleDateString()}
                                        </span>
                                        {notif.link && (
                                            <Link 
                                                to={notif.link}
                                                className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] hover:underline"
                                            >
                                                View Details →
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-100 italic">
                        <div className="text-5xl mb-6 mx-auto flex justify-center text-slate-200">
                            <Mailbox size={64} />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">All caught up</h3>
                        <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-widest">No new notifications at the moment</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
