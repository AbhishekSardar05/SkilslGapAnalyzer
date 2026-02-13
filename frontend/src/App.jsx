import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HeroTemplate from "./pages/HeroTemplate";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import OTP from "./pages/OTP";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HeroTemplate />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<OTP />} />
      </Routes>
    </Router>
  );
}

export default App;
