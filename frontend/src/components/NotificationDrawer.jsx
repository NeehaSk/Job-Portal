import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/apiCheck";
import toast from "react-hot-toast";

const NotificationDrawer = ({ isOpen, onClose, setUnreadCount }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
      const unread = res.data.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id, link) => {
    try {
      await api.put(`/notifications/${id}/read`);
      // Update local state
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
      
      // Update unread count in parent
      const newUnread = notifications.filter(n => n._id !== id ? !n.isRead : false).length;
      setUnreadCount(newUnread);

      if (link) {
        onClose();
        navigate(link);
      }
    } catch (error) {
      console.error("Error marking notification as read", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put("/notifications/read-all");
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success("All caught up!");
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return "just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* OVERLAY */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* DRAWER */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-sm bg-white z-[70] shadow-2xl transition-transform duration-500 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* HEADER */}
          <div className="px-6 py-6 border-b border-slate-50 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Notifications</h2>
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">Stay updated in real-time</p>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-all hover:rotate-90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* ACTIONS */}
          {notifications.length > 0 && (
            <div className="px-6 py-3 bg-slate-50/50 flex justify-end">
              <button 
                onClick={markAllAsRead}
                className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800"
              >
                Mark all as read
              </button>
            </div>
          )}

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 custom-scrollbar">
            {loading && notifications.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-300">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest">Loading Alerts...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-10">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-3xl mb-4 grayscale opacity-50">
                  🔔
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">No notifications yet</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">We'll notify you when something important happens in your career journey.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n._id}
                  onClick={() => markAsRead(n._id, n.link)}
                  className={`p-5 rounded-[24px] border transition-all cursor-pointer group relative overflow-hidden ${
                    !n.isRead 
                      ? 'bg-white border-indigo-100 shadow-[0_10px_30px_rgba(79,70,229,0.08)]' 
                      : 'bg-slate-50 border-transparent opacity-70 grayscale-[0.5]'
                  }`}
                >
                  <div className="flex gap-4 items-start">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0 transition-transform group-hover:scale-110 ${
                      n.type === 'NewJob' ? 'bg-emerald-50 text-emerald-600' :
                      n.type === 'ApplicationStatus' ? 'bg-indigo-50 text-indigo-600' :
                      'bg-amber-50 text-amber-600'
                    }`}>
                      {n.type === 'NewJob' ? '💼' : n.type === 'ApplicationStatus' ? '🚀' : '✨'}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-xs font-black text-slate-800 leading-snug">{n.title}</h4>
                        <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap ml-2">{formatTime(n.createdAt)}</span>
                      </div>
                      <p className="text-[11px] font-medium text-slate-500 leading-relaxed line-clamp-2">{n.message}</p>
                    </div>
                  </div>
                  {!n.isRead && (
                    <div className="absolute top-4 right-4 w-2 h-2 bg-indigo-600 rounded-full ring-4 ring-indigo-50" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* FOOTER */}
          <div className="p-6 border-t border-slate-50">
            <Link 
              to="/notifications" 
              onClick={onClose}
              className="w-full flex items-center justify-center h-14 bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-black transition-all shadow-xl shadow-slate-200"
            >
              See All Activity
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationDrawer;
