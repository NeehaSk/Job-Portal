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
            <div className="h-56 bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 w-full flex flex-col justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white"></path>
                    </svg>
                </div>
                <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 relative z-10 text-center">
                    <h1 className="text-white text-4xl font-black uppercase tracking-widest leading-none mb-3">
                        Create New Listing
                    </h1>
                    <p className="text-indigo-200 text-sm font-bold uppercase tracking-widest">List a new opportunity for top talent</p>
                </div>
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
                                        <label className="text-xs font-bold text-slate-700">Job Description</label>
                                        <textarea
                                            name="description"
                                            rows="5"
                                            value={jobData.description}
                                            onChange={handleChange}
                                            placeholder="Clearly outline roles and responsibilities..."
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 focus:outline-none transition-all text-sm text-slate-800 font-medium leading-relaxed placeholder:text-slate-400"
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

                            <div className="pt-6 border-t border-slate-200 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-md shadow-indigo-200 hover:bg-indigo-700 hover:shadow-lg focus:ring-4 focus:ring-indigo-500/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                                >
                                    {loading ? "Publishing listing..." : "Publish Job Vacancy"}
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
    <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-bold">
                {title.startsWith("Basic") ? "1" : title.startsWith("Salary") ? "2" : "3"}
            </span>
            {title}
        </h3>
        <div className="pt-2">
            {children}
        </div>
    </div>
);

const Input = ({ label, ...props }) => (
    <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700">{label}</label>
        <input
            {...props}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 focus:outline-none transition-all text-sm text-slate-800 font-semibold placeholder:text-slate-400 placeholder:font-medium"
        />
    </div>
);

const Select = ({ label, options, ...props }) => (
    <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700">{label}</label>
        <select
            {...props}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 focus:outline-none transition-all text-sm text-slate-800 font-semibold"
        >
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

export default CreateJob;