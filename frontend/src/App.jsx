


import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ForgotPassword from "./pages/ForgotPassword";
import VerifyReset from "./pages/VerifyReset";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import JobSeekerProfile from "./pages/JobSeekerProfile";
import RecruiterProfile from "./pages/RecruiterProfile";
import Dashboard from "./pages/Dashboard";

import Jobs from "./pages/Jobs";
import MyApplications from "./pages/MyApplications";
import Notifications from "./pages/Notifications";

import RecruiterJobs from "./pages/RecruiterJobs";
import RecruiterApplicants from "./pages/RecruiterApplicants";
import JobApplicants from "./pages/JobApplicants";
import CreateJob from "./pages/CreateJob";
import JobDetails from "./pages/JobDetails";
import PublicSeekerProfile from "./pages/PublicSeekerProfile";
import SeekerATSView from "./pages/SeekerATSView";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 3000 }} />
      <Navbar />

      <Routes>
        {/* <Route path="/" element={<Navigate to="/login" />} /> */}
        <Route path="/" element={<Home />} />
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-reset" element={<VerifyReset />} />

        {/* Job Seeker Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRole="jobseeker">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobseeker/profile"
          element={
            <ProtectedRoute allowedRole="jobseeker">
              <JobSeekerProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/jobs"
          element={
            <ProtectedRoute allowedRole="jobseeker">
              <Jobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-applications"
          element={
            <ProtectedRoute allowedRole="jobseeker">
              <MyApplications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-applications/:applicationId/tracker"
          element={
            <ProtectedRoute allowedRole="jobseeker">
              <SeekerATSView />
            </ProtectedRoute>
          }
        />

        {/* Recruiter Routes */}
        <Route
          path="/recruiter/profile"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <RecruiterProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/jobs"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <RecruiterJobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/create-job"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <CreateJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/applicants"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <RecruiterApplicants />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute allowedRole="any">
              <Notifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/job/:jobId/applicants"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <JobApplicants />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/seeker/:id"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <PublicSeekerProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/job/:jobId"
          element={
            <ProtectedRoute allowedRole="any">
              <JobDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;