import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/apiCheck";

/* ─── Intersection Observer Hook ─────────────────────────────────────────── */
function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setInView(true);
        obs.disconnect();
      }
    }, { threshold, rootMargin: "0px 0px -50px 0px" });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ─── Animated Counter ────────────────────────────────────────────────────── */
function Counter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView(0.5);
  useEffect(() => {
    if (!inView) return;
    const num = parseInt(target.replace(/\D/g, ""));
    let start = 0;
    const step = Math.ceil(num / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= num) {
        setCount(num);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── Fade-In Wrapper ─────────────────────────────────────────────────────── */
function FadeIn({ children, delay = 0, className = "", direction = "up" }) {
  const [ref, inView] = useInView();
  const getTransform = () => {
    if (direction === "up") return inView ? "translateY(0)" : "translateY(30px)";
    if (direction === "down") return inView ? "translateY(0)" : "translateY(-30px)";
    if (direction === "left") return inView ? "translateX(0)" : "translateX(30px)";
    if (direction === "right") return inView ? "translateX(0)" : "translateX(-30px)";
    return "none";
  };

  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: getTransform(),
      transition: `opacity 1s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 1s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`
    }}>
      {children}
    </div>
  );
}

/* ─── Icons ───────────────────────────────────────────────────────────────── */
const SearchIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>;
const MapPinIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>;
const BriefcaseIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>;
const UserIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const CodeIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>;
const DesignIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /><line x1="21.17" y1="8" x2="12" y2="8" /><line x1="3.95" y1="6.06" x2="8.54" y2="14" /><line x1="10.88" y1="21.94" x2="15.46" y2="14" /></svg>;
const BuildingIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" /><path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" /><path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" /></svg>;
const CurrencyIcon = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>;
const ArrowRightIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>;

/* ─── Mock Data ───────────────────────────────────────────────────────── */
const CATEGORIES = [
  { name: "Software Engineering", count: "12k+", icon: <CodeIcon />, color: "#06B6D4", bg: "rgba(6, 182, 212, 0.1)" },
  { name: "Product Design", count: "4k+", icon: <DesignIcon />, color: "#A855F7", bg: "rgba(168, 85, 247, 0.1)" },
  { name: "Marketing", count: "8k+", icon: <BriefcaseIcon />, color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)" },
  { name: "Operations", count: "6k+", icon: <UserIcon />, color: "#10B981", bg: "rgba(16, 185, 129, 0.1)" },
];

