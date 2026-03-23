import React, { useEffect, useState } from "react";
import api from "../api/apiCheck";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { JobCard, StatCard } from "../components/ProfileComponents";

const RecruiterJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get("/jobs/my-jobs");
      setJobs(res.data || []);
    } catch (error) {
      toast.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job posting? This action cannot be undone and all associated applications will be lost.")) {
      return;
    }

    try {
      await api.delete(`/jobs/delete/${jobId}`);
      toast.success("Job posting deleted successfully");
      fetchJobs(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete job");
    }
  };

  const totalApplicants = jobs.reduce((acc, job) => acc + (job.applicantsCount || 0), 0);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* CORPORATE HEADER */}
      <div className="h-64 bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 w-full relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="rgba(255,255,255,0.05)"></path>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto h-full flex flex-col justify-center items-center px-4 relative z-10">
          <h1 className="text-3xl font-black text-white tracking-widest uppercase mb-2">Hiring Dashboard</h1>
          <p className="text-indigo-200 text-sm font-bold">Manage your listings and applications</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto -mt-10 px-4 sm:px-6 relative z-20">

        {/* STATS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard label="Total Job Postings" value={jobs.length} icon="📢" color="indigo" />
          <StatCard label="Total Applications Received" value={totalApplicants} icon="👥" color="emerald" />
          <StatCard label="Avg. Response Rate" value="92%" icon="📉" color="orange" />
        </div>

        <div className="flex items-center justify-between mb-8 px-2">
          <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">
            Active Managed Roles <span className="text-indigo-600 ml-2">({jobs.length})</span>
          </h2>
          <button
            onClick={() => navigate("/recruiter/create-job")}
            className="bg-slate-800 text-white px-6 py-2.5 rounded-xl text-xs font-black shadow-lg hover:bg-slate-900 transition flex items-center gap-2 uppercase tracking-widest"
          >
            + Create New Job
          </button>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-20 text-center">
            <div className="text-6xl mb-6 grayscale opacity-20">📂</div>
            <h3 className="text-xl font-extrabold text-slate-800 mb-2 tracking-tight uppercase">No jobs found in your dashboard</h3>
            <p className="text-slate-400 font-bold text-sm mb-10">Start your recruitment journey by posting your first role today.</p>
            <button
              onClick={() => navigate("/recruiter/create-job")}
              className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-indigo-700 transition shadow-2xl shadow-indigo-100 uppercase tracking-widest active:scale-95"
            >
              Post Your First Job Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
            {jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                isRecruiter={true}
                onManage={() => navigate(`/recruiter/job/${job._id}/applicants`)}
                onDelete={handleDeleteJob}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterJobs;