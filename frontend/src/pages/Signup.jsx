// // import { useState } from "react";
  


// // function Signup() {
// //   // role
// //   const [role, setRole] = useState("recruiter");

// //   // common fields
// //   const [fullName, setFullName] = useState("");
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [mobile, setMobile] = useState("");

// //   // recruiter-specific
// //   const [designation, setDesignation] = useState("");
// //   const [companyName, setCompanyName] = useState("");
// //   const [companyWebsite, setCompanyWebsite] = useState("");
// //   const [industry, setIndustry] = useState("");
// //   const [location, setLocation] = useState("");

// //   // ui states
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");
// //   const [success, setSuccess] = useState("");

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setError("");
// //     setSuccess("");

// //     // basic validation
// //     if (!fullName || !email || !password || !mobile) {
// //       setError("Full name, email and password are required");
// //       return;
// //     }

// //     if (role === "recruiter") {
// //       if (!designation || !companyName) {
// //         setError("Recruiter details are incomplete");
// //         return;
// //       }
// //     }

// //     // payload construction (IMPORTANT)
// //     let payload = {
// //       fullName,
// //       email,
// //       mobile,
// //       password,
// //       role,
// //     };
                                   
// //     if (role === "recruiter") {
// //       payload = {
// //         ...payload,
// //         designation,
// //         companyDetails: {
// //           name: companyName,
// //           website: companyWebsite,
// //           industry,
// //           location,
// //         },
// //       };
// //     }

// //     try {
// //       setLoading(true);

// //       //   const res = await fetch(
// //       //     "http://localhost:5000/api/auth/register-recruiter",
// //       //     {
// //       //       method: "POST",
// //       //       headers: {
// //       //         "Content-Type": "application/json",
// //       //       },
// //       //       body: JSON.stringify(payload),
// //       //     }
// //       //   );
// //       const res = await fetch(
// //         "http://localhost:5000/api/auth/signup-recruiter",
// //         {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify(payload),
// //         }
// //       );
// //       const data = await res.json();

// //       if (!res.ok) {
// //         setError(data.message || "Signup failed");
// //       } else {
// //         setSuccess("Signup successful!");

// //         // reset form
// //         setFullName("");
// //         setEmail("");
// //         setPassword("");
// //         setDesignation("");
// //         setCompanyName("");
// //         setCompanyWebsite("");
// //         setIndustry("");
// //         setLocation("");
// //       }
// //     } catch (err) {
// //       setError("Server not reachable");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div style={styles.container}>
// //       <form style={styles.form} onSubmit={handleSubmit}>
// //         <h2 style={styles.title}>Signup</h2>

// //         {/* Role selection */}
// //         <div style={styles.roleBox}>
// //           <button
// //             type="button"
// //             style={role === "recruiter" ? styles.active : styles.inactive}
// //             onClick={() => setRole("recruiter")}
// //           >
// //             Recruiter
// //           </button>

// //           <button
// //             type="button"
// //             style={styles.disabled}
// //             disabled
// //           >
// //             Job Seeker (soon)
// //           </button>
// //         </div>

// //         {error && <p style={styles.error}>{error}</p>}
// //         {success && <p style={styles.success}>{success}</p>}

// //         {/* Common fields */}
// //         <input
// //           placeholder="Full Name"
// //           value={fullName}
// //           onChange={(e) => setFullName(e.target.value)}
// //           style={styles.input}
// //         />

// //         <input
// //           type="email"
// //           placeholder="Email"
// //           value={email}
// //           onChange={(e) => setEmail(e.target.value)}
// //           style={styles.input}
// //         />

// //         <input
// //           type="password"
// //           placeholder="Password"
// //           value={password}
// //           onChange={(e) => setPassword(e.target.value)}
// //           style={styles.input}
// //         />
// //         <input
// //           className="w-full p-2 border mb-2 rounded"
// //           placeholder="Mobile Number"
// //           value={mobile}
// //           onChange={(e) => setMobile(e.target.value)}
// //         />

// //         {/* Recruiter fields */}
// //         {role === "recruiter" && (
// //           <>
// //             <input
// //               placeholder="Designation"
// //               value={designation}
// //               onChange={(e) => setDesignation(e.target.value)}
// //               style={styles.input}
// //             />

// //             <input
// //               placeholder="Company Name"
// //               value={companyName}
// //               onChange={(e) => setCompanyName(e.target.value)}
// //               style={styles.input}
// //             />

// //             <input
// //               placeholder="Company Website"
// //               value={companyWebsite}
// //               onChange={(e) => setCompanyWebsite(e.target.value)}
// //               style={styles.input}
// //             />

// //             <input
// //               placeholder="Industry"
// //               value={industry}
// //               onChange={(e) => setIndustry(e.target.value)}
// //               style={styles.input}
// //             />

// //             <input
// //               placeholder="Location"
// //               value={location}
// //               onChange={(e) => setLocation(e.target.value)}
// //               style={styles.input}
// //             />
// //           </>
// //         )}

// //         <button style={styles.button} disabled={loading}>
// //           {loading ? "Signing up..." : "Signup"}
// //         </button>
// //       </form>
// //     </div>
// //   );
// // }

// // const styles = {
// //   container: {
// //     minHeight: "100vh",
// //     display: "flex",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     background: "#f3f4f6",
// //   },
// //   form: {
// //     width: 380,
// //     background: "#fff",
// //     padding: 25,
// //     borderRadius: 8,
// //     boxShadow: "0 0 12px rgba(0,0,0,0.1)",
// //   },
// //   title: {
// //     textAlign: "center",
// //     marginBottom: 15,
// //   },
// //   roleBox: {
// //     display: "flex",
// //     gap: 10,
// //     marginBottom: 15,
// //   },
// //   active: {
// //     flex: 1,
// //     padding: 8,
// //     background: "#2563eb",
// //     color: "#fff",
// //     border: "none",
// //     cursor: "pointer",
// //   },
// //   inactive: {
// //     flex: 1,
// //     padding: 8,
// //     background: "#e5e7eb",
// //     border: "none",
// //     cursor: "pointer",
// //   },
// //   disabled: {
// //     flex: 1,
// //     padding: 8,
// //     background: "#e5e7eb",
// //     border: "none",
// //     cursor: "not-allowed",
// //   },
// //   input: {
// //     width: "100%",
// //     padding: 10,
// //     marginBottom: 10,
// //     border: "1px solid #ccc",
// //     borderRadius: 4,
// //   },
// //   button: {
// //     width: "100%",
// //     padding: 10,
// //     background: "#111827",
// //     color: "#fff",
// //     border: "none",
// //     cursor: "pointer",
// //   },
// //   error: {
// //     color: "red",
// //     textAlign: "center",
// //     marginBottom: 10,
// //   },
// //   success: {
// //     color: "green",
// //     textAlign: "center",
// //     marginBottom: 10,
// //   },
// // };

// // export default Signup;

// // import { useState } from "react";
// // import axios from "axios";

// // function Signup() {
// //   // role (fixed recruiter)
// //   const role = "recruiter";

// //   // common fields
// //   const [fullName, setFullName] = useState("");
// //   const [email, setEmail] = useState("");
// //   const [otp, setOtp] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [mobile, setMobile] = useState("");

// //   // recruiter-specific
// //   const [designation, setDesignation] = useState("");
// //   const [companyName, setCompanyName] = useState("");
// //   const [location, setLocation] = useState("");

// //   // otp states
// //   const [otpSent, setOtpSent] = useState(false);
// //   const [otpVerified, setOtpVerified] = useState(false);

// //   // ui states
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");
// //   const [success, setSuccess] = useState("");

// //   /* =========================
// //      SEND OTP
// //   ========================= */
// //   const handleSendOtp = async () => {
// //     setError("");
// //     if (!fullName || !email) {
// //       setError("Full name and email are required");
// //       return;
// //     }

// //     try {
// //       setLoading(true);
// //       await axios.post(
// //         "http://localhost:5000/api/auth/recruiter/send-otp",
// //         { fullName, email }
// //       );
// //       setOtpSent(true);
// //       setSuccess("OTP sent to email");
// //     } catch (err) {
// //       setError("Failed to send OTP");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   /* =========================
// //      VERIFY OTP
// //   ========================= */
// //   const handleVerifyOtp = async () => {
// //     setError("");
// //     if (!otp) {
// //       setError("Enter OTP");
// //       return;
// //     }

// //     try {
// //       setLoading(true);
// //       await axios.post(
// //         "http://localhost:5000/api/auth/recruiter/verify-otp",
// //         { email, otp }
// //       );
// //       setOtpVerified(true);
// //       setSuccess("Email verified successfully");
// //     } catch (err) {
// //       setError("Invalid or expired OTP");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   /* =========================
// //      SIGNUP
// //   ========================= */
// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setError("");
// //     setSuccess("");

// //     if (
// //       !password ||
// //       !mobile ||
// //       !designation ||
// //       !companyName ||
// //       !location
// //     ) {
// //       setError("All fields are required");
// //       return;
// //     }

// //     try {
// //       setLoading(true);

// //       const payload = {
// //         fullName,
// //         email,
// //         password,
// //         mobile,
// //         role,
// //         designation,
// //         companyDetails: {
// //           name: companyName,
// //           location,
// //         },
// //       };

// //       await axios.post(
// //         "http://localhost:5000/api/auth/signup-recruiter",
// //         payload
// //       );

// //       setSuccess("Signup successful");

// //       // reset
// //       setFullName("");
// //       setEmail("");
// //       setOtp("");
// //       setPassword("");
// //       setMobile("");
// //       setDesignation("");
// //       setCompanyName("");
// //       setLocation("");
// //       setOtpSent(false);
// //       setOtpVerified(false);
// //     } catch (err) {
// //       setError("Signup failed");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div style={styles.container}>
// //       <form style={styles.form} onSubmit={handleSubmit}>
// //         <h2 style={styles.title}>Recruiter Signup</h2>

// //         {error && <p style={styles.error}>{error}</p>}
// //         {success && <p style={styles.success}>{success}</p>}

// //         {/* Name */}
// //         <input
// //           placeholder="Full Name"
// //           value={fullName}
// //           onChange={(e) => setFullName(e.target.value)}
// //           style={styles.input}
// //           disabled={otpVerified}
// //         />

// //         {/* Email + OTP */}
// //         <div style={{ display: "flex", gap: 8 }}>
// //           <input
// //             type="email"
// //             placeholder="Email"
// //             value={email}
// //             onChange={(e) => setEmail(e.target.value)}
// //             style={{ ...styles.input, flex: 1 }}
// //             disabled={otpVerified}
// //           />
// //           <button
// //             type="button"
// //             onClick={handleSendOtp}
// //             disabled={loading || otpVerified}
// //             style={styles.otpBtn}
// //           >
// //             {otpSent ? "Resend OTP" : "Send OTP"}
// //           </button>
// //         </div>

// //         {/* OTP input */}
// //         {otpSent && !otpVerified && (
// //           <div style={{ display: "flex", gap: 8 }}>
// //             <input
// //               placeholder="Enter OTP"
// //               value={otp}
// //               onChange={(e) => setOtp(e.target.value)}
// //               style={{ ...styles.input, flex: 1 }}
// //             />
// //             <button
// //               type="button"
// //               onClick={handleVerifyOtp}
// //               style={styles.otpBtn}
// //             >
// //               Verify
// //             </button>
// //           </div>
// //         )}

// //         {/* Remaining fields (locked until OTP verified) */}
// //         <input
// //           type="password"
// //           placeholder="Password"
// //           value={password}
// //           disabled={!otpVerified}
// //           onChange={(e) => setPassword(e.target.value)}
// //           style={styles.input}
// //         />

// //         <input
// //           placeholder="Mobile"
// //           value={mobile}
// //           disabled={!otpVerified}
// //           onChange={(e) => setMobile(e.target.value)}
// //           style={styles.input}
// //         />

// //         <input
// //           placeholder="Designation"
// //           value={designation}
// //           disabled={!otpVerified}
// //           onChange={(e) => setDesignation(e.target.value)}
// //           style={styles.input}
// //         />

// //         <input
// //           placeholder="Company Name"
// //           value={companyName}
// //           disabled={!otpVerified}
// //           onChange={(e) => setCompanyName(e.target.value)}
// //           style={styles.input}
// //         />

