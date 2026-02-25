import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      return Swal.fire("Error", "Fill all fields", "warning");
    }

    if (password !== confirmPassword) {
      return Swal.fire("Error", "Passwords do not match", "error");
    }

    try {
      Swal.fire({
        title: "Updating Password...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { password }
      );

      Swal.close();

      Swal.fire(
        "Success 🎉",
        "Password updated successfully",
        "success"
      );

      navigate("/login");

    } catch (err) {
      Swal.close();
      Swal.fire(
        "Error",
        err.response?.data?.message || "Invalid or expired link",
        "error"
      );
    }
  };

  return (
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-purple-400 to-indigo-200">      <div className="bg-white p-10 rounded-2xl shadow-xl w-[400px]">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Reset Password
        </h2>

        <input
          type="password"
          placeholder="New Password"
          className="input"
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="input"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          onClick={handleReset}
          className="w-full bg-purple-700 text-white p-3 rounded-lg mt-4"
        >
          Update Password
        </button>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 12px;
          margin-bottom: 12px;
          border-radius: 8px;
          border: 1px solid #ccc;
        }
      `}</style>
    </div>
  );
}

export default ResetPassword;