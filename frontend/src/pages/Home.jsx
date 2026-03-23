// // import { useNavigate } from "react-router-dom";

// // function Home() {

// //   const navigate = useNavigate();

// //   return (
// //     <div className="min-h-screen bg-slate-50">

// //       {/* HERO SECTION */}
// //       <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white py-24 relative overflow-hidden">
// //         <div className="absolute inset-0 opacity-10">
// //           <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
// //             <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white"></path>
// //           </svg>
// //         </div>

// //         <div className="max-w-7xl mx-auto px-6 text-center">

// //           <h1 className="text-5xl font-extrabold leading-tight mb-6">
// //             Find Your Dream Job <br />
// //             <span className="text-indigo-200">or Hire Top Talent</span>
// //           </h1>

// //           <p className="text-lg text-indigo-100 max-w-2xl mx-auto mb-10">
// //             JobPortal connects job seekers with companies looking for the
// //             best talent. Discover opportunities or post jobs easily.
// //           </p>

// //           <div className="flex justify-center gap-4">

// //             <button
// //               onClick={() => navigate("/jobs")}
// //               className="bg-white text-indigo-700 px-6 py-3 rounded-xl font-semibold shadow hover:bg-indigo-50"
// //             >
// //               Browse Jobs
// //             </button>
// // z
// //             <button
// //               onClick={() => navigate("/signup")}
// //               className="bg-indigo-500 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-600"
// //             >
// //               Get Started
// //             </button>

// //           </div>

// //         </div>

// //       </section>

// //       {/* FEATURES SECTION */}
// //       <section className="py-20">

// //         <div className="max-w-7xl mx-auto px-6">

// //           <h2 className="text-3xl font-bold text-center text-slate-800 mb-14">
// //             Why Choose JobPortal?
// //           </h2>

// //           <div className="grid md:grid-cols-3 gap-10">

// //             <div className="bg-white p-8 rounded-2xl shadow-sm border">
// //               <div className="text-4xl mb-4">🔎</div>
// //               <h3 className="font-bold text-lg mb-2">
// //                 Find the Right Job
// //               </h3>
// //               <p className="text-slate-500">
// //                 Explore thousands of opportunities across industries and
// //                 apply with a single click.
// //               </p>
// //             </div>

// //             <div className="bg-white p-8 rounded-2xl shadow-sm border">
// //               <div className="text-4xl mb-4">🏢</div>
// //               <h3 className="font-bold text-lg mb-2">
// //                 Hire Top Talent
// //               </h3>
// //               <p className="text-slate-500">
// //                 Recruiters can post jobs and discover qualified candidates
// //                 quickly and easily.
// //               </p>
// //             </div>

// //             <div className="bg-white p-8 rounded-2xl shadow-sm border">
// //               <div className="text-4xl mb-4">⚡</div>
// //               <h3 className="font-bold text-lg mb-2">
// //                 Faster Hiring
// //               </h3>
// //               <p className="text-slate-500">
// //                 Our platform helps companies connect with skilled job seekers
// //                 efficiently.
// //               </p>
// //             </div>

// //           </div>

// //         </div>

// //       </section>

// //       {/* CTA SECTION */}
// //       <section className="bg-gradient-to-r from-indigo-900 to-indigo-800 py-16 text-center text-white">

// //         <h2 className="text-3xl font-bold mb-4">
// //           Ready to Start Your Journey?
// //         </h2>

// //         <p className="text-indigo-200 mb-6">
// //           Create your account and discover new opportunities today.
// //         </p>

// //         <button
// //           onClick={() => navigate("/signup")}
// //           className="bg-white text-indigo-700 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-100"
// //         >
// //           Create Account
// //         </button>

// //       </section>

// //     </div>
// //   );
// // }

// // export default Home;

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// // ─── SVG Icons ────────────────────────────────────────────────────────────────
// const SearchIcon = () => (
//   <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//     <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
//   </svg>
// );
// const MapPinIcon = () => (
//   <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//     <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
//   </svg>
// );
// const ChevronLeft = () => (
//   <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
//     <path d="m15 18-6-6 6-6" />
//   </svg>
// );
// const ChevronRight = () => (
//   <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
//     <path d="m9 18 6-6-6-6" />
//   </svg>
// );
// const ArrowRight = () => (
//   <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//     <path d="M5 12h14M12 5l7 7-7 7" />
//   </svg>
// );
// const BriefcaseIcon = () => (
//   <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
//     <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /><path d="M2 12h20" />
//   </svg>
// );
// const UsersIcon = () => (
//   <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
//     <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
//     <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
//   </svg>
// );
// const ZapIcon = () => (
//   <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
//     <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
//   </svg>
// );
// const ShieldIcon = () => (
//   <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
//     <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
//   </svg>
// );

// // ─── Data ─────────────────────────────────────────────────────────────────────
// const STATS = [
//   { value: "50K+", label: "Jobs Posted" },
//   { value: "120K+", label: "Job Seekers" },
//   { value: "8K+", label: "Companies" },
//   { value: "95%", label: "Placement Rate" },
// ];

