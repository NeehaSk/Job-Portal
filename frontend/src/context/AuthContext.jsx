import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/apiCheck";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔎 Check authentication on app load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/auth/me"); // protected route
      setUser(res.data.user);
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userRole");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Login
  const loginUser = (data) => {
    localStorage.setItem("accessToken", data.token);
    localStorage.setItem("userRole", data.user.role);
    setUser(data.user);

    if (data.user.role === "recruiter") {
      navigate("/recruiter-dashboard");
    } else {
      navigate("/jobseeker-dashboard");
    }
  };

  // ✅ Logout
  const logoutUser = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.log(error);
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("userRole");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
