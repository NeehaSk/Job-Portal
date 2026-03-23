import React, { useEffect, useState } from "react";
import api from "../api/apiCheck";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { JobCard, FilterSidebar } from "../components/ProfileComponents";

export default function Jobs() {
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        api.get("/jobs"),
        api.get("/jobs/my-applications")
      ]);

      const jobsData = jobsRes.data.jobs || [];
      setAllJobs(jobsData);
      setFilteredJobs(jobsData);

      const appliedIds = new Set(
        appsRes.data.applications?.map(app => app.job?._id || app.job) || []
      );
      setAppliedJobIds(appliedIds);
    } catch (error) {
      toast.error("Failed to fetch opportunities");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (category) => {
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredJobs(allJobs);
    } else {
      setFilteredJobs(allJobs.filter(job => job.title?.toLowerCase().includes(category.toLowerCase()) || job.jobType?.toLowerCase().includes(category.toLowerCase())));
    }
  };

  const handleApply = async (jobId) => {
    try {
      await api.post(`/jobs/${jobId}/apply`);
      toast.success("Applied Successfully ✅");
      setAppliedJobIds(prev => new Set([...prev, jobId]));
    } catch (error) {
      toast.error(error.response?.data?.message || "Error applying ❌");
    }
  };

  const categories = ["All", "Full-time", "Part-time", "Internship", "Remote"];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* PROFESSIONAL GRADIENT HEADER */}
      <div className="h-64 bg-gradient-to-br from-slate-950 via-blue-900 to-blue-800 w-full relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="rgba(255,255,255,0.05)"></path>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto h-full flex flex-col justify-center items-center px-4 relative z-10">
          <h1 className="text-3xl font-black text-white tracking-widest uppercase mb-2">Opportunities</h1>
          <p className="text-blue-200 text-sm font-bold">Discover your next career milestone</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto -mt-10 px-4 sm:px-6 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* LEFT SIDEBAR - FILTERS */}
          <div className="lg:col-span-1 lg:sticky lg:top-24 h-max">
            <FilterSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onSelect={handleFilter}
            />

            <div className="mt-8 bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl">⭐</div>
              <h4 className="font-bold text-lg mb-2">Build your brand</h4>
              <p className="text-blue-100 text-xs leading-relaxed font-bold">
                Complete your profile to increase your chances of being noticed by top recruiters.
              </p>
            </div>
          </div>

          {/* MAIN CONTENT - JOB LIST */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">
                Recommended for you <span className="text-blue-600 ml-2">({filteredJobs.length})</span>
              </h2>
            </div>

            {filteredJobs.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-100 p-20 text-center shadow-sm">
                <div className="text-6xl mb-6 grayscale opacity-20 text-center">🔎</div>
                <h3 className="text-xl font-bold text-slate-800 mb-2 tracking-tight uppercase">No matching roles</h3>
                <p className="text-slate-400 font-bold text-sm">Try broadening your filters or checking back later.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                {filteredJobs.map(job => (
                  <JobCard
                    key={job._id}
                    job={job}
                    isApplied={appliedJobIds.has(job._id)}
                    onApply={() => handleApply(job._id)}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}