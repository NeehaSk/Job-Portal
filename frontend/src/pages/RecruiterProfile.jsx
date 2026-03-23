import api from "../api/apiCheck";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { ProfileCard, QuickLinksSidebar, InfoRow } from "../components/ProfileComponents";
import ImageCropModal from "../components/ImageCropModal";
import { getCroppedImg } from "../utils/imageCrop";
import React, { useEffect, useState, useCallback, useRef, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const RecruiterProfile = () => {
  const navigate = useNavigate();
  const { refreshUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(null);
  const [activeSection, setActiveSection] = useState("recruiter-info");
  const [uploading, setUploading] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const fileInputRef = useRef(null);
  const [imgError, setImgError] = useState(false);

  const [profile, setProfile] = useState({
    fullName: "",
    mobile: "",
    alternateMobile: "",
    designation: "",
    linkedin: "",
    bio: "",
    companyName: "",
    location: "",
    website: "",
    industry: "",
    companySize: "",
    description: "",
    profilePhotoId: "",
  });

  // Reset imgError when photoId changes
  useEffect(() => {
    setImgError(false);
  }, [profile.profilePhotoId]);

  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await api.get("/recruiter/profile");
      setProfile({
        fullName: data.fullName || "",
        mobile: data.mobile || "",
        alternateMobile: data.alternateMobile || "",
        designation: data.designation || "",
        linkedin: data.linkedin || "",
        bio: data.bio || "",
        companyName: data.companyDetails?.name || "",
        location: data.companyDetails?.location || "",
        website: data.companyDetails?.website || "",
        industry: data.companyDetails?.industry || "",
        companySize: data.companyDetails?.companySize || "",
        description: data.companyDetails?.description || "",
        profilePhotoId: data.profilePhotoId || "",
      });
    } catch {
      toast.error("Failed to load recruiter profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put("/recruiter/update-profile", profile);
      toast.success("Recruiter profile updated!");
      setIsEditing(null);
      fetchProfile();
      refreshUser(); // Sync navbar data
    } catch (err) {
      toast.error("Save failed");
    } finally {
      setIsEditing(null);
      fetchProfile();
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

      await api.put("/recruiter/upload-profile-pic", formData, {
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

  const menuLinks = [
    { id: "recruiter-info", label: "Recruiter Info", secondaryAction: "Edit" },
    { id: "company-details", label: "Company Details", secondaryAction: "Add" },
    { id: "about-org", label: "About Organization", secondaryAction: "Edit" },
  ];

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-indigo-600 animate-pulse uppercase tracking-[0.3em]">Syncing Profile...</div>;

  return (
    <div className="min-h-screen bg-[#fafbfc] pb-24 font-sans selection:bg-indigo-100 selection:text-indigo-900">

      {showCropModal && (
        <ImageCropModal
          image={imageToCrop}
          onCropComplete={onCropComplete}
          onCancel={() => setShowCropModal(false)}
        />
      )}

      {/* CLEAN PROFESSIONAL HEADER */}
      <div className="bg-white border-b border-slate-100 pt-16 pb-20 mt-1">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">

            {/* Circular Profile Pic Design */}
            <div className="relative group">
              <div className="w-40 h-40 bg-white rounded-full p-1.5 shadow-xl border border-slate-100">
                <div
                  onClick={() => fileInputRef.current.click()}
                  className="w-full h-full rounded-full overflow-hidden bg-slate-50 cursor-pointer relative group/img"
                >
                  {(profile.profilePhotoId && !imgError) ? (
                    <img
                      src={`http://localhost:5000/api/files/${profile.profilePhotoId}?t=${Date.now()}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110"
                      alt="Logo"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl opacity-10">🏢</div>
                  )}

                  <div className="absolute inset-0 bg-indigo-600/60 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all duration-300 backdrop-blur-sm">
                    <div className="flex flex-col items-center transform translate-y-4 group-hover/img:translate-y-0 transition-transform duration-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-white text-[9px] font-black uppercase tracking-[0.2em]">Change Logo</span>
                    </div>
                  </div>

                  {uploading && (
                    <div className="absolute inset-0 bg-white/90 flex items-center justify-center backdrop-blur-sm">
                      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              </div>

              <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg ring-4 ring-white">
                85%
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
                  Verified Recruiter
                </div>
                <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none">
                  {profile.fullName}
                </h1>
                <p className="text-lg font-bold text-slate-400 max-w-2xl leading-relaxed">
                  {profile.designation} <span className="text-indigo-600">@</span> {profile.companyName || "Your Organization"}
                </p>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-8 pt-2">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest mb-1">Location</span>
                  <span className="text-sm font-bold text-slate-600 flex items-center gap-1.5">
                    <span className="text-indigo-400">📍</span> {profile.location || "Global HQ"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest mb-1">Network</span>
                  <span className="text-sm font-bold text-slate-600 flex items-center gap-1.5">
                    <span className="text-indigo-400">🌐</span> {profile.website || "No link"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest mb-1">Organization</span>
                  <span className="text-sm font-bold text-slate-600 flex items-center gap-1.5">
                    <span className="text-indigo-400">👥</span> {profile.companySize || "Scale-up"}
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
            <QuickLinksSidebar links={menuLinks} activeId={activeSection}>
              {/* HIRING TIP - NOW INSIDE STICKY SIDEBAR */}
              <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 p-8 rounded-[32px] shadow-xl shadow-indigo-100 relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl mb-4">💡</div>
                  <h4 className="text-white font-black text-[10px] uppercase tracking-widest mb-2">Hiring Tip</h4>
                  <p className="text-indigo-100 text-[11px] leading-relaxed font-medium">
                    Adding a detailed organization bio increases application quality by 40%.
                  </p>
                  <button className="mt-6 w-full py-3 bg-white text-indigo-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-colors">Improve Now</button>
                </div>
              </div>
            </QuickLinksSidebar>
          </div>

          {/* MAIN AREA */}
          <div className="lg:col-span-9 space-y-12">

            {/* RECRUITER INFO */}
            <ProfileCard id="recruiter-info" title="Recruiter Info" onEdit={() => setIsEditing("recruiter-info")}>
              {isEditing === "recruiter-info" ? (
                <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fadeIn">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase">Representative Name</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm" value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase">Designation</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm" value={profile.designation} onChange={(e) => setProfile({ ...profile, designation: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase">Contact Number</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm" value={profile.mobile} onChange={(e) => setProfile({ ...profile, mobile: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase">LinkedIn Profile</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm" value={profile.linkedin} onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })} />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase">Alternate Number</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm" value={profile.alternateMobile} onChange={(e) => setProfile({ ...profile, alternateMobile: e.target.value })} />
                  </div>

                  <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                    <button type="button" onClick={() => setIsEditing(null)} className="text-sm font-bold text-slate-400 px-4">Cancel</button>
                    <button type="submit" className="bg-indigo-600 text-white px-8 py-2.5 rounded-lg text-sm font-bold shadow-md">Complete</button>
                  </div>
                </form>
              ) : (
                <div className="grid md:grid-cols-2 gap-y-6 pt-2">
                  <InfoRow label="Title" value={profile.designation} />
                  <InfoRow label="Phone" value={profile.mobile} />
                  <InfoRow label="LinkedIn" value={profile.linkedin} />
                  <InfoRow label="Alt Contact" value={profile.alternateMobile} />
                </div>
              )}
            </ProfileCard>

            {/* COMPANY DETAILS */}
            <ProfileCard id="company-details" title="Company Details" onEdit={() => setIsEditing("company-details")}>
              {isEditing === "company-details" ? (
                <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fadeIn">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase">Organization Name</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm" value={profile.companyName} onChange={(e) => setProfile({ ...profile, companyName: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase">Industry</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm" value={profile.industry} onChange={(e) => setProfile({ ...profile, industry: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase">HQ Location</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm" value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase">Company Size</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm" value={profile.companySize} onChange={(e) => setProfile({ ...profile, companySize: e.target.value })} />
                  </div>
                  <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                    <button type="button" onClick={() => setIsEditing(null)} className="text-sm font-bold text-slate-400 px-4">Cancel</button>
                    <button type="submit" className="bg-indigo-600 text-white px-8 py-2.5 rounded-lg text-sm font-bold shadow-md">Save Org Details</button>
                  </div>
                </form>
              ) : (
                <div className="grid md:grid-cols-2 gap-y-6 pt-2">
                  <InfoRow label="Company" value={profile.companyName} />
                  <InfoRow label="Vertical" value={profile.industry} />
                  <InfoRow label="Headquarters" value={profile.location} />
                  <InfoRow label="Team Size" value={profile.companySize} />
                </div>
              )}
            </ProfileCard>

            {/* ABOUT ORG */}
            <ProfileCard id="about-org" title="About Organization" onEdit={() => setIsEditing("about-org")}>
              {isEditing === "about-org" ? (
                <form onSubmit={handleUpdate} className="animate-fadeIn">
                  <textarea
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none h-32 mb-4"
                    value={profile.description}
                    onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                    placeholder="Write about your company culture and values..."
                  />
                  <div className="flex justify-end gap-3">
                    <button type="button" onClick={() => setIsEditing(null)} className="text-sm font-bold text-slate-400 px-4">Cancel</button>
                    <button type="submit" className="bg-indigo-600 text-white px-8 py-2.5 rounded-lg text-sm font-bold shadow-md">Complete Bio</button>
                  </div>
                </form>
              ) : (
                <p className="font-medium text-slate-600 leading-relaxed text-sm">
                  {profile.description || "Mention interesting facts about your organization to build brand awareness."}
                </p>
              )}
            </ProfileCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterProfile;