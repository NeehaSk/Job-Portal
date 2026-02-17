// // import { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import api from "../api/apiCheck";
// // import toast from "react-hot-toast";

// // function Login() {
// //   const navigate = useNavigate();

// //   const [role, setRole] = useState("jobseeker");
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [loading, setLoading] = useState(false);

// //   const handleLogin = async (e) => {
// //     e.preventDefault();

// //     if (!email || !password) {
// //       toast.error("All fields are required");
// //       return;
// //     }

// //     try {
// //       setLoading(true);

// //       const res = await api.post("/auth/login", {
// //         email,
// //         password,
// //         role,
// //       });

// //       // Save access token
// //       localStorage.setItem("accessToken", res.data.token);

// //       toast.success("Login successful 🎉");

// //       // Redirect based on role
// //       if (role === "recruiter") {
// //         navigate("/recruiter-dashboard");
// //       } else {
// //         navigate("/jobseeker-dashboard");
// //       }

// //     } catch (error) {
// //       toast.error(
// //         error.response?.data?.message || "Login failed"
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gray-100">
// //       <form
// //         onSubmit={handleLogin}
// //         className="w-[380px] bg-white p-6 rounded-xl shadow-md"
// //       >
// //         <h2 className="text-2xl font-semibold text-center mb-6">
// //           Login
// //         </h2>

// //         {/* Role Switch */}
// //         <div className="flex gap-2 mb-4">
// //           <button
// //             type="button"
// //             onClick={() => setRole("jobseeker")}
// //             className={`flex-1 py-2 rounded-lg ${
// //               role === "jobseeker"
// //                 ? "bg-blue-600 text-white"
// //                 : "bg-gray-200"
// //             }`}
// //           >
// //             Job Seeker
// //           </button>

// //           <button
// //             type="button"
// //             onClick={() => setRole("recruiter")}
// //             className={`flex-1 py-2 rounded-lg ${
// //               role === "recruiter"
// //                 ? "bg-blue-600 text-white"
// //                 : "bg-gray-200"
// //             }`}
// //           >
// //             Recruiter
// //           </button>
// //         </div>

// //         {/* Email */}
// //         <input
// //           type="email"
// //           placeholder="Email"
// //           className="w-full border p-2 rounded-lg mb-3"
// //           value={email}
// //           onChange={(e) => setEmail(e.target.value)}
// //         />

// //         {/* Password */}
// //         <input
// //           type="password"
// //           placeholder="Password"
// //           className="w-full border p-2 rounded-lg mb-4"
// //           value={password}
// //           onChange={(e) => setPassword(e.target.value)}
// //         />

// //         <button
// //           disabled={loading}
// //           className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-black transition disabled:opacity-50"
// //         >
// //           {loading ? "Logging in..." : "Login"}
// //         </button>
// //       </form>
// //     </div>
// //   );
// // }

// // export default Login;

// // import { useState } from "react";
// // import api from "../api/apiCheck";
// // import toast from "react-hot-toast";

// // function Login() {
// //   const [role, setRole] = useState("jobseeker");
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [loading, setLoading] = useState(false);

// //   const handleLogin = async (e) => {
// //     e.preventDefault();

// //     if (!email || !password) {
// //       toast.error("All fields are required");
// //       return;
// //     }

// //     try {
// //       setLoading(true);

// //       const res = await api.post("/auth/login", {
// //         email,
// //         password,
// //         role,
// //       });

// //       if (!res.data || !res.data.token) {
// //         toast.error("Invalid server response");
// //         return;
// //       }

// //       // ✅ Store token & role (ONLY ONCE)
// //       localStorage.setItem("accessToken", res.data.token);
// //       localStorage.setItem("userRole", role);

// //       toast.success("Login successful 🎉");

// //     } catch (error) {
// //       toast.error(
// //         error.response?.data?.message || "Login failed"
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gray-100">
// //       <form
// //         onSubmit={handleLogin}
// //         className="w-[380px] bg-white p-6 rounded-xl shadow-md"
// //       >
// //         <h2 className="text-2xl font-semibold text-center mb-6">
// //           Login
// //         </h2>

// //         {/* Role Switch */}
// //         <div className="flex gap-2 mb-4">
// //           <button
// //             type="button"
// //             onClick={() => setRole("jobseeker")}
// //             className={`flex-1 py-2 rounded-lg transition ${
// //               role === "jobseeker"
// //                 ? "bg-blue-600 text-white"
// //                 : "bg-gray-200 hover:bg-gray-300"
// //             }`}
// //           >
// //             Job Seeker
// //           </button>