const COMPANIES = [
  { name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
  { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  { name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" },
  { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
  { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
  { name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
];

const FEATURES = [
  {
    title: "Light Speed Applications",
    desc: "Apply to multiple MNCs simultaneously using a unified hyper-optimized profile.",
    icon: "⚡",
    color: "#F59E0B",
    bg: "rgba(245, 158, 11, 0.15)"
  },
  {
    title: "Vetted Entities Only",
    desc: "Every company is strictly vetted to ensure legitimate and high standards.",
    icon: "🛡️",
    color: "#3B82F6",
    bg: "rgba(59, 130, 246, 0.15)"
  },
  {
    title: "AI Skill Matching",
    desc: "Algorithms pinpoint roles that exactly fit your specific trajectory.",
    icon: "🤖",
    color: "#10B981",
    bg: "rgba(16, 185, 129, 0.15)"
  },
  {
    title: "Premium Networking",
    desc: "Connect with industry leaders and mentors directly.",
    icon: "🤝",
    color: "#A855F7",
    bg: "rgba(168, 85, 247, 0.15)"
  }
];

/* ─── Main Component ──────────────────────────────────────────────────────── */
export default function Home() {
  const navigate = useNavigate();
  const [searchQ, setSearchQ] = useState("");
  const [locQ, setLocQ] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [expandedCard, setExpandedCard] = useState(0);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get("/jobs");
        if (res.data?.jobs) {
          setJobs(res.data.jobs);
          setFilteredJobs(res.data.jobs);
          setTotalCount(res.data.totalJobs || res.data.jobs.length);
        }
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = jobs;

    if (searchQ) {
      const q = searchQ.toLowerCase();
      result = result.filter(j =>
        j.title?.toLowerCase().includes(q) ||
        j.companyName?.toLowerCase().includes(q) ||
        j.skillsRequired?.some(s => s.toLowerCase().includes(q))
      );
    }

    if (locQ) {
      const l = locQ.toLowerCase();
      result = result.filter(j => j.location?.toLowerCase().includes(l));
    }

    if (selectedFilter !== "All") {
      const f = selectedFilter.toLowerCase();
      result = result.filter(j =>
        j.jobType?.toLowerCase().includes(f) ||
        j.workMode?.toLowerCase().includes(f)
      );
    }

    setFilteredJobs(result);
  }, [searchQ, locQ, selectedFilter, jobs]);

  const handleSearch = () => {
    const browseSection = document.getElementById("browse-jobs");
    if (browseSection) {
      browseSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="home-page min-h-screen bg-[#F8F9FB] text-slate-800 font-inter overflow-x-hidden selection:bg-indigo-100 italic">
      <style>{`
        .nav-glass {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }
        .hero-title {
          font-family: 'Outfit', sans-serif;
          letter-spacing: -0.03em;
          line-height: 1.1;
        }
        .search-card {
          background: white;
          border: 1px solid #e2e8f0;
          box-shadow: 0 30px 60px -12px rgba(79, 70, 229, 0.15);
          border-radius: 32px;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .search-card:focus-within {
          border-color: #4f46e5;
          box-shadow: 0 40px 80px -12px rgba(79, 70, 229, 0.2);
        }
        .glass-card {
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.05);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          height: 100%;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
        }
        .glass-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.1);
          border-color: #4f46e5;
        }
        .btn-indigo {
          background: #4f46e5;
          color: white;
          padding: 16px 32px;
          border-radius: 12px;
          font-weight: 700;
          transition: all 0.4s;
          box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.3);
        }
        .btn-indigo:hover {
          background: #4338ca;
          transform: translateY(-2px);
          box-shadow: 0 15px 25px -5px rgba(79, 70, 229, 0.4);
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .expanding-card {
          flex: 1;
          transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
          overflow: hidden;
          border-radius: 32px;
          position: relative;
          min-width: 80px;
          height: 520px;
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.03);
        }
        .expanding-card.active {
          flex: 4;
          background: white;
          border-color: #4f46e5;
          box-shadow: 0 25px 50px -12px rgba(79, 70, 229, 0.15);
        }
        .expanding-card-content {
          padding: 48px;
          height: 100%;
          display: flex;
          flex-direction: column;
          opacity: 0;
          transition: opacity 0.5s;
          white-space: nowrap;
        }
        .expanding-card.active .expanding-card-content {
          opacity: 1;
        }
        .vertical-label {
          position: absolute;
          bottom: 48px;
          left: 50%;
          transform: translateX(-50%) rotate(-90deg);
          transform-origin: center;
          font-size: 13px;
          font-weight: 800;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          transition: all 0.3s;
          white-space: nowrap;
        }
        .expanding-card.active .vertical-label {
          opacity: 0;
        }
        @keyframes slideLeft {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-slide-left {
          animation: slideLeft 40s linear infinite;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* ─── PROFESSIONAL HERO SECTION ───────────────────────────────────────── */}
      <section className="relative pt-44 pb-32 px-6 lg:px-12 overflow-hidden bg-white">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-50/50 rounded-full blur-[150px] -z-10" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 shadow-xl shadow-indigo-200 text-white text-[10px] font-black uppercase tracking-[0.25em] mb-12">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              Future-Proof Talent Network
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h1 className="hero-title text-[clamp(2.2rem,6vw,2.2rem)] mb-8 font-black text-slate-900 leading-[1.05]">
              Elevate Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-500">Professional Journey.</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.4}>
            <p className="text-slate-500 text-lg sm:text-xl max-w-2xl mx-auto mb-14 leading-relaxed font-medium">
              Connect with extraordinary opportunities at the intersection of innovation and excellence. A curated portal for high-impact roles.
            </p>
          </FadeIn>

          <FadeIn delay={0.6}>
            <div className="search-card max-w-4xl mx-auto p-4 flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 flex items-center px-8 gap-4 border-b md:border-b-0 md:border-r border-slate-100 w-full group/input">
                <SearchIcon className="text-indigo-600 transition-transform group-hover/input:scale-110" />
                <input
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  placeholder="Role, skill, or firm"
                  className="w-full py-6 bg-transparent outline-none text-slate-900 font-black text-base placeholder:text-slate-300"
                />
              </div>
              <div className="flex-1 flex items-center px-8 gap-4 w-full group/input2">
                <MapPinIcon className="text-indigo-600 transition-transform group-hover/input2:scale-110" />
                <input
                  value={locQ}
                  onChange={e => setLocQ(e.target.value)}
                  placeholder="Location or Remote"
                  className="w-full py-6 bg-transparent outline-none text-slate-900 font-black text-base placeholder:text-slate-300"
                />
              </div>
              <button
                onClick={handleSearch}
                className="w-full md:w-auto px-12 py-6 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95 whitespace-nowrap"
              >
                Find Jobs
              </button>
            </div>

            {(searchQ || locQ) && (
              <div className="mt-8 bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 text-left animate-fade-in-up">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Immediate Opportunities</h3>
                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">{filteredJobs.length} matches found</p>
                  </div>
                  <button onClick={() => { setSearchQ(""); setLocQ(""); }} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">Clear</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredJobs.length > 0 ? (
                    filteredJobs.slice(0, 6).map((job, i) => (
                      <div
                        key={job._id || i}
                        onClick={() => navigate(`/job/${job._id}`)}
                        className="p-5 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer group"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-slate-100 rounded text-slate-600">{job.jobType}</span>
                          <ArrowRightIcon className="text-slate-300 group-hover:text-indigo-500 transition-colors" size={14} />
                        </div>
                        <h4 className="font-bold text-slate-900 group-hover:text-indigo-700 truncate">{job.title}</h4>
                        <p className="text-xs font-semibold text-slate-500 mt-1">{job.companyName}</p>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-10 text-center text-slate-400 font-medium">No direct matches. Try adjusting your scope.</div>
                  )}
                </div>
              </div>
            )}
          </FadeIn>
        </div>
      </section>

      {/* ─── TRUSTED LOGOS ───────────────────────────────────────── */}
      <section className="py-12 bg-white border-y border-slate-100 overflow-hidden">
        <div className="flex gap-20 items-center whitespace-nowrap animate-slide-left opacity-30">
          {[...COMPANIES, ...COMPANIES].map((company, i) => (
            <img key={i} src={company.logo} alt={company.name} className="h-6 grayscale" />
          ))}
        </div>
      </section>

      {/* ─── THE NEXAL EXPERIENCE ─────────────────────────── */}
      <section className="py-24 px-6 lg:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16 space-y-3">
              <h2 className="text-sm font-black text-indigo-600 uppercase tracking-[0.2em]">Operational Excellence</h2>
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Platform Capabilities</h3>
              <p className="text-slate-500 font-medium max-w-xl mx-auto">Sophisticated tools designed for the modern architectural design of your career.</p>
            </div>
          </FadeIn>

          <div className="flex flex-col lg:flex-row gap-6">
            {FEATURES.map((feature, i) => (
              <div
                key={i}
                className={`expanding-card ${expandedCard === i ? 'active' : ''}`}
                onMouseEnter={() => setExpandedCard(i)}
                onClick={() => setExpandedCard(i)}
              >
                <div className="vertical-label">{feature.title}</div>
                <div className="expanding-card-content">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mb-8 shadow-sm border border-slate-100" style={{ background: feature.bg, color: feature.color }}>
                    {feature.icon}
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 mb-4 whitespace-normal">{feature.title}</h4>
                  <p className="text-slate-500 font-medium leading-relaxed whitespace-normal pr-8">
                    {feature.desc}
                  </p>
                  <div className="mt-auto pt-8">
                    <button className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-2">
                      Learn More <ArrowRightIcon size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DYNAMIC ELITE OPENINGS ─────────────────────────────── */}
      <section id="browse-jobs" className="py-24 px-6 lg:px-12 bg-[#fdfdfe]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="text-left space-y-2">
              <h2 className="text-sm font-black text-indigo-600 uppercase tracking-widest">Global Network</h2>
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">Elite Openings</h3>
              <p className="text-slate-500 font-medium max-w-md">Meticulously curated selection of high-visibility roles at prestigious organizations.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => scrollCarousel("left")} className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:border-indigo-600 transition-all">←</button>
              <button onClick={() => scrollCarousel("right")} className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:border-indigo-600 transition-all">→</button>
            </div>
          </div>

          <div ref={carouselRef} className="flex gap-8 overflow-x-auto pb-12 hide-scrollbar snap-x">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="min-w-[380px] h-[400px] bg-slate-100 rounded-3xl animate-pulse" />)
            ) : jobs.length > 0 ? (
              jobs.map((job, i) => (
                <div key={job._id || i} className="min-w-[380px] snap-center">
                  <div className="glass-card p-10 rounded-[2.5rem] bg-white group cursor-pointer" onClick={() => navigate(`/job/${job._id}`)}>
                    <div className="flex justify-between items-start mb-10">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black"><BuildingIcon size={24} /></div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">{job.jobType}</span>
                    </div>
                    <h4 className="text-2xl font-black text-slate-900 group-hover:text-indigo-700 transition-colors mb-2">{job.title}</h4>
                    <p className="font-bold text-slate-500 mb-10">{job.companyName}</p>
                    <div className="space-y-4 pt-10 border-t border-slate-50 mt-auto">
                      <div className="flex items-center gap-3 text-slate-500 font-semibold text-sm">
                        <MapPinIcon size={16} /> {job.location}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-slate-500 font-semibold text-sm">
                          <CurrencyIcon size={16} /> {job.salary ? `${job.salary.min / 1000}k - ${job.salary.max / 1000}k` : "Competitive"}
                        </div>
                        <ArrowRightIcon size={18} className="text-slate-300 group-hover:text-indigo-600" />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full text-center py-20 text-slate-400 font-bold">No active mandates found. Check back soon.</div>
            )}
          </div>
        </div>
      </section>

      {/* ─── ABOUT SECTION ────────────────────────────────────────── */}
      <section id="about" className="py-32 px-6 lg:px-12 bg-[#fafbfc] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-50/30 to-transparent -z-10" />
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2 space-y-8">
              <FadeIn direction="right">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-100 rounded-full shadow-sm text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                  Our Philosophy
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-[1.1]">
                  Architecting the Next <br />
                  <span className="text-indigo-600">Talent Revolution.</span>
                </h2>
                <p className="text-slate-500 text-lg font-medium leading-relaxed italic">
                  Nexal was founded on a singular principle: professional connections should be as sophisticated as the talent they involve. We aren't just a job board; we are a curated ecosystem for elite growth.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                  <div className="space-y-3">
                    <div className="text-2xl">🎯</div>
                    <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest">Our Mission</h4>
                    <p className="text-slate-500 text-xs font-bold leading-relaxed">To bridge the gap between visionary companies and world-class talent through hyper-optimized matching and vetting.</p>
                  </div>
                  <div className="space-y-3">
                    <div className="text-2xl">💎</div>
                    <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest">Our Values</h4>
                    <p className="text-slate-500 text-xs font-bold leading-relaxed">Precision, integrity, and architectural excellence in every professional mandate we facilitate.</p>
                  </div>
                </div>
              </FadeIn>
            </div>
            
            <div className="lg:w-1/2 relative">
              <FadeIn direction="left" delay={0.3}>
                <div className="relative z-10 bg-white rounded-[3rem] p-12 border border-slate-100 shadow-2xl shadow-indigo-100/50">
                  <div className="space-y-10">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-3xl font-black">N</div>
                      <div>
                        <h5 className="font-black text-slate-900 uppercase tracking-widest text-xs">Since 2024</h5>
                        <p className="text-[10px] font-bold text-slate-400 mt-1">THE ELITE STANDARD</p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="pb-6 border-b border-slate-50">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Reach</span>
                          <span className="text-xs font-black text-indigo-600">WIDE</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-600 w-[85%] rounded-full"></div>
                        </div>
                      </div>
                      <div className="pb-6 border-b border-slate-50">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vetting Rigor</span>
                          <span className="text-xs font-black text-indigo-600">MAX</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-600 w-[98%] rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-slate-500 text-sm font-medium leading-relaxed italic">
                      "At Nexal, we believe your professional identity is your greatest legacy. We provide the infrastructure to manifest it."
                    </p>
                  </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-100/50 rounded-full blur-3xl -z-10" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-100/50 rounded-full blur-3xl -z-10" />
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-12 bg-white">
        <div className="max-w-6xl mx-auto bg-slate-900 rounded-[3.5rem] p-12 md:p-24 text-center relative overflow-hidden text-white">
          <div className="relative z-10 space-y-8">
            <FadeIn>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none mb-4">Establish Your Legacy.</h2>
              <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">Join a community of forward-thinkers and industry pioneers. Your next milestone awaits within the Nexal ecosystem.</p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="flex gap-5 justify-center flex-wrap pt-6">
                <button onClick={() => navigate("/signup")} className="px-12 py-5 bg-indigo-600 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95">Enroll Now</button>
                <button onClick={() => navigate("/jobs")} className="px-12 py-5 bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white/10 transition-all active:scale-95">Browse Inventory</button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── STATS ────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-12 bg-white border-t border-slate-100 italic">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { l: "Roles Active", v: totalCount > 0 ? totalCount.toString() : "1.2k", s: totalCount > 0 ? "" : "+" },
            { l: "Partner Vetting", v: "100", s: "%" },
            { l: "Global Hubs", v: "24", s: "h" },
            { l: "Success Rate", v: "98", s: "%" },
          ].map((stat, i) => (
            <div key={i} className="text-center space-y-2">
              <div className="text-4xl font-black text-slate-800"><Counter target={stat.v} suffix={stat.s} /></div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="pt-24 pb-12 px-6 lg:px-12 bg-[#F8F9FB] border-t border-slate-200/60 font-inter">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-20">
            <div className="lg:col-span-2 space-y-8">
              <h2 className="text-2xl font-black tracking-tighter text-slate-900">NEXAL<span className="text-indigo-600">.</span></h2>
              <p className="text-slate-500 font-medium leading-relaxed max-w-sm italic">A sophisticated platform for the architectural design of your global career. Excellence in every connection.</p>
              <div className="flex gap-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">
                <a href="#" className="hover:text-indigo-600 transition-colors">LinkedIn</a>
                <a href="#" className="hover:text-indigo-600 transition-colors">Twitter</a>
                <a href="#" className="hover:text-indigo-600 transition-colors">Instagram</a>
              </div>
            </div>
            {[
              { t: "Modules", links: ["Browse", "Companies", "Categories"] },
              { t: "Collective", links: ["About", "Careers", "Blog"] },
              { t: "Legal", links: ["Privacy", "Terms", "Compliance"] },
            ].map(col => (
              <div key={col.t} className="space-y-8">
                <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.1em]">{col.t}</h5>
                <div className="flex flex-col gap-5">
                  {col.links.map(link => (
                    <a key={link} href="#" className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-all">{link}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="pt-12 border-t border-slate-200/50 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
              © 2026 Nexal Elite Ecosystem.
            </div>
            <div className="flex gap-10">
              <span className="hover:text-slate-600 cursor-pointer">System Status</span>
              <span className="hover:text-slate-600 cursor-pointer">Security Audits</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}