// const COMPANIES = [
//   {
//     name: "Google",
//     industry: "Technology",
//     location: "Mountain View, CA",
//     openings: 320,
//     logo: "G",
//     logoFrom: "#4285F4",
//     logoTo: "#34A853",
//     tag: "Top Employer",
//     tagClass: "bg-blue-100 text-blue-700",
//     rating: "4.8",
//     founded: "1998",
//   },
//   {
//     name: "Microsoft",
//     industry: "Software & Cloud",
//     location: "Redmond, WA",
//     openings: 215,
//     logo: "M",
//     logoFrom: "#0078D4",
//     logoTo: "#00B4D8",
//     tag: "Hiring Now",
//     tagClass: "bg-green-100 text-green-700",
//     rating: "4.7",
//     founded: "1975",
//   },
//   {
//     name: "Amazon",
//     industry: "E-Commerce & Cloud",
//     location: "Seattle, WA",
//     openings: 480,
//     logo: "A",
//     logoFrom: "#FF9900",
//     logoTo: "#FFD166",
//     tag: "Fastest Growing",
//     tagClass: "bg-orange-100 text-orange-700",
//     rating: "4.5",
//     founded: "1994",
//   },
//   {
//     name: "Meta",
//     industry: "Social Media & AI",
//     location: "Menlo Park, CA",
//     openings: 175,
//     logo: "M",
//     logoFrom: "#0668E1",
//     logoTo: "#6C63FF",
//     tag: "Top Employer",
//     tagClass: "bg-blue-100 text-blue-700",
//     rating: "4.6",
//     founded: "2004",
//   },
//   {
//     name: "Apple",
//     industry: "Consumer Tech",
//     location: "Cupertino, CA",
//     openings: 290,
//     logo: "🍎",
//     logoFrom: "#555",
//     logoTo: "#999",
//     tag: "Premium Brand",
//     tagClass: "bg-slate-100 text-slate-700",
//     rating: "4.9",
//     founded: "1976",
//   },
//   {
//     name: "Netflix",
//     industry: "Streaming & Media",
//     location: "Los Gatos, CA",
//     openings: 130,
//     logo: "N",
//     logoFrom: "#E50914",
//     logoTo: "#B20710",
//     tag: "Hiring Now",
//     tagClass: "bg-red-100 text-red-700",
//     rating: "4.6",
//     founded: "1997",
//   },
//   {
//     name: "Salesforce",
//     industry: "CRM & SaaS",
//     location: "San Francisco, CA",
//     openings: 195,
//     logo: "S",
//     logoFrom: "#00A1E0",
//     logoTo: "#0070D2",
//     tag: "Best Culture",
//     tagClass: "bg-sky-100 text-sky-700",
//     rating: "4.7",
//     founded: "1999",
//   },
// ];

// const FEATURES = [
//   { icon: <BriefcaseIcon />, title: "Smart Job Matching", desc: "Our AI-powered engine matches your skills to the most relevant openings — saving you hours of searching.", colorClass: "text-indigo-600", bgClass: "bg-indigo-50" },
//   { icon: <UsersIcon />, title: "Hire Top Talent", desc: "Recruiters can post jobs and instantly surface qualified candidates from our growing talent pool.", colorClass: "text-sky-600", bgClass: "bg-sky-50" },
//   { icon: <ZapIcon />, title: "One-Click Apply", desc: "Apply to multiple jobs with your saved profile. No repetitive forms — your first impression, perfected.", colorClass: "text-amber-600", bgClass: "bg-amber-50" },
//   { icon: <ShieldIcon />, title: "Verified Employers", desc: "Every company on JobPortal is vetted. You only see real opportunities from legitimate, trusted employers.", colorClass: "text-emerald-600", bgClass: "bg-emerald-50" },
// ];

// const HOW_IT_WORKS = [
//   { step: "01", title: "Create Your Profile", desc: "Sign up and build a standout profile in minutes — upload your resume or fill in your details." },
//   { step: "02", title: "Browse & Apply", desc: "Explore thousands of listings filtered by role, location, salary, and more. Apply with one click." },
//   { step: "03", title: "Get Hired", desc: "Connect directly with employers, schedule interviews, and land your next role — fast." },
// ];

// const CATEGORIES = [
//   { label: "Engineering", count: "12,400 jobs", emoji: "⚙️" },
//   { label: "Design", count: "4,200 jobs", emoji: "🎨" },
//   { label: "Marketing", count: "6,800 jobs", emoji: "📣" },
//   { label: "Finance", count: "5,100 jobs", emoji: "📊" },
//   { label: "Healthcare", count: "9,300 jobs", emoji: "🏥" },
//   { label: "Education", count: "3,700 jobs", emoji: "📚" },
// ];

// // ─── Company Carousel ─────────────────────────────────────────────────────────
// function CompanyCarousel({ navigate }) {
//   const [current, setCurrent] = useState(0);
//   const VISIBLE = 3;
//   const maxIndex = COMPANIES.length - VISIBLE;