// //         <input
// //           placeholder="Location"
// //           value={location}
// //           disabled={!otpVerified}
// //           onChange={(e) => setLocation(e.target.value)}
// //           style={styles.input}
// //         />

// //         <button
// //           style={styles.button}
// //           disabled={!otpVerified || loading}
// //         >
// //           Signup
// //         </button>
// //       </form>
// //     </div>
// //   );
// // }

// // /* =========================
// //    STYLES (UNCHANGED FEEL)
// // ========================= */
// // const styles = {
// //   container: {
// //     minHeight: "100vh",
// //     display: "flex",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     background: "#f3f4f6",
// //   },
// //   form: {
// //     width: 380,
// //     background: "#fff",
// //     padding: 25,
// //     borderRadius: 8,
// //     boxShadow: "0 0 12px rgba(0,0,0,0.1)",
// //   },
// //   title: {
// //     textAlign: "center",
// //     marginBottom: 15,
// //   },
// //   input: {
// //     width: "100%",
// //     padding: 10,
// //     marginBottom: 10,
// //     border: "1px solid #ccc",
// //     borderRadius: 4,
// //   },
// //   otpBtn: {
// //     padding: "10px 12px",
// //     background: "#2563eb",
// //     color: "#fff",
// //     border: "none",
// //     cursor: "pointer",
// //   },
// //   button: {
// //     width: "100%",
// //     padding: 10,
// //     background: "#111827",
// //     color: "#fff",
// //     border: "none",
// //     cursor: "pointer",
// //   },
// //   error: {
// //     color: "red",
// //     textAlign: "center",
// //     marginBottom: 10,
// //   },
// //   success: {
// //     color: "green",
// //     textAlign: "center",
// //     marginBottom: 10,
// //   },
// // };

// // export default Signup;


// import { useState } from "react";
// import axios from "axios";

// function Signup() {
//   // role (fixed recruiter)
//   const role = "recruiter";

//   // common fields
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [password, setPassword] = useState("");
//   const [mobile, setMobile] = useState("");

//   // recruiter-specific
//   const [designation, setDesignation] = useState("");
//   const [companyName, setCompanyName] = useState("");
//   const [location, setLocation] = useState("");

//   // otp states
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpVerified, setOtpVerified] = useState(false);

//   // ui states
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   /* =========================
//      SEND OTP
//   ========================= */
//   const handleSendOtp = async () => {
//     setError("");
//     if (!fullName || !email) {
//       setError("Full name and email are required");
//       return;
//     }

//     try {
//       setLoading(true);
//       await axios.post(
//         "http://localhost:5000/api/auth/recruiter/send-otp",
//         { fullName, email }
//       );
//       setOtpSent(true);
//       setSuccess("OTP sent to email");
//     } catch (err) {
//       setError("Failed to send OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* =========================
//      VERIFY OTP
//   ========================= */
//   const handleVerifyOtp = async () => {
//     setError("");
//     if (!otp) {
//       setError("Enter OTP");
//       return;
//     }

//     try {
//       setLoading(true);
//       await axios.post(
//         "http://localhost:5000/api/auth/recruiter/verify-otp",
//         { email, otp }
//       );
//       setOtpVerified(true);
//       setSuccess("Email verified successfully");
//     } catch (err) {
//       setError("Invalid or expired OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* =========================
//      SIGNUP
//   ========================= */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (
//       !password ||
//       !mobile ||
//       !designation ||
//       !companyName ||
//       !location
//     ) {
//       setError("All fields are required");
//       return;
//     }

//     try {
//       setLoading(true);

//       const payload = {
//         fullName,
//         email,
//         password,
//         mobile,
//         role,
//         designation,
//         companyDetails: {
//           name: companyName,
//           location,
//         },
//       };

//       await axios.post(
//         "http://localhost:5000/api/auth/signup-recruiter",
//         payload
//       );

//       setSuccess("Signup successful");

//       // reset
//       setFullName("");
//       setEmail("");
//       setOtp("");
//       setPassword("");
//       setMobile("");
//       setDesignation("");
//       setCompanyName("");
//       setLocation("");
//       setOtpSent(false);
//       setOtpVerified(false);
//     } catch (err) {
//       setError("Signup failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <form style={styles.form} onSubmit={handleSubmit}>
//         <h2 style={styles.title}>Recruiter Signup</h2>

//         {error && <p style={styles.error}>{error}</p>}
//         {success && <p style={styles.success}>{success}</p>}

//         {/* Name */}
//         <input
//           placeholder="Full Name"
//           value={fullName}
//           onChange={(e) => setFullName(e.target.value)}
//           style={styles.input}
//           disabled={otpVerified}
//         />

//         {/* Email + OTP */}
//         <div style={{ display: "flex", gap: 8 }}>
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             style={{ ...styles.input, flex: 1 }}
//             disabled={otpVerified}
//           />
//           <button
//             type="button"
//             onClick={handleSendOtp}
//             disabled={loading || otpVerified}
//             style={styles.otpBtn}
//           >
//             {otpSent ? "Resend OTP" : "Send OTP"}
//           </button>
//         </div>

//         {/* OTP input */}
//         {otpSent && !otpVerified && (
//           <div style={{ display: "flex", gap: 8 }}>
//             <input
//               placeholder="Enter OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               style={{ ...styles.input, flex: 1 }}
//             />
//             <button
//               type="button"
//               onClick={handleVerifyOtp}
//               style={styles.otpBtn}
//             >
//               Verify
//             </button>
//           </div>
//         )}

//         {/* Remaining fields (locked until OTP verified) */}
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           disabled={!otpVerified}
//           onChange={(e) => setPassword(e.target.value)}
//           style={styles.input}
//         />

//         <input
//           placeholder="Mobile"
//           value={mobile}
//           disabled={!otpVerified}
//           onChange={(e) => setMobile(e.target.value)}
//           style={styles.input}
//         />

//         <input
//           placeholder="Designation"
//           value={designation}
//           disabled={!otpVerified}
//           onChange={(e) => setDesignation(e.target.value)}
//           style={styles.input}
//         />

//         <input
//           placeholder="Company Name"
//           value={companyName}
//           disabled={!otpVerified}
//           onChange={(e) => setCompanyName(e.target.value)}
//           style={styles.input}
//         />

//         <input
//           placeholder="Location"
//           value={location}
//           disabled={!otpVerified}
//           onChange={(e) => setLocation(e.target.value)}
//           style={styles.input}
//         />

//         <button
//           style={styles.button}
//           disabled={!otpVerified || loading}
//         >
//           Signup
//         </button>
//       </form>
//     </div>
//   );
// }

// /* =========================
//    STYLES (UNCHANGED FEEL)
// ========================= */
// const styles = {
//   container: {
//     minHeight: "100vh",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     background: "#f3f4f6",
//   },
//   form: {
//     width: 380,
//     background: "#fff",
//     padding: 25,
//     borderRadius: 8,
//     boxShadow: "0 0 12px rgba(0,0,0,0.1)",
//   },
//   title: {
//     textAlign: "center",
//     marginBottom: 15,
//   },
//   input: {
//     width: "100%",
//     padding: 10,
//     marginBottom: 10,
//     border: "1px solid #ccc",
//     borderRadius: 4,
//   },
//   otpBtn: {
//     padding: "10px 12px",
//     background: "#2563eb",
//     color: "#fff",
//     border: "none",
//     cursor: "pointer",
//   },
//   button: {
//     width: "100%",
//     padding: 10,
//     background: "#111827",
//     color: "#fff",
//     border: "none",
//     cursor: "pointer",
//   },
//   error: {
//     color: "red",
//     textAlign: "center",
//     marginBottom: 10,
//   },
//   success: {
//     color: "green",
//     textAlign: "center",
//     marginBottom: 10,
//   },
// };

// export default Signup;


// import { useState } from "react";
// import axios from "axios";

// function Signup() {
//   /* =========================
//      ROLE
//   ========================= */
//   const [role, setRole] = useState("jobseeker");

//   /* =========================
//      COMMON FIELDS
//   ========================= */
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [password, setPassword] = useState("");
//   const [mobile, setMobile] = useState("");

