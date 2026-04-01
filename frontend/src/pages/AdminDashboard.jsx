import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/apiCheck";
import toast from "react-hot-toast";
import {
  UsersIcon,
  BriefcaseIcon,
  TrashIcon,
  ShieldCheckIcon,
  ActivityIcon,
  BuildingIcon,
  ClockIcon,
  AlertCircleIcon
} from "lucide-react";

const KPICard = ({ title, value, icon: Icon, color, bg }) => (
  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
    <div className="flex justify-between items-start mb-4">
      <div className="flex flex-col">
        <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">{title}</h3>
        <div className="text-3xl font-bold text-slate-800 tracking-tight font-outfit">{value}</div>
      </div>
      <div className="p-3 rounded-xl transition-colors shadow-sm" style={{ backgroundColor: bg, color: color }}>
        <Icon size={20} strokeWidth={2.5} />
      </div>
    </div>
    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-indigo-600 bg-indigo-50 w-fit px-2 py-0.5 rounded shadow-sm border border-indigo-100">
      <ActivityIcon size={12} />
      <span>Live tracking</span>
    </div>
    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity rounded-full -mr-10 -mt-10" style={{ backgroundImage: `linear-gradient(to bottom right, ${color}, transparent)` }}></div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState({ recruiters: [], jobseekers: [] });
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("seekers");
  const [searchParams] = useSearchParams();
  const [filteredData, setFilteredData] = useState({ recruiters: [], jobseekers: [], jobs: [] });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, jobsRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/users"),
        api.get("/admin/jobs")
      ]);
      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
      setJobs(jobsRes.data.jobs);
      setFilteredData({
        recruiters: usersRes.data.users.recruiters,
        jobseekers: usersRes.data.users.jobseekers,
        jobs: jobsRes.data.jobs
      });
    } catch (error) {
      toast.error("Failed to fetch admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = searchParams.get("search")?.toLowerCase();
    if (!q) {
      setFilteredData({
        recruiters: users.recruiters,
        jobseekers: users.jobseekers,
        jobs: jobs
      });
    } else {
      setFilteredData({
        recruiters: users.recruiters.filter(u => u.fullName.toLowerCase().includes(q) || u.companyDetails?.name?.toLowerCase().includes(q)),
        jobseekers: users.jobseekers.filter(u => u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)),
        jobs: jobs.filter(j => 
          j.title.toLowerCase().includes(q) || 
          j.companyName.toLowerCase().includes(q) ||
          j.location?.toLowerCase().includes(q) ||
          j.jobType?.toLowerCase().includes(q) ||
          j.workMode?.toLowerCase().includes(q)
        )
      });
    }
  }, [searchParams, users, jobs]);

  const handleToggleStatus = async (recruiterId) => {
    try {
      const res = await api.put("/admin/recruiter/toggle-approval", { recruiterId });
      toast.success(res.data.message);
      fetchData();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteUser = async (userId, role) => {
    if (!window.confirm(`Are you sure you want to delete this ${role}?`)) return;
    try {
      await api.post("/admin/user/delete", { userId, role });
      toast.success("User deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Deletion failed");
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job post?")) return;
    try {
      await api.delete(`/admin/job/delete/${jobId}`);
      toast.success("Job deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Deletion failed");
    }
  };

  if (loading && !stats) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 p-6 lg:padding-x-10 pt-24 font-inter">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-5 lg:p-6 rounded-2xl shadow-sm border border-slate-200 gap-4 animate-fade-in-up">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 mb-1 font-outfit">Admin Console</h1>
            <p className="text-slate-500 text-sm font-medium">Platform oversight and marketplace orchestration dashboard.</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-100 shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">System Active</span>
             </div>
             <button onClick={fetchData} className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-md hover:bg-indigo-700 transition-all flex items-center gap-2">
                <ActivityIcon size={16} /> Sync
             </button>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <KPICard title="Candidates" value={stats?.totalJobSeekers || 0} icon={UsersIcon} color="#4F46E5" bg="#EEF2FF" />
          <KPICard title="Recruiters" value={stats?.totalRecruiters || 0} icon={BuildingIcon} color="#0891B2" bg="#ECFEFF" />
          <KPICard title="Live Jobs" value={stats?.totalJobs || 0} icon={BriefcaseIcon} color="#059669" bg="#ECFDF5" />
          <KPICard title="Pending Auth" value={stats?.pendingVerifications || 0} icon={ShieldCheckIcon} color="#DC2626" bg="#FEF2F2" />
        </div>

        {/* ANALYTICS CHARTS / WIDGETS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
           <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="text-base font-bold text-slate-800 mb-5 font-outfit flex items-center gap-2 border-b border-slate-100 pb-3">
                <ActivityIcon className="text-indigo-500" size={18}/>
                Pipeline Status
              </h3>
              <div className="space-y-4">
                 {stats?.appStatusStats?.length > 0 ? stats.appStatusStats.map((stat, i) => (
                    <div key={i}>
                       <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs font-semibold text-slate-600 capitalize">{stat._id || "Unknown"}</span>
                          <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">{stat.count}</span>
                       </div>
                       <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                          <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${(stat.count / (stats.totalApplications || 1)) * 100}%` }}></div>
                       </div>
                    </div>
                 )) : (
                    <div className="text-center py-6 text-slate-400 flex flex-col items-center">
                       <AlertCircleIcon className="mb-2 opacity-50" size={24}/>
                       <p className="text-xs font-medium">Awaiting application data</p>
                    </div>
                 )}
              </div>
           </div>

           <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="text-base font-bold text-slate-800 mb-5 font-outfit flex items-center gap-2 border-b border-slate-100 pb-3">
                <BriefcaseIcon className="text-emerald-500" size={18}/>
                Top Categories
              </h3>
              <div className="grid grid-cols-1 gap-3">
                 {stats?.jobCategoryStats?.length > 0 ? stats.jobCategoryStats.map((stat, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors rounded-xl border border-slate-200 shadow-sm">
                       <div className="text-xs font-semibold text-slate-700 truncate mr-3">{stat._id || "General"}</div>
                       <div className="text-sm font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border border-slate-100">{stat.count}</div>
                    </div>
                 )) : (
                    <div className="text-center py-6 text-slate-400 flex flex-col items-center h-full justify-center">
                       <AlertCircleIcon className="mb-2 opacity-50" size={24}/>
                       <p className="text-xs font-medium">No job metrics active</p>
                    </div>
                 )}
              </div>
           </div>

           <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
              <h3 className="text-base font-bold text-slate-800 mb-5 font-outfit flex items-center gap-2 border-b border-slate-100 pb-3">
                 <ClockIcon className="text-rose-500" size={18}/>
                 Recent Activity
              </h3>
              <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                 {stats?.recentApplications?.length > 0 ? stats.recentApplications.map((app, i) => (
                    <div key={i} className="flex items-start justify-between group border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shadow-sm border border-indigo-200">
                             {app.applicant?.fullName?.charAt(0) || "U"}
                          </div>
                          <div>
                             <div className="text-xs font-bold text-slate-800">{app.applicant?.fullName || "Deleted User"}</div>
                             <div className="text-[10px] text-slate-500 font-medium">Applied: <span className="text-indigo-600 font-semibold">{app.job?.title || "Deleted Job"}</span></div>
                          </div>
                       </div>
                       <div className="text-[10px] font-semibold text-slate-400 mt-1">
                          {new Date(app.appliedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                       </div>
                    </div>
                 )) : (
                    <div className="text-center py-6 flex flex-col items-center justify-center h-full text-slate-400">
                       <AlertCircleIcon className="mb-2 opacity-50" size={24}/>
                       <p className="text-xs font-medium">No system activity logged</p>
                    </div>
                 )}
              </div>
           </div>
        </div>

        {/* MANAGEMENT TABLES */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <div className="bg-slate-50 border-b border-slate-200 p-4 lg:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-bold text-slate-800 font-outfit">Directory Controls</h2>
            <div className="flex bg-white p-1 rounded-lg shadow-sm border border-slate-200 w-full sm:w-auto overflow-x-auto">
              {["seekers", "recruiters", "jobs"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-md font-semibold text-xs transition-all duration-300 whitespace-nowrap ${activeTab === tab ? "bg-indigo-600 text-white shadow" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"}`}
                >
                  {tab === "seekers" ? "Candidates" : tab === "recruiters" ? "Recruiters" : "Job Postings"}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                  <th className="px-5 py-3">Identity / Profile</th>
                  <th className="px-5 py-3">{activeTab === "recruiters" ? "Security Clearance" : activeTab === "jobs" ? "Organization" : "Onboarding Date"}</th>
                  <th className="px-5 py-3 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 bg-white">
                {activeTab === "seekers" && filteredData.jobseekers.length > 0 && filteredData.jobseekers.map(u => (
                  <tr key={u._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3 whitespace-nowrap">
                       <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm mr-3 border border-blue-100">
                             {u.fullName.charAt(0)}
                          </div>
                          <div>
                             <div className="text-sm font-bold text-slate-800">{u.fullName}</div>
                             <div className="text-xs text-slate-500">{u.email}</div>
                          </div>
                       </div>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-xs text-slate-600 font-medium">
                       {new Date(u.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-right">
                      <button onClick={() => handleDeleteUser(u._id, 'jobseeker')} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-md transition-colors inline-flex items-center justify-center border border-transparent hover:border-rose-100" title="Delete Candidate">
                         <TrashIcon size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                
                {activeTab === "recruiters" && filteredData.recruiters.length > 0 && filteredData.recruiters.map(u => (
                  <tr key={u._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3 whitespace-nowrap">
                       <div className="flex items-center">
                          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm mr-3 border border-purple-100">
                             {u.companyDetails?.name?.charAt(0) || u.fullName.charAt(0)}
                          </div>
                          <div>
                             <div className="text-sm font-bold text-slate-800">{u.fullName}</div>
                             <div className="text-xs text-slate-500">{u.companyDetails?.name || "Independent"}</div>
                          </div>
                       </div>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                       <span className={`px-2.5 py-0.5 inline-flex text-[10px] leading-5 font-bold uppercase tracking-wider rounded border shadow-sm ${u.isApproved ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                          {u.isApproved ? "Verified Agent" : "Pending Auth"}
                       </span>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-right flex items-center justify-end gap-2">
                        <button onClick={() => handleToggleStatus(u._id)} className={`px-3 py-1 rounded text-[10px] uppercase tracking-wider font-bold transition-colors shadow-sm border ${u.isApproved ? 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100' : 'bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700'}`}>
                          {u.isApproved ? "Revoke" : "Approve"}
                        </button>
                        <button onClick={() => handleDeleteUser(u._id, 'recruiter')} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-md transition-colors inline-flex items-center justify-center border border-transparent hover:border-rose-100" title="Delete Recruiter">
                           <TrashIcon size={16} />
                        </button>
                    </td>
                  </tr>
                ))}

                {activeTab === "jobs" && filteredData.jobs.length > 0 && filteredData.jobs.map(j => (
                  <tr key={j._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3 whitespace-nowrap">
                       <div>
                          <div className="text-sm font-bold text-slate-800">{j.title}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5 font-medium uppercase tracking-wider">{j.location || "Remote"} • {j.jobType || "Full-Time"}</div>
                       </div>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                        <div className="text-sm font-semibold text-slate-700">{j.companyName}</div>
                        <div className="text-xs text-slate-500">Agent: {j.recruiter?.fullName || "N/A"}</div>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-right">
                       <button onClick={() => handleDeleteJob(j._id)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-md transition-colors inline-flex items-center justify-center border border-transparent hover:border-rose-100" title="Remove Opportunity">
                          <TrashIcon size={16} />
                       </button>
                    </td>
                  </tr>
                ))}

                {/* EMPTY STATES FOR TABLES */}
                {activeTab === "seekers" && filteredData.jobseekers.length === 0 && (
                   <tr><td colSpan="3" className="px-5 py-12 text-center text-slate-500 text-sm bg-slate-50/50">No candidates found matching the criteria.</td></tr>
                )}
                {activeTab === "recruiters" && filteredData.recruiters.length === 0 && (
                   <tr><td colSpan="3" className="px-5 py-12 text-center text-slate-500 text-sm bg-slate-50/50">No recruiters found matching the criteria.</td></tr>
                )}
                {activeTab === "jobs" && filteredData.jobs.length === 0 && (
                   <tr><td colSpan="3" className="px-5 py-12 text-center text-slate-500 text-sm bg-slate-50/50">No job postings found matching the criteria.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
