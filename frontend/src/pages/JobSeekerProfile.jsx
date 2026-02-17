// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const JobSeekerProfile = () => {
//   const token = localStorage.getItem("token");

//   const [loading, setLoading] = useState(false);
//   const [profile, setProfile] = useState({
//     headline: "",
//     skills: "",
//     highestQualification: "",
//     collegeName: "",
//     university: "",
//     graduationYear: "",
//     experience: 0,
//     currentCompany: "",
//     designation: "",
//     industry: "",
//     expectedSalary: "",
//     certifications: "",
//     github: "",
//     linkedin: "",
//   });

//   const fetchProfile = async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:5000/api/jobseeker/profile",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       const user = res.data;

//       setProfile({
//         headline: user?.profile?.headline || "",
//         skills: user?.profile?.skills?.join(", ") || "",
//         highestQualification:
//           user?.profile?.education?.highestQualification || "",
//         collegeName: user?.profile?.education?.collegeName || "",
//         university: user?.profile?.education?.university || "",
//         graduationYear:
//           user?.profile?.education?.graduationYear || "",
//         experience: user?.profile?.experience || 0,
//         currentCompany: user?.profile?.currentCompany || "",
//         designation: user?.profile?.designation || "",
//         industry: user?.profile?.industry || "",
//         expectedSalary: user?.profile?.expectedSalary || "",
//         certifications:
//           user?.profile?.certifications?.join(", ") || "",
//         github: user?.profile?.socialLinks?.github || "",
//         linkedin: user?.profile?.socialLinks?.linkedin || "",
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     if (token) fetchProfile();
//   }, []);

//   const handleChange = (e) => {
//     setProfile({ ...profile, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await axios.put(
//         "http://localhost:5000/api/jobseeker/update-profile",
//         {
//           ...profile,
//           skills: profile.skills.split(",").map((s) => s.trim()),
//           certifications: profile.certifications
//             .split(",")
//             .map((c) => c.trim()),
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       alert("Profile updated successfully");
//     } catch (error) {
//       alert("Update failed");
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-6">
//       <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl p-10">

//         <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
//           Job Seeker Profile
//         </h2>

//         <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

//           <Input label="Headline" name="headline" value={profile.headline} onChange={handleChange} />
//           <Input label="Skills (comma separated)" name="skills" value={profile.skills} onChange={handleChange} />
//           <Input label="Highest Qualification" name="highestQualification" value={profile.highestQualification} onChange={handleChange} />
//           <Input label="College Name" name="collegeName" value={profile.collegeName} onChange={handleChange} />
//           <Input label="University" name="university" value={profile.university} onChange={handleChange} />
//           <Input type="number" label="Graduation Year" name="graduationYear" value={profile.graduationYear} onChange={handleChange} />
//           <Input type="number" label="Experience (Years)" name="experience" value={profile.experience} onChange={handleChange} />
//           <Input label="Current Company" name="currentCompany" value={profile.currentCompany} onChange={handleChange} />
//           <Input label="Designation" name="designation" value={profile.designation} onChange={handleChange} />
//           <Input label="Industry" name="industry" value={profile.industry} onChange={handleChange} />
//           <Input type="number" label="Expected Salary" name="expectedSalary" value={profile.expectedSalary} onChange={handleChange} />
//           <Input label="Certifications (comma separated)" name="certifications" value={profile.certifications} onChange={handleChange} />
//           <Input label="GitHub URL" name="github" value={profile.github} onChange={handleChange} />
//           <Input label="LinkedIn URL" name="linkedin" value={profile.linkedin} onChange={handleChange} />

//           <div className="md:col-span-2">
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
//             >
//               {loading ? "Updating..." : "Update Profile"}
//             </button>
//           </div>

//         </form>
//       </div>
//     </div>
//   );
// };

// const Input = ({ label, ...props }) => (
//   <div>
//     <label className="block text-sm font-medium text-gray-600 mb-1">
//       {label}
//     </label>
//     <input
//       {...props}
//       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
//     />
//   </div>
// );

// export default JobSeekerProfile;