// //           <button
// //             type="button"
// //             onClick={() => setRole("recruiter")}
// //             className={`flex-1 py-2 rounded-lg transition ${
// //               role === "recruiter"
// //                 ? "bg-blue-600 text-white"
// //                 : "bg-gray-200 hover:bg-gray-300"
// //             }`}
// //           >
// //             Recruiter
// //           </button>
// //         </div>

// //         {/* Email */}
// //         <input
// //           type="email"
// //           placeholder="Email"
// //           className="w-full border border-gray-300 p-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
// //           value={email}
// //           onChange={(e) => setEmail(e.target.value)}
// //         />

// //         {/* Password */}
// //         <input
// //           type="password"
// //           placeholder="Password"
// //           className="w-full border border-gray-300 p-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
// //           value={password}
// //           onChange={(e) => setPassword(e.target.value)}
// //         />

// //         <button
// //           disabled={loading}
// //           className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-black transition disabled:opacity-50"
// //         >
// //           {loading ? "Logging in..." : "Login"}
// //         </button>
// //       </form>
// //     </div>
// //   );
// // }

// // export default Login;

// import { useState } from "react";
// import { Link } from "react-router-dom";
// import api from "../api/apiCheck";
// import toast from "react-hot-toast";

// function Login() {
//   const [role, setRole] = useState("jobseeker");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     if (!email || !password) {
//       toast.error("All fields are required");
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await api.post("/auth/login", {
//         email,
//         password,
//         role,
//       });

//       if (!res.data || !res.data.token) {
//         toast.error("Invalid server response");
//         return;
//       }

//       localStorage.setItem("accessToken", res.data.token);
//       localStorage.setItem("userRole", role);

//       toast.success("Login successful 🎉");

//     } catch (error) {
//       toast.error(
//         error.response?.data?.message || "Login failed"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <form
//         onSubmit={handleLogin}
//         className="w-[380px] bg-white p-6 rounded-xl shadow-md"
//       >
//         <h2 className="text-2xl font-semibold text-center mb-6">
//           Login
//         </h2>

//         {/* Role Switch */}
//         <div className="flex gap-2 mb-4">
//           <button
//             type="button"
//             onClick={() => setRole("jobseeker")}
//             className={`flex-1 py-2 rounded-lg transition ${
//               role === "jobseeker"
//                 ? "bg-blue-600 text-white"
//                 : "bg-gray-200 hover:bg-gray-300"
//             }`}
//           >
//             Job Seeker
//           </button>

//           <button
//             type="button"
//             onClick={() => setRole("recruiter")}
//             className={`flex-1 py-2 rounded-lg transition ${
//               role === "recruiter"
//                 ? "bg-blue-600 text-white"
//                 : "bg-gray-200 hover:bg-gray-300"
//             }`}
//           >
//             Recruiter
//           </button>
//         </div>

//         {/* Email */}
//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full border border-gray-300 p-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         {/* Password */}
//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full border border-gray-300 p-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <button
//           disabled={loading}
//           className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-black transition disabled:opacity-50"
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>

//         {/* 🔥 Forgot Password Link */}
//         <div className="text-right mt-3">
//           <Link
//             to="/forgot-password"
//             className="text-sm text-blue-600 hover:underline"
//           >
//             Forgot Password?
//           </Link>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default Login;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/apiCheck";
import toast from "react-hot-toast";

function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("jobseeker");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        email,
        password,
        role,
      });

      if (!res.data || !res.data.token) {
        toast.error("Invalid server response");
        return;
      }

      // ✅ IMPORTANT: store as "token"
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userRole", role);

      toast.success("Login successful 🎉");

      // ✅ redirect properly
      if (role === "jobseeker") {
        navigate("/jobseeker/profile");
      } else {
        navigate("/"); // change if recruiter dashboard exists
      }

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="w-[380px] bg-white p-6 rounded-xl shadow-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">
          Login
        </h2>

        {/* Role Switch */}
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setRole("jobseeker")}
            className={`flex-1 py-2 rounded-lg transition ${
              role === "jobseeker"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Job Seeker
          </button>

          <button
            type="button"
            onClick={() => setRole("recruiter")}
            className={`flex-1 py-2 rounded-lg transition ${
              role === "recruiter"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Recruiter
          </button>
        </div>

        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 p-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border border-gray-300 p-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          disabled={loading}
          className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-black transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="text-right mt-3">
          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
