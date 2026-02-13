import { useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { login } from "../services/auth";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await login(form.email, form.password);

      localStorage.setItem("token", res.data.token);

      Swal.fire({
        title: "Login Successful!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

    } catch (err) {
      Swal.fire(
        "Login Failed",
        err.response?.data?.message || "Invalid credentials",
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-purple-300 to-indigo-400 flex items-center justify-center">

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white/30 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-[420px]"
      >

        <h2 className="text-3xl font-bold mb-6 text-center text-purple-900">
          Login
        </h2>

        {/* Email */}
        <input
          placeholder="Email"
          className="input"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        {/* Password with Eye Icon */}
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
            className="absolute right-3 top-3 cursor-pointer text-gray-600"
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        {/* Login Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogin}
          className="w-full bg-purple-800 text-white p-3 rounded-lg font-semibold hover:bg-purple-900"
        >
          Login
        </motion.button>

      </motion.div>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.7);
          outline: none;
          margin-bottom: 12px;
        }
      `}</style>

    </div>
  );
}

export default Login;
