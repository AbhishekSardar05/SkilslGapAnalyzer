import { useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { login } from "../services/auth";
import { useNavigate } from "react-router-dom";
import skillImg from "../assets/skillgap.png";
import { forgotPassword } from "../services/auth";

function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [role, setRole] = useState("Student");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {

    if (!form.email || !form.password) {
      return Swal.fire("Missing Information ⚠️", "Enter email and password", "warning");
    }

    try {

      setLoading(true);

      Swal.fire({
        title: "Authenticating...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await login(form.email, form.password, role);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("email", form.email);
     localStorage.setItem("role", res.data.role);

      Swal.close();

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Login Successful 🎉",
        showConfirmButton: false,
        timer: 1500,
      });

      setTimeout(() => navigate("/dashboard"), 1500);

    } catch (err) {

      Swal.close();

      Swal.fire(
        "Login Failed ❌",
        err.response?.data?.message || "Invalid credentials",
        "error"
      );

    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {

    Swal.fire({
      title: "Forgot Password?",
      input: "email",
      inputPlaceholder: "Enter your email",
      showCancelButton: true,
      confirmButtonText: "Send Reset Link",
      confirmButtonColor: "#7c3aed",
    }).then(async (result) => {

      if (result.isConfirmed && result.value) {

        try {

          Swal.fire({
            title: "Sending Reset Link...",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
          });

          await forgotPassword(result.value);

          Swal.close();

          Swal.fire(
            "Email Sent 📩",
            "Check your inbox for reset link",
            "success"
          );

        } catch (err) {

          Swal.close();

          Swal.fire(
            "Error ❌",
            err.response?.data?.message || "Failed to send email",
            "error"
          );
        }
      }
    });
  };

  return (

<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-purple-400 to-indigo-200">

<div className="w-[1100px] h-[650px] bg-white rounded-2xl shadow-2xl flex overflow-hidden">

{/* LEFT PANEL */}

<div className="w-1/2 relative overflow-hidden">

<img
src={skillImg}
alt="Skill Gap"
className="absolute inset-0 w-full h-full object-cover"
/>

<div className="relative z-10 text-white p-12 flex flex-col justify-between h-full">

<h1 className="text-2xl font-bold">Skill Analyzer</h1>

<div>
<h2 className="text-4xl font-bold leading-snug">
Welcome Back to <span className="text-cyan-300">Skill Analyzer</span>
</h2>

<p className="mt-6 text-sm opacity-90">
Continue your learning journey.
</p>
</div>

<div className="text-sm opacity-80">
Empowering 9.5k+ learners 🌍
</div>

</div>
</div>


{/* RIGHT PANEL */}

<div className="w-1/2 flex items-center justify-center p-12 bg-white">

<motion.div
initial={{ opacity: 0, x: 40 }}
animate={{ opacity: 1, x: 0 }}
transition={{ duration: 0.5 }}
className="w-full max-w-sm"
>

<h2 className="text-3xl font-bold text-gray-800 mb-6">
Sign In
</h2>

<input
type="email"
placeholder="Email"
className="input"
onChange={(e)=>setForm({...form,email:e.target.value})}
/>

<div className="relative mb-4">

<input
type={showPassword ? "text" : "password"}
placeholder="Password"
className="input pr-10"
onChange={(e)=>setForm({...form,password:e.target.value})}
/>

<span
onClick={()=>setShowPassword(!showPassword)}
className="eye"
>
{showPassword ? "🙈" : "👁️"}
</span>

</div>

{/* Role Selection */}

<div className="mb-4">

<p className="text-sm text-gray-500 mb-2">
Login as
</p>

<div className="flex gap-3">

{["Student","TPO","Admin"].map((r)=>(
<button
key={r}
onClick={()=>setRole(r)}
className={`px-4 py-2 rounded-full text-sm font-medium transition
${role===r
?"bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow"
:"bg-gray-100 hover:bg-gray-200 text-gray-700"
}`}
>
{r}
</button>
))}

</div>

</div>


<div className="text-right mb-4">
<span
onClick={handleForgotPassword}
className="text-sm text-purple-700 cursor-pointer hover:underline"
>
Forgot Password?
</span>
</div>

<button
onClick={handleLogin}
disabled={loading}
className="btn-primary"
>
{loading ? "Logging in..." : "Login"}
</button>

<p className="text-sm text-center mt-4">
Don’t have an account?{" "}
<span
onClick={()=>navigate("/signup")}
className="text-purple-700 cursor-pointer font-semibold"
>
Sign Up
</span>
</p>

</motion.div>

</div>
</div>

<style jsx>{`

.input{
width:100%;
padding:14px;
border-radius:10px;
border:1px solid #ddd;
margin-bottom:14px;
font-size:14px;
}

.input:focus{
outline:none;
border-color:#7c3aed;
box-shadow:0 0 0 2px rgba(124,58,237,0.2);
}

.btn-primary{
width:100%;
padding:14px;
background:linear-gradient(90deg,#7c3aed,#6366f1);
color:white;
border-radius:10px;
font-weight:600;
}

.eye{
position:absolute;
right:12px;
top:14px;
cursor:pointer;
}

`}</style>

</div>

  );
}

export default Login;