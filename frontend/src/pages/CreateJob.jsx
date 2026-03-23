import React, { useState } from "react";
import api from "../api/apiCheck";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const CreateJob = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    const [jobData, setJobData] = useState({
        title: "",
        description: "",
        requirements: "",
        skillsRequired: "",
        location: "",
        category: "",
        workMode: "On-site",
        experienceLevel: "Fresher",
        jobType: "Full-time",
        companyName: "",
        salaryMin: "",
        salaryMax: "",
        salaryCurrency: "INR",
        salaryPeriod: "Yearly",
        applicationDeadline: "",
    });

    const handleChange = (e) => {
        setJobData({ ...jobData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                title: jobData.title,
                description: jobData.description,
                companyName: jobData.companyName,
                location: jobData.location,
                category: jobData.category,
                workMode: jobData.workMode,
                jobType: jobData.jobType,
                experienceLevel: jobData.experienceLevel,
                requirements: jobData.requirements.split(",").map(r => r.trim()).filter(Boolean),
                skillsRequired: jobData.skillsRequired.split(",").map(s => s.trim()).filter(Boolean),
                salary: {
                    min: Number(jobData.salaryMin),
                    max: Number(jobData.salaryMax),
                    currency: jobData.salaryCurrency,
                    period: jobData.salaryPeriod,
                },
                applicationDeadline: jobData.applicationDeadline
            };

            await api.post("/jobs/create", payload);
            toast.success("Job Posted Successfully! 🚀");
            navigate("/recruiter/jobs");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to post job");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-20">
            {/* HEADER BANNER */}
            <div className="h-64 bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 w-full flex flex-col justify-center items-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 100 C 20 0 50 0 100 100 Z" fill="rgba(255,255,255,0.05)"></path>
                    </svg>
                </div>
                <h1 className="text-3xl font-black text-white tracking-widest uppercase mb-2 relative z-10">Create Job</h1>
                <p className="text-indigo-200 text-sm font-bold relative z-10">List a new opportunity for top talent</p>
            </div>

            <div className="max-w-4xl mx-auto -mt-10 px-4 sm:px-6 relative z-20">
                <div className="bg-white rounded-[32px] shadow-2xl shadow-indigo-100/50 border border-slate-100 overflow-hidden">
                    <div className="p-8 sm:p-12">
                        <form onSubmit={handleSubmit} className="space-y-10">

                            <Section title="Basic Information">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <Input
                                        label="Job Title"
                                        name="title"
                                        placeholder="e.g. Senior Product Designer"
                                        value={jobData.title}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Input
                                        label="Company Name"
                                        name="companyName"
                                        placeholder="Organization name"
                                        value={jobData.companyName}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Input
                                        label="Category"
                                        name="category"
                                        placeholder="e.g. Design, Engineering"
                                        value={jobData.category}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Input
                                        label="Location"
                                        name="location"
                                        placeholder="City, Country or Remote"
                                        value={jobData.location}
                                        onChange={handleChange}
                                        required
                                    />

                                    <Select
                                        label="Job Type"
                                        name="jobType"
                                        value={jobData.jobType}
                                        onChange={handleChange}
                                        options={["Full-time", "Part-time", "Internship", "Contract"]}
                                    />

                                    <Select
                                        label="Work Mode"
                                        name="workMode"
                                        value={jobData.workMode}
                                        onChange={handleChange}
                                        options={["On-site", "Remote", "Hybrid"]}
                                    />

                                    <Select
                                        label="Experience Level"
                                        name="experienceLevel"
                                        value={jobData.experienceLevel}
                                        onChange={handleChange}
                                        options={["Fresher", "1-3 years", "3-5 years", "5+ years"]}
                                    />
                                </div>
                            </Section>

                            <Section title="Salary & Compensation">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <Input type="number" label="Min Salary" name="salaryMin" value={jobData.salaryMin} onChange={handleChange} required />
                                    <Input type="number" label="Max Salary" name="salaryMax" value={jobData.salaryMax} onChange={handleChange} required />
                                    <Select label="Currency" name="salaryCurrency" value={jobData.salaryCurrency} onChange={handleChange} options={["INR", "USD", "EUR", "GBP"]} />
                                    <Select label="Period" name="salaryPeriod" value={jobData.salaryPeriod} onChange={handleChange} options={["Yearly", "Monthly"]} />
                                </div>
                            </Section>

                            <Section title="Requirements & Skills">
                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Job Description</label>
                                        <textarea
                                            name="description"
                                            rows="5"
                                            value={jobData.description}
                                            onChange={handleChange}
                                            placeholder="Clearly outline roles and responsibilities..."
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all text-slate-700 font-medium leading-relaxed shadow-inner"
                                            required
                                        ></textarea>
                                    </div>

                                    <Input
                                        label="Key Requirements (comma separated)"
                                        name="requirements"
                                        placeholder="e.g. 5+ years experience, Strong communication..."
                                        value={jobData.requirements}
                                        onChange={handleChange}
                                    />

                                    <Input
                                        label="Skills Required (comma separated)"
                                        name="skillsRequired"
                                        placeholder="e.g. React, TypeScript, GraphQL..."
                                        value={jobData.skillsRequired}
                                        onChange={handleChange}
                                    />
                                </div>
                            </Section>

                            <div className="pt-8 border-t border-slate-50">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                                >
                                    {loading ? "Publishing listing..." : "🚀 Post Job Vacancy"}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Section = ({ title, children }) => (
    <div className="space-y-8">
        <h3 className="text-xl font-black text-slate-800 flex items-center gap-4 uppercase tracking-tight">
            <span className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg font-black shadow-inner">
                {title.startsWith("Basic") ? "01" : title.startsWith("Salary") ? "02" : "03"}
            </span>
            {title}
        </h3>
        <div className="pl-2 border-l-2 border-slate-50 ml-6">
            {children}
        </div>
    </div>
);

const Input = ({ label, ...props }) => (
    <div className="space-y-2">
        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
        <input
            {...props}
            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all text-slate-700 font-bold placeholder:text-slate-300 shadow-inner"
        />
    </div>
);

const Select = ({ label, options, ...props }) => (
    <div className="space-y-2">
        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
        <select
            {...props}
            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all text-slate-700 font-bold shadow-inner"
        >
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

export default CreateJob;