//   /* =========================
//      JOB SEEKER FIELDS
//   ========================= */
//   const [gender, setGender] = useState("");
//   const [qualification, setQualification] = useState("");
//   const [status, setStatus] = useState("");
//   const [location, setLocation] = useState("");

//   /* =========================
//      RECRUITER FIELDS
//   ========================= */
//   const [designation, setDesignation] = useState("");
//   const [companyName, setCompanyName] = useState("");

//   /* =========================
//      OTP STATES
//   ========================= */
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpVerified, setOtpVerified] = useState(false);

//   /* =========================
//      UI STATES
//   ========================= */
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   /* =========================
//      SEND OTP
//   ========================= */
//   const handleSendOtp = async () => {
//     setError("");
//     if (!fullName || !email) {
//       setError("Full name and email required");
//       return;
//     }

//     try {
//       setLoading(true);
//       await axios.post(
//         role === "recruiter"
//           ? "http://localhost:5000/api/auth/recruiter/send-otp"
//           : "http://localhost:5000/api/auth/jobseeker/send-otp",
//         { fullName, email }
//       );
//       setOtpSent(true);
//       setSuccess("OTP sent to email");
//     } catch {
//       setError("Failed to send OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* =========================
//      VERIFY OTP
//   ========================= */
//   const handleVerifyOtp = async () => {
//     setError("");
//     if (!otp) {
//       setError("Enter OTP");
//       return;
//     }

//     try {
//       setLoading(true);
//       await axios.post(
//         role === "recruiter"
//           ? "http://localhost:5000/api/auth/recruiter/verify-otp"
//           : "http://localhost:5000/api/auth/jobseeker/verify-otp",
//         { email, otp }
//       );
//       setOtpVerified(true);
//       setSuccess("Email verified");
//     } catch {
//       setError("Invalid or expired OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* =========================
//      SUBMIT
//   ========================= */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (!password || !mobile) {
//       setError("Required fields missing");
//       return;
//     }

//     try {
//       setLoading(true);

//       let payload = {
//         fullName,
//         email,
//         password,
//         mobile,
//         role,
//       };

//       if (role === "recruiter") {
//         payload.designation = designation;
//         payload.companyDetails = {
//           name: companyName,
//           location,
//         };
//       } else {
//         payload.gender = gender;
//         payload.qualification = qualification;
//         payload.status = status;
//         payload.location = location;
//       }

//       await axios.post(
//         role === "recruiter"
//           ? "http://localhost:5000/api/auth/signup-recruiter"
//           : "http://localhost:5000/api/auth/signup-jobseeker",
//         payload
//       );

//       setSuccess("Signup successful");

//       // reset
//       setFullName("");
//       setEmail("");
//       setOtp("");
//       setPassword("");
//       setMobile("");
//       setGender("");
//       setQualification("");
//       setStatus("");
//       setLocation("");
//       setDesignation("");
//       setCompanyName("");
//       setOtpSent(false);
//       setOtpVerified(false);
//     } catch {
//       setError("Signup failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <form style={styles.form} onSubmit={handleSubmit}>
//         <h3 style={styles.title}>Signup</h3>

//         {/* ROLE SWITCH */}
//         <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
//           <button type="button" onClick={() => setRole("jobseeker")} style={role === "jobseeker" ? styles.active : styles.inactive}>
//             Job Seeker
//           </button>
//           <button type="button" onClick={() => setRole("recruiter")} style={role === "recruiter" ? styles.active : styles.inactive}>
//             Recruiter
//           </button>
//         </div>

//         {error && <p style={styles.error}>{error}</p>}
//         {success && <p style={styles.success}>{success}</p>}

//         <input placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={otpVerified} style={styles.input} />

//         <div style={{ display: "flex", gap: 8 }}>
//           <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={otpVerified} style={{ ...styles.input, flex: 1 }} />
//           <button type="button" onClick={handleSendOtp} disabled={otpVerified} style={styles.otpBtn}>
//             {otpSent ? "Resend OTP" : "Send OTP"}
//           </button>
//         </div>

//         {otpSent && !otpVerified && (
//           <div style={{ display: "flex", gap: 8 }}>
//             <input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} style={{ ...styles.input, flex: 1 }} />
//             <button type="button" onClick={handleVerifyOtp} style={styles.otpBtn}>
//               Verify
//             </button>
//           </div>
//         )}

