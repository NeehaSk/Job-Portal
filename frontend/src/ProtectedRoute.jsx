// import { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import { AuthContext } from "./context/AuthContext";

// const ProtectedRoute = ({ children, allowedRole }) => {
//   const { user, loading } = useContext(AuthContext);

//   // Wait until auth check completes
//   if (loading) {
//     return <div className="text-center mt-10">Loading...</div>;
//   }

//   // Not logged in
//   if (!user) {
//     return <Navigate to="/login" />;
//   }

//   // Role restriction
//   if (allowedRole && user.role !== allowedRole) {
//     return <Navigate to="/" />;
//   }

//   return children;
// };

// export default ProtectedRoute;

import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
