
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  // not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // role mismatch
  if (allowedRole && allowedRole !== "any" && user.role !== allowedRole) {

    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    }

    if (user.role === "recruiter") {
      return <Navigate to="/recruiter/profile" />;
    }

    if (user.role === "jobseeker") {
      return <Navigate to="/jobs" />;
    }
  }

  return children;
};

export default ProtectedRoute;