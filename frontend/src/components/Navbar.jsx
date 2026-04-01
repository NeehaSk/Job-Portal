import { useContext, useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/apiCheck";
import NotificationDrawer from "./NotificationDrawer";
import nexusLogo from "../assets/nexus_logo.png";

export default function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);
  const role = user?.role;
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isHomePage = location.pathname === "/";

  const navLinks =
    role === "jobseeker"
      ? [
        { to: "/dashboard", label: "Dashboard" },
        { to: "/jobs", label: "Browse Jobs" },
        { to: "/my-applications", label: "My Applications" },
      ]
      : role === "recruiter"
        ? [
          { to: "/recruiter/dashboard", label: "Dashboard" },
          { to: "/recruiter/jobs", label: "My Jobs" },
          { to: "/recruiter/applicants", label: "Applicants" },
          { to: "/recruiter/create-job", label: "Post Job" },
        ]
        : role === "admin"
          ? [
            { to: "/admin/dashboard", label: "Admin Console" },
          ]
          : [
            { to: "/jobs", label: "Find Jobs" },
          ];

  const active = (path) =>

    location.pathname === path
      ? "text-indigo-600 border-b-2 border-indigo-600"
      : "text-slate-800 hover:text-indigo-600 border-b-2 border-transparent";

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch unread notifications
  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30s
      return () => clearInterval(interval);
    }
  }, [user, location.pathname]);

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get("/notifications");
      const unread = res.data.filter(n => !n.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Failed to fetch unread count");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?search=${searchQuery}`);
    }
  };
  const [imgError, setImgError] = useState(false);
  const photoId = user?.profilePhotoId || user?.profile?.profilePhotoId;

  // Reset imgError when user or photoId changes
  useEffect(() => {
    setImgError(false);
  }, [user?._id, photoId]);

  return (
    <>
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          {/* LOGO & NAVIGATION */}
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-indigo-100 group-hover:rotate-6 transition-transform">
                <img src={nexusLogo} className="w-full h-full object-cover" alt="NEXAL" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-black tracking-tighter text-slate-800">NEXAL</span>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400">Job Portal</span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-8 h-16">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`h-full flex items-center px-1 text-sm font-bold transition-all ${active(link.to)}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* SEARCH BAR (Center/Right) */}
          {user && (
            <div className="hidden md:flex flex-1 max-w-sm mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  placeholder="Search jobs, skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full ${isHomePage ? 'bg-white text-slate-900 placeholder:text-slate-300 border-slate-200' : 'bg-slate-50 text-slate-700 border-slate-100 placeholder:text-slate-300'} border text-sm px-10 py-2.5 rounded-full focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium`}
                />
                <button
                  type="submit"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            </div>
          )}

          {/* RIGHT SIDE: NOTIFICATIONS & PROFILE */}
          <div className="flex items-center gap-6">
            {user && (
              <button
                onClick={() => setIsDrawerOpen(true)}
                className={`relative ${isHomePage ? 'text-white/70 hover:text-white' : 'text-slate-400 hover:text-indigo-600'} transition-colors`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[8px] font-black text-white ring-2 ring-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
            )}

            {!user ? (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-black text-slate-800 hover:text-indigo-600 transition-all">Login</Link>
                <Link to="/signup" className="px-6 py-3 bg-slate-900 text-white text-[10px] font-bold rounded-full uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-200">Get Started</Link>
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 group transition-all"
                >
                  <div className="w-10 h-10 rounded-full border-2 border-transparent group-hover:border-indigo-100 overflow-hidden bg-slate-100 transition-all ring-1 ring-slate-100 group-hover:ring-indigo-100 flex-shrink-0">
                    {(photoId && !imgError) ? (
                      <img
                        src={`http://localhost:5000/api/files/${photoId}?t=${Date.now()}`}
                        className="w-full h-full object-cover"
                        alt="Profile"
                        onError={() => setImgError(true)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm font-bold text-indigo-400 uppercase">
                        {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isHomePage ? 'text-slate-400' : 'text-slate-300'} transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* DROPDOWN MENU */}
                {profileOpen && (
                  <div className="absolute right-0 mt-4 w-72 bg-white border border-slate-100 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] py-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div className="px-6 py-4 border-b border-slate-50 mb-2">
                      <p className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest mb-1">Authenticated as</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{user.fullName}</p>
                      <p className="text-[10px] font-semibold text-slate-400 truncate">{user.email}</p>
                    </div>

                    <div className="px-2">
                      <Link
                        to={role === "admin" ? "/admin/profile" : (role === "recruiter" ? "/recruiter/profile" : "/jobseeker/profile")}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-6 py-3 text-sm font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-2xl transition-all"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-indigo-600">
                          👤
                        </div>
                        My Profile
                      </Link>

                      {(role === "jobseeker" || role === "recruiter") && (
                        <Link
                          to={role === "recruiter" ? "/recruiter/dashboard" : "/dashboard"}
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-6 py-3 text-sm font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-2xl transition-all"
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-indigo-600">
                            📊
                          </div>
                          Dashboard
                        </Link>
                      )}

                      {role === "admin" && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-6 py-3 text-sm font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-2xl transition-all"
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-indigo-600">
                            🛡️
                          </div>
                          Admin Console
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          logoutUser();
                        }}
                        className="w-full flex items-center gap-3 px-6 py-3 text-sm font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
                      >
                        <div className="w-8 h-8 rounded-lg bg-rose-50/50 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                        </div>
                        Logout Session
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MOBILE TOGGLE */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden ${isHomePage ? 'text-white' : 'text-slate-500'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-50 px-6 py-8 space-y-4 animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xl font-bold text-slate-800"
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <div className="pt-6 border-t border-slate-50">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 px-6 py-4 rounded-2xl text-sm font-semibold focus:outline-none"
                />
              </form>
            </div>
          )}
        </div>
      )}
    </nav>

    {/* NOTIFICATION DRAWER OUTSIDE NAV */}
    <NotificationDrawer 
      isOpen={isDrawerOpen} 
      onClose={() => setIsDrawerOpen(false)} 
      setUnreadCount={setUnreadCount}
    />
    </>
  );
}
