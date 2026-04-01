import React, { useEffect, useState } from "react";
import api from "../api/apiCheck";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, Lightbulb } from "lucide-react";
import { JobCard, FilterSidebar } from "../components/ProfileComponents";

export default function Jobs() {
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchData();
  }, []);

  // Filter by URL search param whenever jobs load or param changes
  useEffect(() => {
    const q = searchParams.get("search")?.toLowerCase();
    if (!q) {
      setFilteredJobs(allJobs);
      setSelectedCategory("All");
    } else {
      setFilteredJobs(
        allJobs.filter(job =>
          job.title?.toLowerCase().includes(q) ||
          job.companyName?.toLowerCase().includes(q) ||
          job.location?.toLowerCase().includes(q) ||
          job.jobType?.toLowerCase().includes(q)
        )
      );
    }
  }, [searchParams, allJobs]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      let role = "";
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          role = payload.role;
        } catch (e) {
          console.error("Token parse error", e);
        }
      }

      // Fetch jobs (publicly accessible)
      const jobsRes = await api.get("/jobs");
      const jobsData = jobsRes.data.jobs || [];
      setAllJobs(jobsData);
      setFilteredJobs(jobsData);

      // Only fetch applications if logged in as jobseeker
      if (role === "jobseeker") {
        try {
          const appsRes = await api.get("/jobs/my-applications");
          const appliedIds = new Set(
            appsRes.data.applications?.map(app => (app.job?._id || app.job)) || []
          );
          setAppliedJobIds(appliedIds);
        } catch (err) {
          console.error("Failed to fetch applications", err);
        }
      }
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
      toast.success("Applied Successfully");
      setAppliedJobIds(prev => new Set([...prev, jobId]));
    } catch (error) {
      toast.error(error.response?.data?.message || "Error applying");
    }
  };

  const categories = ["All", "Full-time", "Part-time", "Internship", "Remote"];

  if (loading) return (
    <div className="profile-page min-h-screen flex items-center justify-center bg-[#FAFAFB]">
      <div className="font-bold text-blue-600 animate-pulse text-lg tracking-tighter">Syncing Opportunities...</div>
    </div>
  );

  return (
    <div className="jobs-page min-h-screen bg-[#F8F9FB] pb-24 selection:bg-indigo-100">
      {/* PROFESSIONAL ELEGANT HEADER */}
      <div className="pt-28 pb-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-semibold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
            Global Talent Network
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Explore Your <span className="text-indigo-600">Future</span>
          </h1>
          <p className="text-slate-500 text-sm md:text-base font-medium max-w-lg mx-auto leading-relaxed">
            Discover career-defining milestones meticulously curated for high-impact professionals.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto -mt-12 px-4 sm:px-6 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* LEFT SIDEBAR - FILTERS */}
          <div className="lg:col-span-1 lg:sticky lg:top-28 self-start space-y-4">
            <FilterSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onSelect={handleFilter}
            />

            <div className="bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-900/20 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-indigo-400/30"></div>
               <div className="relative z-10">
                 <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-100 mb-6 backdrop-blur-md border border-white/5">
                   <Lightbulb size={24} strokeWidth={2} />
                 </div>
                 <h4 className="text-xs font-black mb-3 tracking-widest text-white uppercase">Branding Tip</h4>
                 <p className="text-indigo-100/90 text-[11px] font-semibold leading-relaxed mb-8 pr-2">
                   Premium profiles are prioritized in our recruiter intelligence engine.
                 </p>
                 <button 
                   onClick={() => navigate('/jobseeker/profile')}
                   className="w-full py-3.5 bg-white text-indigo-950 rounded-[14px] text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-lg shadow-white/5 active:scale-[0.98]"
                 >
                   Optimize Now
                 </button>
               </div>
            </div>
          </div>

          {/* MAIN CONTENT - JOB LIST */}
          <div className="lg:col-span-3 space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-6 border-b border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Recommended <span className="text-indigo-600">Roles</span>
              </h2>
              <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 text-sm rounded-md font-semibold">
                {filteredJobs.length} Positions Active
              </span>
            </div>

            {filteredJobs.length === 0 ? (
              <div className="bg-white rounded-[40px] border border-slate-100 p-24 text-center shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 text-slate-200">
                    <Search size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2 tracking-tight">No Matching Roles</h3>
                <p className="text-slate-400 font-medium text-sm max-w-xs mx-auto">Try broadening your filters or checking back as new opportunities are posted daily.</p>
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