//         <input type="password" placeholder="Password" disabled={!otpVerified} value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} />
//         <input placeholder="Mobile" disabled={!otpVerified} value={mobile} onChange={(e) => setMobile(e.target.value)} style={styles.input} />

//         {/* JOB SEEKER */}
//         {role === "jobseeker" && (
//           <>
//             <select disabled={!otpVerified} value={gender} onChange={(e) => setGender(e.target.value)} style={styles.input}>
//               <option value="">Select Gender</option>
//               <option>Male</option>
//               <option>Female</option>
//               <option>Other</option>
//             </select>

//             <input placeholder="Highest Qualification" disabled={!otpVerified} value={qualification} onChange={(e) => setQualification(e.target.value)} style={styles.input} />

//             <select disabled={!otpVerified} value={status} onChange={(e) => setStatus(e.target.value)} style={styles.input}>
//               <option value="">Current Status</option>
//               <option>Student</option>
//               <option>Fresher</option>
//               <option>Experienced</option>
//             </select>

//             <input placeholder="Current Location" disabled={!otpVerified} value={location} onChange={(e) => setLocation(e.target.value)} style={styles.input} />
//           </>
//         )}

//         {/* RECRUITER */}
//         {role === "recruiter" && (
//           <>
//             <input placeholder="Designation" disabled={!otpVerified} value={designation} onChange={(e) => setDesignation(e.target.value)} style={styles.input} />
//             <input placeholder="Company Name" disabled={!otpVerified} value={companyName} onChange={(e) => setCompanyName(e.target.value)} style={styles.input} />
//             <input placeholder="Location" disabled={!otpVerified} value={location} onChange={(e) => setLocation(e.target.value)} style={styles.input} />
//           </>
//         )}

//         <button style={styles.button} disabled={!otpVerified || loading}>
//           Signup
//         </button>
//       </form>
//     </div>
//   );
// }

// /* =========================
//    STYLES
// ========================= */
// const styles = {
//   container: { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f3f4f6" },
//   form: { width: 380, background: "#fff", padding: 25, borderRadius: 8 },
//   title: { textAlign: "center", marginBottom: 10 },
//   input: { width: "100%", padding: 10, marginBottom: 10 },
//   otpBtn: { padding: "10px 12px", background: "#2563eb", color: "#fff", border: "none" },
//   button: { width: "100%", padding: 10, background: "#111827", color: "#fff", border: "none" },
//   active: { flex: 1, padding: 8, background: "#2563eb", color: "#fff", border: "none" },
//   inactive: { flex: 1, padding: 8, background: "#e5e7eb", border: "none" },
//   error: { color: "red", textAlign: "center" },
//   success: { color: "green", textAlign: "center" },
// };

// export default Signup;

import { useState } from "react";
import axios from "axios";

