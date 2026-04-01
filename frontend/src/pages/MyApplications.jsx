import React, { useEffect, useState } from "react";
import api from "../api/apiCheck";
import toast from "react-hot-toast";
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get("/jobs/my-applications");
      setApplications(res.data.applications || []);
    } catch (error) {
      const msg = error?.response?.data?.message || error.message || "Failed to fetch applications";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-indigo-600 font-medium">
        Loading your applications...
      </div>
    );
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Interview":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Selected":
        return "bg-green-100 text-green-700 border-green-200";
      case "Rejected":
        return "bg-rose-100 text-rose-700 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* HEADER */}
      <div className="bg-white border-b border-slate-100 pt-24 pb-10 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-900">My Applications</h1>
          <p className="text-slate-500 text-sm mt-1">Track your journey across all applications</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-8 px-4 sm:px-6">
      {error ? (
          <div className="bg-white rounded-2xl shadow-sm border border-rose-200 p-12 text-center">
            <p className="text-rose-500 text-base font-semibold">⚠️ {error}</p>
            <p className="text-slate-400 text-sm mt-2">Please make sure you are logged in as a <strong>Job Seeker</strong>.</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <p className="text-slate-500 text-lg font-medium">You haven't applied to any jobs yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app._id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center justify-between hover:border-indigo-200 transition-colors duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center text-xl shadow-inner group-hover:bg-indigo-100 transition-colors">
                    🏢
                  </div>
                <div>
                    <h3 className="text-base font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">{app.job?.title}</h3>
                    <p className="text-sm text-indigo-600 font-medium mb-1">{app.job?.companyName}</p>
                    {app.nextStep && (
                      <p className="text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 inline-block">
                        Next: {app.nextStep}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/my-applications/${app._id}/tracker`}
                      className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all active:scale-95"
                      title="Track Application"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </Link>

                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${getStatusStyle(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                    Applied: {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
