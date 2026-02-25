import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProfile } from "../services/profile";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem("email");

    if (!email) {
      navigate("/login");
      return;
    }

    loadUser(email);
  }, []);

  const loadUser = async (email) => {
    try {
      const res = await getProfile(email);
      setUser(res.data);
    } catch (err) {
      console.log("Profile load failed", err);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-purple-300 to-indigo-400">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-10 py-5 backdrop-blur-xl bg-white/30 shadow-lg">

        <h1 className="text-2xl font-bold text-purple-900">
          AI Placement Analyzer
        </h1>

        <div className="flex items-center gap-4">

          {/* USER PROFILE */}
          {user && (
            <motion.div
              whileHover={{ scale: 1.06 }}
              onClick={() => navigate("/profile")}
              className="flex items-center gap-3 cursor-pointer bg-white/40 px-4 py-2 rounded-xl shadow"
            >
              <img
  src={
    user.profilePic
      ? `http://localhost:5000/uploads/${user.profilePic}?t=${Date.now()}`
      : user.avatar ||
        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  }
  className="w-10 h-10 rounded-full object-cover border-2 border-white"
/>

              <span className="font-semibold text-purple-900">
                {user.username || "User"}
              </span>
            </motion.div>
          )}

          {/* LOGOUT */}
          <button
            onClick={logout}
            className="px-5 py-2 rounded-xl bg-purple-800 text-white hover:bg-purple-900 transition"
          >
            Logout
          </button>

        </div>
      </div>

      {/* CONTENT */}
      <div className="p-10">

        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/30 backdrop-blur-xl rounded-3xl p-8 shadow-xl mb-10"
        >
          <h2 className="text-3xl font-bold text-purple-900 mb-2">
            Welcome back {user?.username || ""}
          </h2>
          <p className="text-gray-800">
            Let’s improve your placement readiness 🚀
          </p>
        </motion.div>

        {/* FEATURE CARDS */}
      <motion.div
  initial="hidden"
  animate="show"
  variants={{ show: { transition: { staggerChildren: 0.15 } } }}
  className="grid md:grid-cols-3 gap-8"
>

  <FeatureCard
    title="AI Resume Analyzer"
    desc="Upload resume & get AI-powered feedback, ATS score and improvement suggestions"
    color="from-pink-500 to-purple-500"
    onClick={() => navigate("/resume-analyzer")}
  />

  <FeatureCard
    title="Skill Gap Analysis"
    desc="Compare your skills with industry requirements and identify missing technologies"
    color="from-purple-500 to-indigo-500"
    onClick={() => navigate("/skill-gap")}
  />

  <FeatureCard
    title="Learning Roadmap"
    desc="Get personalized AI-generated preparation strategy based on your target role"
    color="from-indigo-500 to-blue-500"
    onClick={() => navigate("/roadmap")}
  />

  <FeatureCard
    title="Placement Readiness Score"
    desc="View your overall placement readiness percentage based on AI evaluation"
    color="from-green-500 to-emerald-500"
    onClick={() => navigate("/readiness")}
  />

  <FeatureCard
    title="Progress & History"
    desc="Track your resume improvement and skill growth over time"
    color="from-orange-500 to-red-500"
    onClick={() => navigate("/history")}
  />

  <FeatureCard
    title="Profile Settings"
    desc="Manage your account, update profile, and configure your dream role"
    color="from-gray-500 to-slate-700"
    onClick={() => navigate("/profile")}
  />

</motion.div>

      </div>
    </div>
  );
}

function FeatureCard({ title, desc, color, onClick }) {
  return (
    <motion.div
      onClick={onClick}
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0 },
      }}
      whileHover={{ scale: 1.07 }}
      className={`rounded-2xl p-[2px] bg-gradient-to-br ${color} shadow-lg cursor-pointer`}
    >
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl p-6 h-full">
        <h3 className="text-xl font-bold text-purple-900 mb-2">{title}</h3>
        <p className="text-gray-700">{desc}</p>
      </div>
    </motion.div>
  );
}

export default Dashboard;