//   const prev = () => setCurrent((c) => Math.max(0, c - 1));
//   const next = () => setCurrent((c) => Math.min(maxIndex, c + 1));

//   return (
//     <section className="py-16 md:py-20 bg-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6">

//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4">
//           <div>
//             <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest mb-2">Top Companies</p>
//             <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
//               Featured Employers Hiring Now
//             </h2>
//             <p className="text-slate-500 text-sm mt-2 max-w-md">
//               Explore opportunities at world-class companies actively looking for talent.
//             </p>
//           </div>

//           {/* Arrow controls */}
//           <div className="flex items-center gap-3 shrink-0">
//             <button
//               onClick={prev}
//               disabled={current === 0}
//               className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
//             >
//               <ChevronLeft />
//             </button>
//             <span className="text-sm text-slate-400 font-medium tabular-nums">
//               {current + 1} / {maxIndex + 1}
//             </span>
//             <button
//               onClick={next}
//               disabled={current >= maxIndex}
//               className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
//             >
//               <ChevronRight />
//             </button>
//           </div>
//         </div>

//         {/* Carousel Track */}
//         <div className="overflow-hidden">
//           <div
//             className="flex gap-5 transition-transform duration-500 ease-in-out"
//             style={{
//               transform: `translateX(calc(-${current} * (100% / ${VISIBLE} + ${20 / VISIBLE}px)))`,
//             }}
//           >
//             {COMPANIES.map((company, i) => (
//               <div
//                 key={i}
//                 className="flex-shrink-0 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
//                 style={{ minWidth: `calc(${100 / VISIBLE}% - ${(20 * (VISIBLE - 1)) / VISIBLE}px)` }}
//                 onClick={() => navigate(`/company/${company.name.toLowerCase()}`)}
//               >
//                 {/* Top row */}
//                 <div className="flex items-start justify-between mb-5">
//                   <div
//                     className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md"
//                     style={{ background: `linear-gradient(135deg, ${company.logoFrom}, ${company.logoTo})` }}
//                   >
//                     {company.logo}
//                   </div>
//                   <span className={`text-xs font-semibold px-3 py-1 rounded-full ${company.tagClass}`}>
//                     {company.tag}
//                   </span>
//                 </div>

//                 {/* Name & Industry */}
//                 <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight">
//                   {company.name}
//                 </h3>
//                 <p className="text-sm text-slate-400 mt-0.5">{company.industry}</p>

//                 {/* Location */}
//                 <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-2">
//                   <MapPinIcon />
//                   <span>{company.location}</span>
//                 </div>

//                 {/* Divider */}
//                 <div className="border-t border-slate-100 my-4" />

//                 {/* Stats */}
//                 <div className="grid grid-cols-3 gap-2 text-center mb-5">
//                   <div>
//                     <p className="text-base font-extrabold text-indigo-600">{company.openings}+</p>
//                     <p className="text-xs text-slate-400 mt-0.5">Openings</p>
//                   </div>
//                   <div>
//                     <p className="text-base font-extrabold text-slate-700">{company.rating}★</p>
//                     <p className="text-xs text-slate-400 mt-0.5">Rating</p>
//                   </div>
//                   <div>
//                     <p className="text-base font-extrabold text-slate-700">{company.founded}</p>
//                     <p className="text-xs text-slate-400 mt-0.5">Founded</p>
//                   </div>
//                 </div>

//                 {/* View Jobs Button */}
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     navigate(`/jobs?company=${company.name.toLowerCase()}`);
//                   }}
//                   className="w-full py-2.5 rounded-xl border-2 border-indigo-100 text-indigo-600 font-semibold text-sm hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-200"
//                 >
//                   View Jobs →
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Dot Indicators */}
//         <div className="flex justify-center gap-2 mt-8">
//           {Array.from({ length: maxIndex + 1 }).map((_, i) => (
//             <button
//               key={i}
//               onClick={() => setCurrent(i)}
//               className={`h-2 rounded-full transition-all duration-300 ${
//                 current === i ? "w-6 bg-indigo-600" : "w-2 bg-slate-300 hover:bg-slate-400"
//               }`}
//             />
//           ))}
//         </div>

//         {/* View All Link */}
//         <div className="text-center mt-8">
//           <button
//             onClick={() => navigate("/companies")}
//             className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:gap-3 transition-all"
//           >
//             View All Companies <ArrowRight />
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }

// // ─── Main Home Component ──────────────────────────────────────────────────────
// export default function Home() {
//   const navigate = useNavigate();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [location, setLocation] = useState("");
//   const handleSearch = () => {
//     navigate(`/jobs?q=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(location)}`);
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") handleSearch();
//   };

//   return (
//     <div className="min-h-screen bg-slate-50">

//       {/* ── HERO ── */}
//       <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900 py-20 md:py-28 px-4 sm:px-6">
//         <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
//         <div className="absolute bottom-0 left-0 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

//         <div className="relative max-w-4xl mx-auto text-center">
//           {/* Badge */}
//           <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 rounded-full px-4 py-1.5 mb-7">
//             <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
//             <span className="text-indigo-200 text-xs font-semibold tracking-wide">50,000+ Jobs Available Right Now</span>
//           </div>

//           <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight mb-5">
//             Find Your Dream Job <br />
//             <span className="bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
//               or Hire Top Talent
//             </span>
//           </h1>

//           <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
//             JobPortal connects ambitious professionals with world-class companies. Your next chapter starts here.
//           </p>

//           {/* Search Bar */}
//           <div className="bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-2xl max-w-2xl mx-auto mb-6">
//             <div className="flex-1 flex items-center gap-3 px-4 py-2.5 bg-slate-50 rounded-xl">
//               <span className="text-slate-400 shrink-0"><SearchIcon /></span>
//               <input
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 onKeyDown={handleKeyDown}
//                 placeholder="Job title, keyword, or company..."
//                 className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none"
//               />
//             </div>
//             <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 rounded-xl sm:w-44">
//               <span className="text-slate-400 shrink-0"><MapPinIcon /></span>
//               <input
//                 value={location}
//                 onChange={(e) => setLocation(e.target.value)}
//                 onKeyDown={handleKeyDown}
//                 placeholder="City or Remote"
//                 className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none"
//               />
//             </div>
//             <button
//               onClick={handleSearch}
//               className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-bold text-sm px-7 py-3 rounded-xl shadow-lg shadow-indigo-400/30 hover:-translate-y-0.5 hover:shadow-indigo-400/50 transition-all whitespace-nowrap"
//             >
//               Search Jobs
//             </button>
//           </div>

//           {/* Popular Tags */}
//           <div className="flex flex-wrap justify-center gap-2">
//             <span className="text-slate-500 text-xs flex items-center mr-1">Popular:</span>
//             {["React Developer", "UI/UX Designer", "Data Analyst", "Remote", "Product Manager"].map((tag) => (
//               <button
//                 key={tag}
//                 onClick={() => setSearchQuery(tag)}
//                 className="bg-white/10 border border-white/15 text-slate-300 hover:bg-indigo-500/30 hover:text-white hover:border-indigo-400/50 rounded-full px-3 py-1 text-xs transition-all"
//               >
//                 {tag}
//               </button>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── STATS BAR ── */}
//       <section className="bg-white border-b border-slate-100">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100">
//           {STATS.map((s, i) => (
//             <div key={i} className="py-6 text-center">
//               <div className="text-2xl sm:text-3xl font-black text-indigo-600 tracking-tight">{s.value}</div>
//               <div className="text-slate-500 text-xs sm:text-sm font-medium mt-1">{s.label}</div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ── JOB CATEGORIES ── */}
//       <section className="py-16 md:py-20 px-4 sm:px-6">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex items-end justify-between mb-8 gap-4">
//             <div>
//               <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest mb-2">Explore</p>
//               <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Browse by Industry</h2>
//             </div>
//             <button
//               onClick={() => navigate("/jobs")}
//               className="hidden sm:flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:gap-3 transition-all shrink-0"
//             >
//               View all <ArrowRight />
//             </button>
//           </div>

//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
//             {CATEGORIES.map((cat, i) => (
//               <button
//                 key={i}
//                 onClick={() => navigate(`/jobs?category=${cat.label.toLowerCase()}`)}
//                 className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-100 hover:-translate-y-1 transition-all group text-center"
//               >
//                 <span className="text-3xl">{cat.emoji}</span>
//                 <span className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{cat.label}</span>
//                 <span className="text-slate-400 text-xs">{cat.count}</span>
//               </button>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── COMPANY CAROUSEL ── */}
//       <CompanyCarousel navigate={navigate} />