import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const JobSeekerProfile = () => {
  // ✅ FIXED TOKEN KEY
  const token = localStorage.getItem("accessToken");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  const [profile, setProfile] = useState({
    headline: "",
    skills: "",
    highestQualification: "",
    collegeName: "",
    university: "",
    graduationYear: "",
    experience: "",
    currentCompany: "",
    designation: "",
    industry: "",
    expectedSalary: "",
    certifications: "",
    github: "",
    linkedin: "",
  });

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    if (!token) {
      toast.error("Please login first");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/jobseeker/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const user = res.data;

        setProfile({
          headline: user?.profile?.headline || "",
          skills: user?.profile?.skills?.join(", ") || "",
          highestQualification:
            user?.profile?.education?.highestQualification || "",
          collegeName: user?.profile?.education?.collegeName || "",
          university: user?.profile?.education?.university || "",
          graduationYear:
            user?.profile?.education?.graduationYear || "",
          experience: user?.profile?.experience || "",
          currentCompany: user?.profile?.currentCompany || "",
          designation: user?.profile?.designation || "",
          industry: user?.profile?.industry || "",
          expectedSalary: user?.profile?.expectedSalary || "",
          certifications:
            user?.profile?.certifications?.join(", ") || "",
          github: user?.profile?.socialLinks?.github || "",
          linkedin: user?.profile?.socialLinks?.linkedin || "",
        });

      } catch (error) {
        toast.error("Session expired. Please login again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  /* ================= UPDATE PROFILE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axios.put(
        "http://localhost:5000/api/jobseeker/update-profile",
        {
          ...profile,
          skills: profile.skills
            ? profile.skills.split(",").map((s) => s.trim())
            : [],
          certifications: profile.certifications
            ? profile.certifications.split(",").map((c) => c.trim())
            : [],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Profile updated successfully ✅");
    } catch (error) {
      toast.error("Update failed ❌");
    }

    setSaving(false);
  };

  /* ================= UPLOAD PROFILE PHOTO ================= */
  const handlePhotoUpload = async () => {
    if (!profilePhoto) {
      toast.error("Select a photo first");
      return;
    }

    const formData = new FormData();
    formData.append("file", profilePhoto);

    setUploadingPhoto(true);

    try {
      await axios.put(
        "http://localhost:5000/api/jobseeker/upload-profile-pic",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Profile photo uploaded ✅");
      setProfilePhoto(null);
    } catch (error) {
      toast.error("Photo upload failed ❌");
    }

    setUploadingPhoto(false);
  };

  /* ================= UPLOAD RESUME ================= */
  const handleResumeUpload = async () => {
    if (!resumeFile) {
      toast.error("Select a resume first");
      return;
    }

    const formData = new FormData();
    formData.append("file", resumeFile);

    setUploadingResume(true);

    try {
      await axios.put(
        "http://localhost:5000/api/jobseeker/upload-resume",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Resume uploaded ✅");
      setResumeFile(null);
    } catch (error) {
      toast.error("Resume upload failed ❌");
    }

    setUploadingResume(false);
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-gray-600">
        Loading profile...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-10">

        <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
          Job Seeker Profile
        </h2>

        {/* PHOTO + RESUME SECTION */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">

          <div>
            <h3 className="font-semibold mb-2">Profile Photo</h3>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePhoto(e.target.files[0])}
              className="mb-2"
            />
            <button
              type="button"
              onClick={handlePhotoUpload}
              disabled={uploadingPhoto}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
            >
              {uploadingPhoto ? "Uploading..." : "Upload Photo"}
            </button>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Resume</h3>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResumeFile(e.target.files[0])}
              className="mb-2"
            />
            <button
              type="button"
              onClick={handleResumeUpload}
              disabled={uploadingResume}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
            >
              {uploadingResume ? "Uploading..." : "Upload Resume"}
            </button>
          </div>

        </div>

        {/* PROFILE FORM */}
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">

          <Input label="Headline" name="headline" value={profile.headline} onChange={handleChange} />
          <Input label="Skills (comma separated)" name="skills" value={profile.skills} onChange={handleChange} />

          <Input label="Highest Qualification" name="highestQualification" value={profile.highestQualification} onChange={handleChange} />
          <Input label="College Name" name="collegeName" value={profile.collegeName} onChange={handleChange} />

          <Input label="University" name="university" value={profile.university} onChange={handleChange} />
          <Input type="number" label="Graduation Year" name="graduationYear" value={profile.graduationYear} onChange={handleChange} />

          <Input type="number" label="Experience (Years)" name="experience" value={profile.experience} onChange={handleChange} />
          <Input label="Current Company" name="currentCompany" value={profile.currentCompany} onChange={handleChange} />

          <Input label="Designation" name="designation" value={profile.designation} onChange={handleChange} />
          <Input label="Industry" name="industry" value={profile.industry} onChange={handleChange} />

          <Input type="number" label="Expected Salary" name="expectedSalary" value={profile.expectedSalary} onChange={handleChange} />
          <Input label="Certifications (comma separated)" name="certifications" value={profile.certifications} onChange={handleChange} />

          <Input label="GitHub URL" name="github" value={profile.github} onChange={handleChange} />
          <Input label="LinkedIn URL" name="linkedin" value={profile.linkedin} onChange={handleChange} />

          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition duration-300"
            >
              {saving ? "Saving..." : "Update Profile"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
    />
  </div>
);

export default JobSeekerProfile;
