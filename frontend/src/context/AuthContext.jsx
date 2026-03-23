
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/apiCheck";

// ✅ Create Context
export const AuthContext = createContext();

// ✅ Provider Component
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // -----------------------------------
  // 🔎 Check authentication on app load
  // -----------------------------------
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");

    // No token → stop loading
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // protected route
      const res = await api.get("/auth/me");

      setUser(res.data.user);
    } catch (error) {
      console.log("Auth check failed:", error);

      // remove invalid token
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------
  // 🔄 Refresh user data (call after profile updates)
  // -----------------------------------
  const refreshUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
    } catch (error) {
      console.error("Refresh user failed:", error);
    }
  };

  // -----------------------------------
  // ✅ LOGIN FUNCTION
  // -----------------------------------
  const loginUser = (data) => {
    // Save token
    localStorage.setItem("token", data.token);
    localStorage.setItem("userRole", data.user.role);
    localStorage.setItem("userId", data.user.id);

    setUser(data.user);

    // Redirect based on role
    if (data.user.role === "recruiter") {
      navigate("/recruiter/profile");
    } else {
      navigate("/jobs");
    }

  };

  // -----------------------------------
  // ✅ LOGOUT FUNCTION
  // -----------------------------------
  const logoutUser = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.log("Logout error:", error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");

    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginUser,
        logoutUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