//       {/* ── FEATURES ── */}
//       <section className="py-16 md:py-20 px-4 sm:px-6 bg-slate-100">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-12">
//             <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest mb-3">Why Us</p>
//             <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
//               Everything You Need to Succeed
//             </h2>
//             <p className="text-slate-500 max-w-md mx-auto mt-3 text-sm leading-relaxed">
//               Built for job seekers and recruiters alike — fast, trusted, and designed to get results.
//             </p>
//           </div>
//           <div className="grid sm:grid-cols-2 gap-5">
//             {FEATURES.map((f, i) => (
//               <div
//                 key={i}
//                 className="bg-white rounded-2xl p-7 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
//               >
//                 <div className={`w-14 h-14 rounded-2xl ${f.bgClass} ${f.colorClass} flex items-center justify-center mb-5`}>
//                   {f.icon}
//                 </div>
//                 <h3 className="font-bold text-lg text-slate-800 mb-2">{f.title}</h3>
//                 <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── HOW IT WORKS ── */}
//       <section className="py-16 md:py-24 px-4 sm:px-6">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-14">
//             <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest mb-3">Simple Process</p>
//             <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Get Hired in 3 Steps</h2>
//           </div>
//           <div className="grid sm:grid-cols-3 gap-10 relative">
//             <div className="hidden sm:block absolute top-10 left-[18%] right-[18%] h-0.5 bg-gradient-to-r from-indigo-400 to-indigo-600" />
//             {HOW_IT_WORKS.map((step, i) => (
//               <div key={i} className="text-center relative z-10">
//                 <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-white text-2xl font-black flex items-center justify-center shadow-xl shadow-indigo-200 border-4 border-white">
//                   {step.step}
//                 </div>
//                 <h3 className="font-bold text-lg text-slate-800 mb-2">{step.title}</h3>
//                 <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── CTA ── */}
//       <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900 py-20 px-4 sm:px-6">
//         <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
//         <div className="relative max-w-2xl mx-auto text-center">
//           <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">
//             Ready to Take the Next Step?
//           </h2>
//           <p className="text-slate-400 text-base leading-relaxed mb-10 max-w-lg mx-auto">
//             Join over 120,000 professionals who've found their dream role through JobPortal.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <button
//               onClick={() => navigate("/jobs")}
//               className="bg-white text-indigo-700 font-bold px-8 py-3.5 rounded-xl shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all"
//             >
//               Browse Jobs
//             </button>
//             <button
//               onClick={() => navigate("/signup")}
//               className="bg-white/10 backdrop-blur text-white border border-white/25 font-bold px-8 py-3.5 rounded-xl hover:bg-white/20 transition-all"
//             >
//               Sign Up Free
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* ── FOOTER ── */}
//       <footer className="bg-slate-900 text-slate-400 pt-14 pb-8 px-4 sm:px-6">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-10 border-b border-slate-800">
//             {/* Brand */}
//             <div className="col-span-2 md:col-span-1">
//               <div className="flex items-center gap-2 mb-4">
//                 <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center">
//                   <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
//                     <rect x="2" y="7" width="20" height="14" rx="2" fill="white" />
//                     <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="white" fill="none" strokeWidth="2" />
//                   </svg>
//                 </div>
//                 <span className="font-extrabold text-lg text-white">
//                   Job<span className="text-indigo-400">Portal</span>
//                 </span>
//               </div>
//               <p className="text-sm leading-relaxed max-w-[220px]">
//                 Connecting talent with opportunity. The smartest way to find your next job or hire your next star.
//               </p>
//             </div>

//             {[
//               { title: "For Job Seekers", links: ["Browse Jobs", "Career Advice", "Salary Guide", "Resume Builder"] },
//               { title: "For Employers", links: ["Post a Job", "Search Talent", "Pricing", "Recruiter Tools"] },
//               { title: "Company", links: ["About Us", "Blog", "Careers", "Contact"] },
//             ].map((col, i) => (
//               <div key={i}>
//                 <p className="text-white font-semibold text-sm mb-4">{col.title}</p>
//                 {col.links.map((link) => (
//                   <button
//                     key={link}
//                     onClick={() => navigate(`/${link.toLowerCase().replace(/ /g, "-")}`)}
//                     className="block text-slate-500 hover:text-slate-200 text-sm mb-2.5 transition-colors text-left"
//                   >
//                     {link}
//                   </button>
//                 ))}
//               </div>
//             ))}
//           </div>

//           <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
//             <span>© 2025 JobPortal. All rights reserved.</span>
//             <div className="flex flex-wrap gap-5">
//               {["Privacy Policy", "Terms of Service", "Cookie Settings"].map((link) => (
//                 <button
//                   key={link}
//                   onClick={() => navigate(`/${link.toLowerCase().replace(/ /g, "-")}`)}
//                   className="text-slate-500 hover:text-slate-300 transition-colors"
//                 >
//                   {link}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);
const MapPinIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const ChevronLeft = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="m15 18-6-6 6-6" />
  </svg>
);
const ChevronRight = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="m9 18 6-6-6-6" />
  </svg>
);
const ArrowRight = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);
const BriefcaseIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /><path d="M2 12h20" />
  </svg>
);
const UsersIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const ZapIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const ShieldIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────
const STATS = [
  { value: "50K+", label: "Jobs Posted" },
  { value: "120K+", label: "Job Seekers" },
  { value: "8K+", label: "Companies" },
  { value: "95%", label: "Placement Rate" },
];

const TRUSTED_LOGOS = [
  { name: "Amazon",   text: "amazon",   color: "#FF9900", weight: "900", style: "italic" },
  { name: "NVIDIA",   text: "NVIDIA",   color: "#76B900", weight: "900", style: "normal" },
  { name: "Google",   text: "Google",   color: "#4285F4", weight: "700", style: "normal" },
  { name: "Coinbase", text: "coinbase", color: "#0052FF", weight: "600", style: "normal" },
  { name: "Shopify",  text: "shopify",  color: "#5A8A3C", weight: "700", style: "normal" },
  { name: "Meta",     text: "Meta",     color: "#0668E1", weight: "700", style: "italic" },
  { name: "Netflix",  text: "NETFLIX",  color: "#E50914", weight: "900", style: "normal" },
  { name: "Stripe",   text: "stripe",   color: "#6772E5", weight: "600", style: "italic" },
  { name: "Airbnb",   text: "airbnb",   color: "#FF5A5F", weight: "700", style: "normal" },
  { name: "Figma",    text: "figma",    color: "#F24E1E", weight: "900", style: "normal" },
  { name: "Ford",     text: "Ford",     color: "#003399", weight: "900", style: "italic" },
  { name: "Slack",    text: "slack",    color: "#4A154B", weight: "700", style: "normal" },
];

