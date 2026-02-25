import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HeroTemplate from "./pages/HeroTemplate";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import OTP from "./pages/OTP";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HeroTemplate />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
      </Routes>
    </Router>
  );
}

export default App;
