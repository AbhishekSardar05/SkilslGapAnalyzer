import { useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { signup, verifyOTP } from "../services/auth";
import { useNavigate } from "react-router-dom";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ✅ Validation helpers
  const validEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validPassword = (pass) =>
    /^(?=.*\d).{8,}$/.test(pass);

  // ✅ Send OTP
  const handleSendOTP = async () => {
    if (!form.username || !form.email || !form.password) {
      return Swal.fire(
        "Missing Fields",
        "Fill username, email & password first",
        "warning"
      );
    }

    if (!validEmail(form.email)) {
      return Swal.fire("Invalid Email", "Enter valid email", "error");
    }

    if (!validPassword(form.password)) {
      return Swal.fire(
        "Weak Password",
        "Password must be 8+ characters with a number",
        "warning"
      );
    }

    try {
      await signup(form);
      setOtpSent(true);

      Swal.fire({
        title: "OTP Sent!",
        text: "Check your email inbox",
        icon: "success",
        confirmButtonColor: "#6b21a8",
      });
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Signup failed",
        "error"
      );
    }
  };

  // ✅ Verify OTP
  const handleVerifyOTP = async () => {
    try {
      await verifyOTP(form.email, otp);
      setOtpVerified(true);

      Swal.fire("Success", "OTP Verified!", "success");
    } catch {
      Swal.fire("Error", "Invalid OTP", "error");
    }
  };

  // ✅ Create Account
  const handleCreateAccount = () => {
    if (!otpVerified) {
      return Swal.fire(
        "Verify OTP",
        "Please verify OTP first",
        "warning"
      );
    }

    if (form.password !== form.confirmPassword) {
      return Swal.fire(
        "Password Error",
        "Passwords do not match",
        "error"
      );
    }

    Swal.fire({
      title: "Account Created!",
      text: "Redirecting to login...",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });

    setTimeout(() => navigate("/login"), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-purple-300 to-indigo-400 flex items-center justify-center">

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/30 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-[440px]"
      >

        <h2 className="text-3xl font-bold mb-6 text-center text-purple-900">
          Create Account
        </h2>

        {/* Username */}
        <input
          placeholder="Username"
          className="input"
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        {/* Email + Send OTP */}
        <div className="flex gap-2 mb-4">
          <input
            placeholder="Email"
            className="input flex-1"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendOTP}
            className="btn-secondary"
          >
            Send OTP
          </motion.button>
        </div>

        {/* OTP Section */}
        {otpSent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2 mb-4"
          >
            <input
              placeholder="Enter OTP"
              className="input flex-1"
              onChange={(e) => setOtp(e.target.value)}
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleVerifyOTP}
              className="btn-success"
            >
              Verify
            </motion.button>
          </motion.div>
        )}

        {/* Password */}
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="input pr-10"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            className="eye"
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        {/* Confirm Password */}
        <div className="relative mb-4">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password"
            className="input pr-10"
            onChange={(e) =>
              setForm({
                ...form,
                confirmPassword: e.target.value,
              })
            }
          />

          <span
            onClick={() => setShowConfirm(!showConfirm)}
            className="eye"
          >
            {showConfirm ? "🙈" : "👁️"}
          </span>
        </div>

        {/* Create Account */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreateAccount}
          className="btn-primary"
        >
          Create Account
        </motion.button>

      </motion.div>

      {/* Styles */}
      <style jsx>{`
        .input {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.75);
          outline: none;
          margin-bottom: 12px;
          font-size: 14px;
        }

        .btn-primary {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          background: #581c87;
          color: white;
          font-weight: 600;
        }

        .btn-secondary {
          padding: 12px 14px;
          border-radius: 12px;
          background: #7c3aed;
          color: white;
          font-size: 13px;
        }

        .btn-success {
          padding: 12px 14px;
          border-radius: 12px;
          background: #16a34a;
          color: white;
          font-size: 13px;
        }

        .eye {
          position: absolute;
          right: 12px;
          top: 14px;
          cursor: pointer;
          font-size: 18px;
        }
      `}</style>

    </div>
  );
}

export default Signup;
