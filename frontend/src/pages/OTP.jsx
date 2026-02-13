import { useState } from "react";
import { verifyOTP } from "../services/auth";
import { useNavigate } from "react-router-dom";

function OTP() {
  const [otp, setOtp] = useState("");
  const email = localStorage.getItem("email");
  const navigate = useNavigate();

  const handleVerify = async () => {
    try {
      await verifyOTP(email, otp);
      alert("Account verified successfully!");
      navigate("/login");
    } catch {
      alert("Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-purple-300 to-indigo-400 flex items-center justify-center">

      <div className="bg-white/30 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-96">

        <h2 className="text-3xl font-bold mb-6 text-center">
          Verify OTP
        </h2>

        <input
          placeholder="Enter OTP"
          className="w-full p-3 mb-4 rounded-lg bg-white/70 outline-none"
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          onClick={handleVerify}
          className="w-full bg-purple-700 text-white p-3 rounded-lg font-semibold"
        >
          Verify OTP
        </button>

      </div>

    </div>
  );
}

export default OTP;
