import { useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { signup, verifyOTP } from "../services/auth";
import { useNavigate } from "react-router-dom";
import skillImg from "../assets/skillgap.png";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  // Toast
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    timer: 1600,
    showConfirmButton: false,
  });

  // ✅ Send OTP
  const handleSendOTP = async () => {
    if (!form.username || !form.email || !form.password) {
      return Swal.fire("Missing Fields", "Fill all fields first", "warning");
    }

    if (form.password !== form.confirmPassword) {
      return Swal.fire("Error", "Passwords do not match", "error");
    }

    try {
      setLoading(true);

      Swal.fire({
        title: "Sending OTP...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await signup(form); // backend sends OTP

      Swal.close();
      setOtpSent(true);

      Toast.fire({
        icon: "success",
        title: "OTP Sent to Email 📩",
      });

    } catch (err) {
      Swal.close();
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to send OTP",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Verify OTP
  const handleVerifyOTP = async () => {
    if (!otp) {
      return Swal.fire("Enter OTP", "Please enter OTP first", "warning");
    }

    try {
      setLoading(true);

      Swal.fire({
        title: "Verifying...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await verifyOTP(form.email, otp);

      Swal.close();
      setOtpVerified(true);

      Toast.fire({
        icon: "success",
        title: "OTP Verified ✅",
      });

    } catch {
      Swal.close();
      Swal.fire("Invalid OTP ❌", "Please try again", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Final Create Account
  const handleCreateAccount = () => {
    if (!otpVerified) {
      return Swal.fire(
        "Verify OTP First",
        "Please verify OTP before proceeding",
        "warning"
      );
    }

    Toast.fire({
      icon: "success",
      title: "Account Created 🎉",
    });

    setTimeout(() => navigate("/login"), 1500);
  };

  return (
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-purple-400 to-indigo-200">    <div className="w-[1100px] h-[650px] bg-white rounded-2xl shadow-2xl flex overflow-hidden">

     
        {/* LEFT PANEL */}
<div className="w-1/2 relative overflow-hidden">

  {/* Background Image */}
  <img
    src={skillImg}
    alt="Skill Gap"
    className="absolute inset-0 w-full h-full object-cover"
  />

  {/* Dark Overlay */}
  {/* <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-purple-800/70 to-indigo-900/80"></div> */}

  {/* Content */}
  <div className="relative z-10 text-white p-12 flex flex-col justify-between h-full">

    <h1 className="text-2xl font-bold">Skill Analyzer</h1>

    <div>
      <h2 className="text-4xl font-bold leading-snug">
        Bridge the <span className="text-cyan-300">Skill Gap</span>  
        <br /> and Build Your Future.
      </h2>

      <p className="mt-6 text-sm opacity-90">
        Learn smarter. Track progress. Grow faster.
      </p>
    </div>

    <div className="text-sm opacity-80">
      {/* Empowering 9.5k+ learners worldwide 🌍 */}
    </div>

  </div>
</div>
        {/* RIGHT PANEL */}
<div className="w-1/2 flex items-center justify-center p-12 bg-gradient-to-br from-purple-20 to-indigo-100">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-sm"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Sign Up
            </h2>

            <input
              placeholder="Username"
              className="input"
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
            />

            {/* Email + Send OTP */}
            <div className="flex gap-2 mb-3">
              <input
                placeholder="Email"
                className="input flex-1"
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              <button
                onClick={handleSendOTP}
                disabled={loading}
                className="btn-secondary"
              >
                Send OTP
              </button>
            </div>

            {/* OTP Section */}
            {otpSent && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-2 mb-3"
              >
                <input
                  placeholder="Enter OTP"
                  className="input flex-1"
                  onChange={(e) => setOtp(e.target.value)}
                />

                <button
                  onClick={handleVerifyOTP}
                  disabled={loading}
                  className="btn-success"
                >
                  Verify
                </button>
              </motion.div>
            )}

            <input
              type="password"
              placeholder="Password"
              className="input"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Confirm Password"
              className="input"
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />

            <button
              onClick={handleCreateAccount}
              disabled={!otpVerified}
              className={`btn-primary ${
                !otpVerified ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Create Account
            </button>

            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-purple-700 cursor-pointer font-semibold"
              >
                Sign In
              </span>
            </p>

          </motion.div>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        .input {
          width: 100%;
          padding: 14px;
          border-radius: 10px;
          border: 1px solid #ddd;
          margin-bottom: 14px;
          font-size: 14px;
        }

        .input:focus {
          outline: none;
          border-color: #7c3aed;
          box-shadow: 0 0 0 2px rgba(124,58,237,0.2);
        }

        .btn-primary {
          width: 100%;
          padding: 14px;
          background: linear-gradient(90deg,#7c3aed,#6366f1);
          color: white;
          border-radius: 10px;
          font-weight: 600;
          margin-top: 10px;
        }

        .btn-secondary {
          padding: 12px 14px;
          border-radius: 10px;
          background: #7c3aed;
          color: white;
          font-size: 13px;
        }

        .btn-success {
          padding: 12px 14px;
          border-radius: 10px;
          background: #16a34a;
          color: white;
          font-size: 13px;
        }
      `}</style>
    </div>
  );
}

export default Signup;