const COMPANIES = [
  {
    name: "Google",
    industry: "Technology",
    location: "Mountain View, CA",
    openings: 320,
    logo: "G",
    logoFrom: "#4285F4",
    logoTo: "#34A853",
    tag: "Top Employer",
    tagClass: "bg-blue-100 text-blue-700",
    rating: "4.8",
    founded: "1998",
  },
  {
    name: "Microsoft",
    industry: "Software & Cloud",
    location: "Redmond, WA",
    openings: 215,
    logo: "M",
    logoFrom: "#0078D4",
    logoTo: "#00B4D8",
    tag: "Hiring Now",
    tagClass: "bg-green-100 text-green-700",
    rating: "4.7",
    founded: "1975",
  },
  {
    name: "Amazon",
    industry: "E-Commerce & Cloud",
    location: "Seattle, WA",
    openings: 480,
    logo: "A",
    logoFrom: "#FF9900",
    logoTo: "#FFD166",
    tag: "Fastest Growing",
    tagClass: "bg-orange-100 text-orange-700",
    rating: "4.5",
    founded: "1994",
  },
  {
    name: "Meta",
    industry: "Social Media & AI",
    location: "Menlo Park, CA",
    openings: 175,
    logo: "M",
    logoFrom: "#0668E1",
    logoTo: "#6C63FF",
    tag: "Top Employer",
    tagClass: "bg-blue-100 text-blue-700",
    rating: "4.6",
    founded: "2004",
  },
  {
    name: "Apple",
    industry: "Consumer Tech",
    location: "Cupertino, CA",
    openings: 290,
    logo: "🍎",
    logoFrom: "#555",
    logoTo: "#999",
    tag: "Premium Brand",
    tagClass: "bg-slate-100 text-slate-700",
    rating: "4.9",
    founded: "1976",
  },
  {
    name: "Netflix",
    industry: "Streaming & Media",
    location: "Los Gatos, CA",
    openings: 130,
    logo: "N",
    logoFrom: "#E50914",
    logoTo: "#B20710",
    tag: "Hiring Now",
    tagClass: "bg-red-100 text-red-700",
    rating: "4.6",
    founded: "1997",
  },
  {
    name: "Salesforce",
    industry: "CRM & SaaS",
    location: "San Francisco, CA",
    openings: 195,
    logo: "S",
    logoFrom: "#00A1E0",
    logoTo: "#0070D2",
    tag: "Best Culture",
    tagClass: "bg-sky-100 text-sky-700",
    rating: "4.7",
    founded: "1999",
  },
];

const FEATURES = [
  { icon: <BriefcaseIcon />, title: "Smart Job Matching", desc: "Our AI-powered engine matches your skills to the most relevant openings — saving you hours of searching.", colorClass: "text-indigo-600", bgClass: "bg-indigo-50" },
  { icon: <UsersIcon />, title: "Hire Top Talent", desc: "Recruiters can post jobs and instantly surface qualified candidates from our growing talent pool.", colorClass: "text-sky-600", bgClass: "bg-sky-50" },
  { icon: <ZapIcon />, title: "One-Click Apply", desc: "Apply to multiple jobs with your saved profile. No repetitive forms — your first impression, perfected.", colorClass: "text-amber-600", bgClass: "bg-amber-50" },
  { icon: <ShieldIcon />, title: "Verified Employers", desc: "Every company on JobPortal is vetted. You only see real opportunities from legitimate, trusted employers.", colorClass: "text-emerald-600", bgClass: "bg-emerald-50" },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Create Your Profile", desc: "Sign up and build a standout profile in minutes — upload your resume or fill in your details." },
  { step: "02", title: "Browse & Apply", desc: "Explore thousands of listings filtered by role, location, salary, and more. Apply with one click." },
  { step: "03", title: "Get Hired", desc: "Connect directly with employers, schedule interviews, and land your next role — fast." },
];

const CATEGORIES = [
  { label: "Engineering", count: "12,400 jobs", emoji: "⚙️" },
  { label: "Design", count: "4,200 jobs", emoji: "🎨" },
  { label: "Marketing", count: "6,800 jobs", emoji: "📣" },
  { label: "Finance", count: "5,100 jobs", emoji: "📊" },
  { label: "Healthcare", count: "9,300 jobs", emoji: "🏥" },
  { label: "Education", count: "3,700 jobs", emoji: "📚" },
];

