import React, { useState, useEffect, useCallback, useRef, useContext } from "react";
import api from "../api/apiCheck";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { User, FileText, GraduationCap, Building2 } from "lucide-react";
import { ProfileCard, QuickLinksSidebar, SkillTag, InfoRow } from "../components/ProfileComponents";
import ImageCropModal from "../components/ImageCropModal";
import { getCroppedImg } from "../utils/imageCrop";
import SearchableSelect from "../components/SearchableSelect";
import { AuthContext } from "../context/AuthContext";

const JobSeekerProfile = () => {
  const navigate = useNavigate();
  const { refreshUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("resume-headline");
  const [isEditing, setIsEditing] = useState(null); // ID of section being edited
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const fileInputRef = useRef(null);
  const [imgError, setImgError] = useState(false);

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    mobile: "",
    altMobile: "",
    gender: "",
    dob: "",
    address: "",
    hometown: "",
    pincode: "",
    state: "",
    languagesKnown: "",
    headline: "",
    skills: "",
    highestQualification: "",
    collegeName: "",
    university: "",
    course: "",
    stream: "",
    startingYear: "",
    graduationYear: "",
    courseType: "",
    gradingSystem: "",
    grade: "",
    experience: "0",
    currentCompany: "",
    designation: "",
    industry: "",
    location: "India",
    expectedSalary: "",
    certifications: "",
    github: "",
    linkedin: "",
    profilePhotoId: "",
    resumeId: "",
    employmentStatus: "Fresher",
  });

  // Reset imgError when photoId changes
  useEffect(() => {
    setImgError(false);
  }, [profile.profilePhotoId]);

  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await api.get("/jobseeker/profile");
      setProfile({
        fullName: data?.fullName || "",
        email: data?.email || "",
        mobile: data?.mobile || "",
        altMobile: data?.altMobile || "",
        gender: data?.profile?.gender || "",
        dob: data?.profile?.dob ? new Date(data?.profile?.dob).toISOString().split('T')[0] : "",
        address: data?.profile?.address || "",
        hometown: data?.profile?.hometown || "",
        pincode: data?.profile?.pincode || "",
        state: data?.profile?.state || "",
        languagesKnown: data?.profile?.languagesKnown?.join(", ") || "",
        headline: data?.profile?.headline || "",
        skills: data?.profile?.skills?.join(", ") || "",
        highestQualification: data?.profile?.education?.highestQualification || "",
        collegeName: data?.profile?.education?.collegeName || "",
        university: data?.profile?.education?.university || "",
        course: data?.profile?.education?.course || "",
        stream: data?.profile?.education?.stream || "",
        startingYear: data?.profile?.education?.startingYear || "",
        graduationYear: data?.profile?.education?.graduationYear || "",
        courseType: data?.profile?.education?.courseType || "",
        gradingSystem: data?.profile?.education?.gradingSystem || "",
        grade: data?.profile?.education?.grade || "",
        experience: data?.profile?.experience || "0",
        currentCompany: data?.profile?.currentCompany || "",
        designation: data?.profile?.designation || "",
        industry: data?.profile?.industry || "",
        location: data?.location || "India",
        expectedSalary: data?.profile?.expectedSalary || "",
        certifications: data?.profile?.certifications?.join(", ") || "",
        github: data?.profile?.socialLinks?.github || "",
        linkedin: data?.profile?.socialLinks?.linkedin || "",
        profilePhotoId: data?.profile?.profilePhotoId || "",
        resumeId: data?.profile?.resumeId || "",
        employmentStatus: data?.profile?.employmentStatus || "Fresher",
      });
    } catch (err) {
      toast.error("Error loading profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  // Scroll Sync for Sidebar
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["resume-headline", "key-skills", "employment", "education", "personal-details"];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 200) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...profile,
        experience: profile.employmentStatus === "Experienced" ? Number(profile.experience || 0) : 0,
        currentCompany: profile.employmentStatus === "Experienced" ? profile.currentCompany : "",
        designation: profile.employmentStatus === "Experienced" ? profile.designation : "",
        skills: profile.skills ? profile.skills.split(",").map((s) => s.trim()).filter(Boolean) : [],
        certifications: profile.certifications ? profile.certifications.split(",").map((c) => c.trim()).filter(Boolean) : [],
        languagesKnown: profile.languagesKnown ? profile.languagesKnown.split(",").map((l) => l.trim()).filter(Boolean) : [],
      };
      await api.put("/jobseeker/update-profile", payload);
      toast.success("Profile updated successfully!");
      setIsEditing(null);
      fetchProfile();
      refreshUser(); // Sync navbar data
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return toast.error("Please upload an image file");
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImageToCrop(reader.result);
      setShowCropModal(true);
    });
    reader.readAsDataURL(file);
  };

  const onCropComplete = async (croppedAreaPixels) => {
    setShowCropModal(false);
    setUploading(true);
    try {
      const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
      const formData = new FormData();
      formData.append("file", croppedImage, "profile.jpg");

      await api.put("/jobseeker/upload-profile-pic", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Profile photo updated!");
      fetchProfile();
      refreshUser(); // Update navbar avatar immediately
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const educationMappings = {
    "Graduation/Diploma": {
      degrees: ["B.Tech / B.E", "B.Sc", "B.Com", "BBA", "BA", "BCA", "B.Arch", "B.Pharm", "MBBS", "LLB", "B.Ed", "B.Des", "BHM", "BPT", "BDS", "Other"],
      streams: {
        "B.Tech / B.E": ["Computer Science Engineering (CSE)", "Information Technology (IT)", "Electronics and Communication (ECE)", "Electrical Engineering (EEE)", "Mechanical", "Civil", "Chemical", "Aerospace", "Automobile", "Biomedical", "Mechatronics", "Robotics", "AI", "Data Science", "Cyber Security"],
        "B.Sc": ["Mathematics", "Physics", "Chemistry", "Statistics", "Computer Science", "Biotechnology", "Microbiology", "Agriculture", "Nursing", "Environmental Science"],
        "B.Com": ["General", "Accounting & Finance", "Banking & Insurance", "Taxation", "Computer Applications"],
        "BBA": ["General", "Finance", "Marketing", "Human Resources", "International Business", "Business Analytics"],
        "BA": ["English", "History", "Political Science", "Economics", "Sociology", "Psychology", "Philosophy", "Geography"],
        "BCA": ["General", "Cloud Computing", "AI", "Data Science", "Cyber Security"],
        "B.Arch": ["Architecture"],
        "B.Pharm": ["Pharmacy"],
        "MBBS": ["Medicine"],
        "LLB": ["Law"],
        "B.Ed": ["Education"],
        "B.Des": ["Fashion Design", "Interior Design", "Graphic Design"],
        "BHM": ["Hotel Management", "Culinary Arts"],
        "BPT": ["Physiotherapy"],
        "BDS": ["Dentistry"]
      }
    },
    "Masters/Post-Graduation": {
      degrees: ["M.Tech / M.E", "M.Sc", "MBA", "M.Com", "MA", "MCA", "LLM", "M.Pharm", "M.Ed", "M.Des", "MS", "Other"],
      streams: {
        "M.Tech / M.E": ["Computer Science", "Data Science", "AI", "Cyber Security", "Software Engineering", "Electronics", "Electrical", "Mechanical", "Civil", "Robotics", "VLSI Design", "Embedded Systems"],
        "M.Sc": ["Mathematics", "Physics", "Chemistry", "Computer Science", "Data Science", "Biotechnology"],
        "MBA": ["Marketing", "Finance", "Human Resources", "Operations", "Information Technology", "International Business"],
        "M.Com": ["Accounting", "Finance", "Business Administration"],
        "MA": ["English", "Economics", "History", "Political Science", "Psychology"],
        "MCA": ["General", "Software Engineering", "AI", "Cloud Computing"],
        "LLM": ["Corporate Law", "Criminal Law", "International Law"],
        "M.Pharm": ["Pharmaceutics", "Pharmacology", "Pharmaceutical Chemistry"],
        "MS": ["Computer Science", "Data Science", "Information Systems"]
      }
    },
    "12th (Intermediate)": {
      degrees: ["Intermediate", "Diploma"],
      streams: {
        "Intermediate": ["MPC (Maths, Physics, Chemistry)", "BiPC (Biology, Physics, Chemistry)", "CEC (Civics, Economics, Commerce)", "MEC", "HEC", "Other"],
        "Diploma": ["Civil Engineering", "Mechanical Engineering", "Electrical Engineering", "Computer Science", "Electronics"]
      }
    },
    "10th": {
      degrees: ["10th"],
      streams: {
        "10th": ["General", "SSC", "CBSE", "ICSE", "State Board", "Other"],
      }
    },
    "Doctorate/PhD": {
      degrees: ["Ph.D", "M.Phil", "Other"],
      streams: {} // Free text for niche specializations
    }
  };

  const getAvailableDegrees = () => {
    return educationMappings[profile.highestQualification]?.degrees || [];
  };

  const getAvailableStreams = () => {
    const defaultMapping = educationMappings[profile.highestQualification];
    if (!defaultMapping) return [];
    
    // Check if the specific degree has predefined streams
    if (defaultMapping.streams && defaultMapping.streams[profile.course]) {
       return defaultMapping.streams[profile.course];
    }
    
    // Fallback logic for Intermediate and 10th which have generic streams based on qualification not degree sometimes
    if (profile.highestQualification === "12th (Intermediate)" || profile.highestQualification === "10th") {
       return defaultMapping.streams[profile.highestQualification === "10th" ? "10th" : "Intermediate"] || [];
    }

    return [];
  };

  const availableDegrees = getAvailableDegrees();
  const availableStreams = getAvailableStreams();

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Suggest restricting by type, e.g., PDF
    if (file.type !== "application/pdf") {
      return toast.error("Please upload a PDF file");
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      await api.put("/jobseeker/upload-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Resume uploaded successfully!");
      fetchProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || "Resume upload failed");
    } finally {
      setUploading(false);
    }
  };

  const menuLinks = [
    { id: "resume-headline", label: "Resume & Headline", secondaryAction: "Upload/Edit" },
    { id: "key-skills", label: "Key skills", secondaryAction: "Add" },
    { id: "employment", label: "Employment", secondaryAction: "Add" },
    { id: "education", label: "Education", secondaryAction: "Add" },
    { id: "personal-details", label: "Personal details", secondaryAction: "Add" },
  ];

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-blue-600 animate-pulse text-lg tracking-tight">Syncing Profile...</div>;

  return (
    <div className="profile-page min-h-screen bg-slate-50 pb-24 font-sans selection:bg-slate-200 selection:text-slate-900 pt-14">

      {showCropModal && (
        <ImageCropModal
          image={imageToCrop}
          onCropComplete={onCropComplete}
          onCancel={() => setShowCropModal(false)}
        />
      )}

      {/* CLEAN PROFESSIONAL HEADER */}
      <div className="bg-white border-b border-slate-100 pt-20 pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">

            {/* Circular Profile Pic Design - REDUCED SIZE */}
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-white rounded-full p-1 shadow-md border border-slate-100">
                <div
                  onClick={() => fileInputRef.current.click()}
                  className="w-full h-full rounded-full overflow-hidden bg-slate-50 cursor-pointer relative group/img"
                >
                  {(profile.profilePhotoId && !imgError) ? (
                    <img
                      src={`http://localhost:5000/api/files/${profile.profilePhotoId}?t=${Date.now()}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110"
                      alt="Profile"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl sm:text-4xl text-slate-200">
                      <User size={48} />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-blue-600/60 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all duration-300 backdrop-blur-sm">
                    <div className="flex flex-col items-center transform translate-y-4 group-hover/img:translate-y-0 transition-transform duration-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-white text-[10px] font-bold tracking-wider">Update Photo</span>
                    </div>
                  </div>

                  {uploading && (
                    <div className="absolute inset-0 bg-white/90 flex items-center justify-center backdrop-blur-sm">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              </div>

              <div className="absolute -bottom-1 -right-1 bg-orange-400 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg ring-4 ring-white">
                60%
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-3 md:space-y-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[9px] font-bold uppercase tracking-wider mb-2 border border-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Active Candidate
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-none">
                  {profile.fullName}
                </h1>
                <p className="text-xs sm:text-sm md:text-base font-medium text-slate-500 max-w-2xl leading-relaxed">
                  Based in <span className="text-indigo-600 font-bold">{profile.location || "International Network"}</span>
                </p>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-6 sm:gap-8 pt-2">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-0.5">Primary Contact</span>
                  <span className="text-xs font-bold text-slate-700">
                    {profile.email}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider mb-1">Contact</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-600">
                    {profile.mobile || "Add mobile"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />

          {/* SIDEBAR */}
          <div className="lg:col-span-3">
            <QuickLinksSidebar links={menuLinks} activeId={activeSection} />
          </div>

          {/* MAIN AREA */}
          <div className="lg:col-span-9 space-y-12">


            {/* RESUME & HEADLINE */}
            <ProfileCard
              id="resume-headline"
              title="Resume & Headline"
              onEdit={() => setIsEditing("resume-headline")}
              isEditing={isEditing === "resume-headline"}
            >
              <div className="mb-6 pb-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-1">Resume</h4>
                  {profile.resumeId ? (
                    <div className="flex items-center gap-2">
                       <FileText size={20} className="text-emerald-500" />
                      <span className="text-sm font-medium text-slate-600">Resume attached</span>
                      <a 
                        href={`http://localhost:5000/api/files/${profile.resumeId}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs text-blue-600 hover:underline ml-2 font-bold"
                      >
                        View
                      </a>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">Resume is the most important document recruiters look for.</p>
                  )}
                </div>
                
                <div className="relative">
                   <input type="file" id="resumeUpload" className="hidden" accept=".pdf" onChange={handleResumeUpload} />
                   <label 
                      htmlFor="resumeUpload" 
                      className={`cursor-pointer px-4 py-2 border-2 border-dashed border-blue-200 rounded-xl text-xs font-bold text-blue-600 hover:bg-blue-50 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      {uploading ? 'Uploading...' : 'Upload PDF'}
                   </label>
                </div>
              </div>

              {isEditing === "resume-headline" ? (
                <form onSubmit={handleUpdate} className="animate-fadeIn">
                  <h4 className="text-sm font-bold text-slate-700 mb-2">Resume Headline</h4>
                  <textarea
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-24 mb-4"
                    value={profile.headline}
                    name="headline"
                    onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                  />
                  <div className="flex justify-end gap-3">
                    <button type="button" onClick={() => setIsEditing(null)} className="text-sm font-bold text-slate-400 px-4">Cancel</button>
                    <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-indigo-700 transition">Save</button>
                  </div>
                </form>
              ) : (
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-2">Resume Headline</h4>
                  <p className="font-medium text-slate-600 leading-relaxed text-sm">
                    {profile.headline || "It is the first thing recruiters notice in your profile. Write a concise headline about your professional identity."}
                  </p>
                </div>
              )}
            </ProfileCard>

            {/* KEY SKILLS */}
            <ProfileCard
              id="key-skills"
              title="Key skills"
              onEdit={() => setIsEditing("key-skills")}
              isEditing={isEditing === "key-skills"}
            >
              {isEditing === "key-skills" ? (
                <form onSubmit={handleUpdate} className="animate-fadeIn">
                  <input
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none mb-4"
                    value={profile.skills}
                    placeholder="Ex: React, Node, CSS (comma separated)"
                    onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                  />
                  <div className="flex justify-end gap-3">
                    <button type="button" onClick={() => setIsEditing(null)} className="text-sm font-bold text-slate-400 px-4">Cancel</button>
                    <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-indigo-700 transition">Save</button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-wrap pt-2">
                  {profile.skills ? profile.skills.split(",").map((s) => <SkillTag key={s} label={s.trim()} />) : <span className="text-slate-300 italic">Add your top technical skills here</span>}
                </div>
              )}
            </ProfileCard>

            {/* EMPLOYMENT */}
            <ProfileCard
              id="employment"
              title="Employment"
              onAdd={() => setIsEditing("employment")}
              isEditing={isEditing === "employment"}
            >
              {isEditing === "employment" ? (
                <form onSubmit={handleUpdate} className="grid md:grid-cols-2 gap-5 animate-fadeIn">
                  <div className="md:col-span-2 space-y-3">
                    <label className="text-xs font-medium text-slate-500">Employment Status</label>
                    <div className="flex flex-wrap gap-6">
                      {["Student", "Fresher", "Experienced"].map((status) => (
                        <label key={status} className="flex items-center gap-2 cursor-pointer group">
                          <input 
                            type="radio" 
                            name="employmentStatus" 
                            value={status} 
                            checked={profile.employmentStatus === status}
                            onChange={(e) => setProfile({ ...profile, employmentStatus: e.target.value })}
                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                          />
                          <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{status}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {profile.employmentStatus === "Experienced" && (
                    <>
                      <div className="space-y-4 md:col-span-2 mt-2">
                        <label className="text-xs font-medium text-slate-500">Total Experience (Years)</label>
                        <input type="number" step="0.1" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm" value={profile.experience} onChange={(e) => setProfile({ ...profile, experience: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-500">Current Designation</label>
                        <input className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm" value={profile.designation} onChange={(e) => setProfile({ ...profile, designation: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-500">Current Company</label>
                        <input className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm" value={profile.currentCompany} onChange={(e) => setProfile({ ...profile, currentCompany: e.target.value })} />
                      </div>
                    </>
                  )}

                  <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                    <button type="button" onClick={() => setIsEditing(null)} className="text-sm font-bold text-slate-400 px-4">Cancel</button>
                    <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-indigo-700 transition">Save Details</button>
                  </div>
                </form>
              ) : (
                <div className="py-2">
                  {profile.employmentStatus === "Student" || profile.employmentStatus === "Fresher" ? (
                    <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded flex items-center justify-center text-xl">
                        <GraduationCap size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{profile.employmentStatus}</h4>
                        <p className="text-slate-500 font-medium text-sm">Currently seeking entry-level opportunities</p>
                      </div>
                    </div>
                  ) : profile.currentCompany ? (
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center text-xl grayscale opacity-30 text-slate-400">
                         <Building2 size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{profile.designation}</h4>
                        <p className="text-slate-500 font-medium">{profile.currentCompany}</p>
                        <p className="text-slate-400 text-xs mt-1">{profile.experience} years of total experience</p>
                      </div>
                    </div>
                  ) : <span className="text-slate-300 italic">Mention your current or past employment to attract recruiters</span>}
                </div>
              )}
            </ProfileCard>

            {/* EDUCATION */}
            <ProfileCard
              id="education"
              title="Education"
              onAdd={() => setIsEditing("education")}
              isEditing={isEditing === "education"}
            >
              {isEditing === "education" ? (
                <form onSubmit={handleUpdate} className="grid md:grid-cols-2 gap-5 animate-fadeIn">
                  
                  {/* Highest Qualification */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-medium text-slate-500">Highest Qualification</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={profile.highestQualification}
                      onChange={(e) => setProfile({ ...profile, highestQualification: e.target.value })}
                    >
                      <option value="">Select Qualification</option>
                      <option value="Doctorate/PhD">Doctorate/PhD</option>
                      <option value="Masters/Post-Graduation">Masters/Post-Graduation</option>
                      <option value="Graduation/Diploma">Graduation/Diploma</option>
                      <option value="12th (Intermediate)">12th (Intermediate)</option>
                      <option value="10th">10th</option>
                    </select>
                  </div>

                  {/* University & College */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-500">University / Board</label>
                    <input 
                      placeholder="e.g. Delhi University / CBSE"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                      value={profile.university} 
                      onChange={(e) => setProfile({ ...profile, university: e.target.value })} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-500">College / School Name</label>
                    <input 
                      placeholder="e.g. IIT Delhi / Delhi Public School"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                      value={profile.collegeName} 
                      onChange={(e) => setProfile({ ...profile, collegeName: e.target.value })} 
                    />
                  </div>

                  {/* Course & Stream */}
                  {profile.highestQualification !== "10th" && (
                    <>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-500">Course / Degree</label>
                        <SearchableSelect 
                          options={availableDegrees}
                          value={profile.course}
                          onChange={(val) => setProfile({ ...profile, course: val, stream: "" })}
                          placeholder="Select or type Course/Degree"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-500">Specialization / Stream</label>
                        <SearchableSelect 
                          options={availableStreams.length > 0 ? [...availableStreams, "Other"] : []}
                          value={profile.stream}
                          onChange={(val) => setProfile({ ...profile, stream: val })}
                          placeholder="Select or type Specialization/Stream"
                        />
                      </div>

                      {/* Course Type */}
                      <div className="md:col-span-2 space-y-3">
                        <label className="text-xs font-medium text-slate-500">Course type</label>
                        <div className="flex flex-wrap gap-6">
                          {["Full time", "Part time", "Correspondence/Distance learning"].map((type) => (
                            <label key={type} className="flex items-center gap-2 cursor-pointer group">
                              <input 
                                type="radio" 
                                name="courseType" 
                                value={type} 
                                checked={profile.courseType === type}
                                onChange={(e) => setProfile({ ...profile, courseType: e.target.value })}
                                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                              />
                              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{type}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Year Range */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-medium text-slate-500">Course duration</label>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <SearchableSelect 
                          options={Array.from({length: 30}, (_, i) => String(new Date().getFullYear() - i))}
                          value={profile.startingYear} 
                          onChange={(val) => setProfile({ ...profile, startingYear: val })}
                          placeholder="Starting year"
                        />
                      </div>
                      <span className="text-slate-400 font-medium">To</span>
                      <div className="flex-1">
                        <SearchableSelect 
                          options={Array.from({length: 35}, (_, i) => String(new Date().getFullYear() + 5 - i))}
                          value={profile.graduationYear} 
                          onChange={(val) => setProfile({ ...profile, graduationYear: val })}
                          placeholder="Ending year"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Grading */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-500">Grading System</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={profile.gradingSystem} 
                      onChange={(e) => setProfile({ ...profile, gradingSystem: e.target.value })}
                    >
                      <option value="">Select Scale</option>
                      <option value="Percentage">Percentage (out of 100)</option>
                      <option value="CGPA">CGPA (out of 10)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-500">Grade / Score</label>
                    <input 
                      type="number"
                      step={profile.gradingSystem === "CGPA" ? "0.01" : "1"}
                      placeholder={profile.gradingSystem === "CGPA" ? "e.g. 8.5" : "e.g. 85"}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                      value={profile.grade} 
                      onChange={(e) => setProfile({ ...profile, grade: e.target.value })} 
                    />
                  </div>

                  <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                    <button type="button" onClick={() => setIsEditing(null)} className="text-sm font-bold text-slate-400 px-4">Cancel</button>
                    <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-indigo-700 transition">Save Education</button>
                  </div>
                </form>
              ) : (
                <div className="py-2">
                  {profile.highestQualification ? (
                    <div>
                      <h4 className="font-bold text-slate-800 break-words text-base">{profile.highestQualification}</h4>
                      {profile.course && <p className="text-slate-700 font-semibold text-sm">{profile.course} {profile.stream ? `- ${profile.stream}` : ''}</p>}
                      <p className="text-slate-500 font-medium text-sm mt-1">{profile.collegeName} {profile.university ? `(${profile.university})` : ''}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 mt-3">
                         {profile.courseType && (
                           <span className="text-slate-500 text-[10px] font-bold bg-slate-100/50 border border-slate-100 px-2 py-1 rounded-md">
                             {profile.courseType}
                           </span>
                         )}
                         <span className="text-slate-400 text-xs font-bold">
                            {profile.startingYear && profile.graduationYear ? `${profile.startingYear} - ${profile.graduationYear}` : (profile.graduationYear || 'Present')}
                         </span>
                         {profile.grade && (
                           <span className="text-blue-600 text-xs font-bold bg-blue-50/50 px-2 py-1 rounded-md">
                              {profile.grade} {profile.gradingSystem === "CGPA" ? "CGPA" : "%"}
                           </span>
                         )}
                      </div>
                    </div>
                  ) : <span className="text-slate-300 italic">Add details of your degrees and achievements</span>}
                </div>
              )}
            </ProfileCard>

          {/* PERSONAL DETAILS */}
            <ProfileCard
              id="personal-details"
              title="Personal details"
              onEdit={() => setIsEditing("personal-details")}
              isEditing={isEditing === "personal-details"}
            >
              {isEditing === "personal-details" ? (
                <form onSubmit={handleUpdate} className="grid md:grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 animate-fadeIn">
                  
                  {/* Read-only primary details */}
                  <div className="space-y-4">
                    <label className="text-xs font-medium text-slate-500">Primary Mobile</label>
                    <input className="w-full bg-slate-100 border border-slate-200 rounded-lg p-3 text-sm text-slate-500 cursor-not-allowed" disabled value={profile.mobile} />
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-medium text-slate-500">Email Address</label>
                    <input className="w-full bg-slate-100 border border-slate-200 rounded-lg p-3 text-sm text-slate-500 cursor-not-allowed" disabled value={profile.email} />
                  </div>
                  
                  {/* Editable contact */}
                  <div className="space-y-4">
                    <label className="text-xs font-medium text-slate-500 flex items-center gap-1">Alternate Mobile <span className="text-rose-500">*</span></label>
                    <input 
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500" 
                      value={profile.altMobile} 
                      onChange={(e) => setProfile({ ...profile, altMobile: e.target.value })} 
                      placeholder="Enter alternate number"
                    />
                  </div>

                  {/* Basic Demographics */}
                  <div className="space-y-4">
                    <label className="text-xs font-medium text-slate-500">Gender</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                      value={profile.gender} 
                      onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-medium text-slate-500 flex items-center gap-1">Date of Birth</label>
                    <input 
                      type="date"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                      value={profile.dob} 
                      onChange={(e) => setProfile({ ...profile, dob: e.target.value })} 
                    />
                  </div>

                  {/* Location Info */}
                  <div className="space-y-4">
                    <label className="text-xs font-medium text-slate-500">Current Location / City</label>
                    <input placeholder="e.g. Bangalore" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm" value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} />
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-medium text-slate-500">Hometown</label>
                    <input placeholder="e.g. Pune" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm" value={profile.hometown} onChange={(e) => setProfile({ ...profile, hometown: e.target.value })} />
                  </div>
                  <div className="md:col-span-1 lg:col-span-2 space-y-4">
                    <label className="text-xs font-medium text-slate-500">Permanent Address</label>
                    <textarea placeholder="Enter your full address" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm" value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} />
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-medium text-slate-500">State</label>
                    <input placeholder="e.g. Karnataka" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm" value={profile.state} onChange={(e) => setProfile({ ...profile, state: e.target.value })} />
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-medium text-slate-500">Pincode</label>
                    <input placeholder="e.g. 560001" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm" value={profile.pincode} onChange={(e) => setProfile({ ...profile, pincode: e.target.value })} />
                  </div>

                  {/* Extras */}
                  <div className="space-y-4">
                    <label className="text-xs font-medium text-slate-500">Languages Known</label>
                    <input 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm" 
                      placeholder="e.g. English, Hindi"
                      value={profile.languagesKnown} 
                      onChange={(e) => setProfile({ ...profile, languagesKnown: e.target.value })} 
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-medium text-slate-500">Industry</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm" value={profile.industry} onChange={(e) => setProfile({ ...profile, industry: e.target.value })} />
                  </div>

                  <div className="lg:col-span-2 flex justify-end gap-3 mt-4">
                    <button type="button" onClick={() => setIsEditing(null)} className="text-sm font-bold text-slate-400 px-4">Cancel</button>
                    <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-indigo-700 transition">Save Details</button>
                  </div>
                </form>
              ) : (
                <div className="grid md:grid-cols-2 gap-y-6 gap-x-8 pt-2">
                  <InfoRow label="Email" value={profile.email} />
                  <InfoRow label="Mobile" value={profile.mobile} />
                  <InfoRow label="Alternate Mobile" value={profile.altMobile} />
                  <InfoRow label="Gender" value={profile.gender} />
                  <InfoRow label="Date of Birth" value={profile.dob ? new Date(profile.dob).toLocaleDateString('en-GB') : "Not updated"} />
                  <InfoRow label="Current City" value={profile.location} />
                  <InfoRow label="Hometown" value={profile.hometown} />
                  <InfoRow label="State" value={profile.state} />
                  <InfoRow label="Pincode" value={profile.pincode} />
                  <InfoRow label="Address" value={profile.address} />
                  <InfoRow label="Languages" value={profile.languagesKnown} />
                  <InfoRow label="Industry" value={profile.industry} />
                </div>
              )}
            </ProfileCard>

          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerProfile;