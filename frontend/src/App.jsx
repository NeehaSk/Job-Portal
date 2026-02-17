
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//  import Signup from "./pages/Signup";
//  import { Toaster } from "react-hot-toast";
//  import Login from "./pages/Login";

// function App() {
//   return (
//    <>
// <Router>
//       <Routes>

//       <Toaster
//        position="top-center"
//         reverseOrder={false}
//         toastOptions={{
//           duration: 3000,
//         }}
//       />             <Route path="/login" element={<Login />} />
//      <Signup />
//       </Routes>

//     </Router>

//    </>
//   ); }

//  export default App;

// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { Toaster } from "react-hot-toast";

// import Login from "./pages/Login";
// import Signup from "./pages/Signup";

// function App() {
//   return (
//     <Router>
//       <Toaster
//         position="top-center"
//         reverseOrder={false}
//         toastOptions={{
//           duration: 3000,
//         }}
//       />

//       <Routes>
//         {/* Default Route */}
//         <Route path="/" element={<Navigate to="/login" />} />

//         {/* Auth Routes */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
// import { Routes, Route, Navigate } from "react-router-dom";
// import { Toaster } from "react-hot-toast";
// import ForgotPassword from "./pages/ForgotPassword";
// import VerifyReset from "./pages/VerifyReset";

// import Login from "./pages/Login";
// import Signup from "./pages/Signup";

// function App() {
//   return (
//     <>
//       <Toaster
//         position="top-center"
//         reverseOrder={false}
//         toastOptions={{ duration: 3000 }}
//       />

//       <Routes>
//         <Route path="/" element={<Navigate to="/login" />} />
//   <Route path="/forgot-password" element={<ForgotPassword />} />
// <Route path="/verify-reset" element={<VerifyReset />} />

//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//       </Routes>
//     </>
//   );
// }

// export default App;
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ForgotPassword from "./pages/ForgotPassword";
import VerifyReset from "./pages/VerifyReset";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import JobSeekerProfile from "./pages/JobSeekerProfile";

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ duration: 3000 }}
      />

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-reset" element={<VerifyReset />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/jobseeker/profile" element={<JobSeekerProfile />} />
      </Routes>
    </>
  );
}

export default App;