// ─── Trusted Companies Marquee ────────────────────────────────────────────────
function TrustedMarquee() {
  const items = [...TRUSTED_LOGOS, ...TRUSTED_LOGOS]; // duplicate for seamless loop

  return (
    <section className="bg-white border-y border-slate-100 py-6 overflow-hidden">
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 30s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        .marquee-logo {
          opacity: 0.45;
          transition: opacity 0.25s ease;
        }
        .marquee-logo:hover {
          opacity: 1;
        }
      `}</style>

      <p className="text-center text-xs text-slate-400 font-semibold uppercase tracking-widest mb-5">
        Trusted by teams at world-class companies
      </p>

      <div className="marquee-track">
        {items.map((logo, i) => (
          <div
            key={i}
            className="marquee-logo flex items-center justify-center mx-10 shrink-0 cursor-default select-none"
          >
            <span
              style={{
                color: logo.color,
                fontWeight: logo.weight,
                fontStyle: logo.style,
                fontSize: "1.35rem",
                letterSpacing: "-0.02em",
                fontFamily: "'Georgia', serif",
              }}
            >
              {logo.text}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Company Carousel ─────────────────────────────────────────────────────────
function CompanyCarousel({ navigate }) {
  const [current, setCurrent] = useState(0);
  const VISIBLE = 3;
  const maxIndex = COMPANIES.length - VISIBLE;

  const prev = () => setCurrent((c) => Math.max(0, c - 1));
  const next = () => setCurrent((c) => Math.min(maxIndex, c + 1));

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4">
          <div>
            <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest mb-2">Top Companies</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Employers Hiring Now
            </h2>
            <p className="text-slate-500 text-sm mt-2 max-w-md">
              Explore opportunities at world-class companies actively looking for talent.
            </p>
          </div>

          {/* Arrow controls */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={prev}
              disabled={current === 0}
              className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft />
            </button>
            <span className="text-sm text-slate-400 font-medium tabular-nums">
              {current + 1} / {maxIndex + 1}
            </span>
            <button
              onClick={next}
              disabled={current >= maxIndex}
              className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight />
            </button>
          </div>
        </div>

        {/* Carousel Track */}
        <div className="overflow-hidden">
          <div
            className="flex gap-5 transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(calc(-${current} * (100% / ${VISIBLE} + ${20 / VISIBLE}px)))`,
            }}
          >
            {COMPANIES.map((company, i) => (
              <div
                key={i}
                className="flex-shrink-0 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
                style={{ minWidth: `calc(${100 / VISIBLE}% - ${(20 * (VISIBLE - 1)) / VISIBLE}px)` }}
                onClick={() => navigate(`/company/${company.name.toLowerCase()}`)}
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md"
                    style={{ background: `linear-gradient(135deg, ${company.logoFrom}, ${company.logoTo})` }}
                  >
                    {company.logo}
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${company.tagClass}`}>
                    {company.tag}
                  </span>
                </div>

                {/* Name & Industry */}
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight">
                  {company.name}
                </h3>
                <p className="text-sm text-slate-400 mt-0.5">{company.industry}</p>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-2">
                  <MapPinIcon />
                  <span>{company.location}</span>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-100 my-4" />

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-center mb-5">
                  <div>
                    <p className="text-base font-extrabold text-indigo-600">{company.openings}+</p>
                    <p className="text-xs text-slate-400 mt-0.5">Openings</p>
                  </div>
                  <div>
                    <p className="text-base font-extrabold text-slate-700">{company.rating}★</p>
                    <p className="text-xs text-slate-400 mt-0.5">Rating</p>
                  </div>
                  <div>
                    <p className="text-base font-extrabold text-slate-700">{company.founded}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Founded</p>
                  </div>
                </div>

                {/* View Jobs Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/jobs?company=${company.name.toLowerCase()}`);
                  }}
                  className="w-full py-2.5 rounded-xl border-2 border-indigo-100 text-indigo-600 font-semibold text-sm hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-200"
                >
                  View Jobs →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                current === i ? "w-6 bg-indigo-600" : "w-2 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/companies")}
            className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:gap-3 transition-all"
          >
            View All Companies <ArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── Main Home Component ──────────────────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    navigate(`/jobs?q=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(location)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900 py-20 md:py-28 px-4 sm:px-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 rounded-full px-4 py-1.5 mb-7">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-indigo-200 text-xs font-semibold tracking-wide">50,000+ Jobs Available Right Now</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight mb-5">
            Find Your Dream Job <br />
            <span className="bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
              or Hire Top Talent
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            JobPortal connects ambitious professionals with world-class companies. Your next chapter starts here.
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-2xl max-w-2xl mx-auto mb-6">
            <div className="flex-1 flex items-center gap-3 px-4 py-2.5 bg-slate-50 rounded-xl">
              <span className="text-slate-400 shrink-0"><SearchIcon /></span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Job title, keyword, or company..."
                className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none"
              />
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 rounded-xl sm:w-44">
              <span className="text-slate-400 shrink-0"><MapPinIcon /></span>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="City or Remote"
                className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none"
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-bold text-sm px-7 py-3 rounded-xl shadow-lg shadow-indigo-400/30 hover:-translate-y-0.5 hover:shadow-indigo-400/50 transition-all whitespace-nowrap"
            >
              Search Jobs
            </button>
          </div>

          {/* Popular Tags */}
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-slate-500 text-xs flex items-center mr-1">Popular:</span>
            {["React Developer", "UI/UX Designer", "Data Analyst", "Remote", "Product Manager"].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="bg-white/10 border border-white/15 text-slate-300 hover:bg-indigo-500/30 hover:text-white hover:border-indigo-400/50 rounded-full px-3 py-1 text-xs transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100">
          {STATS.map((s, i) => (
            <div key={i} className="py-6 text-center">
              <div className="text-2xl sm:text-3xl font-black text-indigo-600 tracking-tight">{s.value}</div>
              <div className="text-slate-500 text-xs sm:text-sm font-medium mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TRUSTED COMPANIES MARQUEE ── */}
      <TrustedMarquee />

      {/* ── JOB CATEGORIES ── */}
      <section className="py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8 gap-4">
            <div>
              <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest mb-2">Explore</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Browse by Industry</h2>
            </div>
            <button
              onClick={() => navigate("/jobs")}
              className="hidden sm:flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:gap-3 transition-all shrink-0"
            >
              View all <ArrowRight />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {CATEGORIES.map((cat, i) => (
              <button
                key={i}
                onClick={() => navigate(`/jobs?category=${cat.label.toLowerCase()}`)}
                className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-100 hover:-translate-y-1 transition-all group text-center"
              >
                <span className="text-3xl">{cat.emoji}</span>
                <span className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{cat.label}</span>
                <span className="text-slate-400 text-xs">{cat.count}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPANY CAROUSEL ── */}
      <CompanyCarousel navigate={navigate} />

      {/* ── FEATURES ── */}
      <section className="py-16 md:py-20 px-4 sm:px-6 bg-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest mb-3">Why Us</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Everything You Need to Succeed
            </h2>
            <p className="text-slate-500 max-w-md mx-auto mt-3 text-sm leading-relaxed">
              Built for job seekers and recruiters alike — fast, trusted, and designed to get results.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-7 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
              >
                <div className={`w-14 h-14 rounded-2xl ${f.bgClass} ${f.colorClass} flex items-center justify-center mb-5`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Get Hired in 3 Steps</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-10 relative">
            <div className="hidden sm:block absolute top-10 left-[18%] right-[18%] h-0.5 bg-gradient-to-r from-indigo-400 to-indigo-600" />
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="text-center relative z-10">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-white text-2xl font-black flex items-center justify-center shadow-xl shadow-indigo-200 border-4 border-white">
                  {step.step}
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900 py-20 px-4 sm:px-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">
            Ready to Take the Next Step?
          </h2>
          <p className="text-slate-400 text-base leading-relaxed mb-10 max-w-lg mx-auto">
            Join over 120,000 professionals who've found their dream role through JobPortal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/jobs")}
              className="bg-white text-indigo-700 font-bold px-8 py-3.5 rounded-xl shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all"
            >
              Browse Jobs
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="bg-white/10 backdrop-blur text-white border border-white/25 font-bold px-8 py-3.5 rounded-xl hover:bg-white/20 transition-all"
            >
              Sign Up Free
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-900 text-slate-400 pt-14 pb-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-10 border-b border-slate-800">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                    <rect x="2" y="7" width="20" height="14" rx="2" fill="white" />
                    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="white" fill="none" strokeWidth="2" />
                  </svg>
                </div>
                <span className="font-extrabold text-lg text-white">
                  Job<span className="text-indigo-400">Portal</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed max-w-[220px]">
                Connecting talent with opportunity. The smartest way to find your next job or hire your next star.
              </p>
            </div>

            {[
              { title: "For Job Seekers", links: ["Browse Jobs", "Career Advice", "Salary Guide", "Resume Builder"] },
              { title: "For Employers", links: ["Post a Job", "Search Talent", "Pricing", "Recruiter Tools"] },
              { title: "Company", links: ["About Us", "Blog", "Careers", "Contact"] },
            ].map((col, i) => (
              <div key={i}>
                <p className="text-white font-semibold text-sm mb-4">{col.title}</p>
                {col.links.map((link) => (
                  <button
                    key={link}
                    onClick={() => navigate(`/${link.toLowerCase().replace(/ /g, "-")}`)}
                    className="block text-slate-500 hover:text-slate-200 text-sm mb-2.5 transition-colors text-left"
                  >
                    {link}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
            <span>© 2025 JobPortal. All rights reserved.</span>
            <div className="flex flex-wrap gap-5">
              {["Privacy Policy", "Terms of Service", "Cookie Settings"].map((link) => (
                <button
                  key={link}
                  onClick={() => navigate(`/${link.toLowerCase().replace(/ /g, "-")}`)}
                  className="text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {link}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}