function Signup() {
  /* =========================
     ROLE
  ========================= */
  const [role, setRole] = useState("jobseeker");

  /* =========================
     COMMON FIELDS
  ========================= */
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");

  /* =========================
     JOB SEEKER FIELDS
  ========================= */
  const [gender, setGender] = useState("");
  const [qualification, setQualification] = useState("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");

  /* =========================
     RECRUITER FIELDS
  ========================= */
  const [designation, setDesignation] = useState("");
  const [companyName, setCompanyName] = useState("");

  /* =========================
     OTP STATES
  ========================= */
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  /* =========================
     UI STATES
  ========================= */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =========================
     SEND OTP (COMMON)
  ========================= */
  const handleSendOtp = async () => {
    setError("");
    setSuccess("");

    if (!fullName || !email) {
      setError("Full name and email are required");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/auth/send-otp", {
        fullName,
        email,
        role,
      });
      setOtpSent(true);
      setSuccess("OTP sent to your email");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     VERIFY OTP (COMMON)
  ========================= */
  const handleVerifyOtp = async () => {
    setError("");
    setSuccess("");

    if (!otp) {
      setError("Enter OTP");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email,
        otp,
        role,
      });
      setOtpVerified(true);
      setSuccess("Email verified successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     SIGNUP
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otpVerified) {
      setError("Please verify email first");
      return;
    }

    try {
      setLoading(true);

      let payload = {
        fullName,
        email,
        password,
        mobile,
      };

      if (role === "recruiter") {
        payload.designation = designation;
        payload.companyDetails = {
          name: companyName,
          location,
        };
      } else {
        payload.gender = gender;
        payload.qualification = qualification;
        payload.status = status;
        payload.location = location;
      }

      await axios.post(
        role === "recruiter"
          ? "http://localhost:5000/api/auth/signup-recruiter"
          : "http://localhost:5000/api/auth/signup-jobseeker",
        payload
      );

      setSuccess("Signup successful 🎉");

      // reset
      setFullName("");
      setEmail("");
      setOtp("");
      setPassword("");
      setMobile("");
      setGender("");
      setQualification("");
      setStatus("");
      setLocation("");
      setDesignation("");
      setCompanyName("");
      setOtpSent(false);
      setOtpVerified(false);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h3 style={styles.title}>Signup</h3>

        {/* ROLE SWITCH */}
        <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
          <button
            type="button"
            onClick={() => setRole("jobseeker")}
            style={role === "jobseeker" ? styles.active : styles.inactive}
          >
            Job Seeker
          </button>
          <button
            type="button"
            onClick={() => setRole("recruiter")}
            style={role === "recruiter" ? styles.active : styles.inactive}
          >
            Recruiter
          </button>
        </div>

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <input
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={otpVerified}
          style={styles.input}
        />

        <div style={{ display: "flex", gap: 8 }}>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={otpVerified}
            style={{ ...styles.input, flex: 1 }}
          />
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={loading || otpVerified}
            style={styles.otpBtn}
          >
            {otpSent ? "Resend OTP" : "Send OTP"}
          </button>
        </div>

        {otpSent && !otpVerified && (
          <div style={{ display: "flex", gap: 8 }}>
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={{ ...styles.input, flex: 1 }}
            />
            <button type="button" onClick={handleVerifyOtp} style={styles.otpBtn}>
              Verify
            </button>
          </div>
        )}

        <input
          type="password"
          placeholder="Password"
          disabled={!otpVerified}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Mobile"
          disabled={!otpVerified}
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          style={styles.input}
        />

        {/* JOB SEEKER */}
        {role === "jobseeker" && (
          <>
            <select
              disabled={!otpVerified}
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              style={styles.input}
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>

            <input
              placeholder="Highest Qualification"
              disabled={!otpVerified}
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
              style={styles.input}
            />

            <select
              disabled={!otpVerified}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={styles.input}
            >
              <option value="">Current Status</option>
              <option>Student</option>
              <option>Fresher</option>
              <option>Experienced</option>
            </select>

            <input
              placeholder="Current Location"
              disabled={!otpVerified}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={styles.input}
            />
          </>
        )}

        {/* RECRUITER */}
        {role === "recruiter" && (
          <>
            <input
              placeholder="Designation"
              disabled={!otpVerified}
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              style={styles.input}
            />
            <input
              placeholder="Company Name"
              disabled={!otpVerified}
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              style={styles.input}
            />
            <input
              placeholder="Company Location"
              disabled={!otpVerified}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={styles.input}
            />
          </>
        )}

        <button style={styles.button} disabled={loading || !otpVerified}>
          Signup
        </button>
      </form>
    </div>
  );
}

/* =========================
   STYLES
========================= */
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f3f4f6",
  },
  form: {
    width: 380,
    background: "#fff",
    padding: 25,
    borderRadius: 8,
  },
  title: { textAlign: "center", marginBottom: 10 },
  input: { width: "100%", padding: 10, marginBottom: 10 },
  otpBtn: { padding: "10px 12px", background: "#2563eb", color: "#fff", border: "none" },
  button: { width: "100%", padding: 10, background: "#111827", color: "#fff", border: "none" },
  active: { flex: 1, padding: 8, background: "#2563eb", color: "#fff", border: "none" },
  inactive: { flex: 1, padding: 8, background: "#e5e7eb", border: "none" },
  error: { color: "red", textAlign: "center" },
  success: { color: "green", textAlign: "center" },
};

export default Signup;
