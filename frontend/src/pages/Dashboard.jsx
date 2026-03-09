import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProfile } from "../services/profile";
import AdminDashboard from "./AdminDashboard";
import {
  FaUser,
  FaChartLine,
  FaBrain,
  FaFileAlt,
  FaRoad,
  FaHistory,
  FaBars,
} from "react-icons/fa";



function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const role = localStorage.getItem("role");

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
      console.log(err);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };
  if (role === "Admin") {
  return <AdminDashboard />;
}

if (role === "TPO") {
  return <TPODashboard user={user} logout={logout} />;
}

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}

      <motion.div
        animate={{ width: sidebarOpen ? 250 : 70 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className="bg-purple-900 text-white flex flex-col p-4 space-y-6 shadow-xl"
      >
        <div className="flex justify-between items-center">

          {sidebarOpen && (
            <h1 className="text-xl font-bold">AI Analyzer</h1>
          )}

          <FaBars
            className="cursor-pointer text-lg"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          />
        </div>

        <SidebarItem icon={<FaFileAlt />} text="Resume" show={sidebarOpen} onClick={() => navigate("/resume-analyzer")} />
        <SidebarItem icon={<FaBrain />} text="Skill Gap" show={sidebarOpen} onClick={() => navigate("/skill-gap")} />
        <SidebarItem icon={<FaRoad />} text="Roadmap" show={sidebarOpen} onClick={() => navigate("/roadmap")} />
        <SidebarItem icon={<FaChartLine />} text="Score" show={sidebarOpen} onClick={() => navigate("/readiness")} />
        <SidebarItem icon={<FaHistory />} text="History" show={sidebarOpen} onClick={() => navigate("/history")} />
        <SidebarItem icon={<FaUser />} text="Profile" show={sidebarOpen} onClick={() => navigate("/profile")} />

      </motion.div>

      {/* MAIN CONTENT */}

      <div className="flex-1 flex flex-col">

        {/* NAVBAR */}

        <div className="flex justify-between items-center bg-white shadow px-10 py-4">

          <h2 className="text-xl font-semibold text-gray-700">
            AI Placement Analyzer
          </h2>

          <div className="flex items-center gap-4">

            {user && (
              <div className="flex items-center gap-3">

                <img
                  src={
                    user.profilePic
                      ? `http://localhost:5000/uploads/${user.profilePic}`
                      : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  className="w-10 h-10 rounded-full border"
                />

                <span className="font-medium">
                  {user.username}
                </span>

              </div>
            )}

            <button
              onClick={logout}
              className="bg-purple-800 text-white px-4 py-2 rounded-lg hover:bg-purple-900 transition-all"
            >
              Logout
            </button>

          </div>
        </div>

        {/* PAGE CONTENT */}

        <div className="p-10 space-y-20">

          {/* HERO SECTION */}

          <section className="grid md:grid-cols-2 gap-10 items-center">

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h1 className="text-4xl font-bold text-purple-900 mb-4">
                Welcome {user?.username}
              </h1>

              <p className="text-gray-600 text-lg">
                Our AI platform analyzes your resume, evaluates your
                technical skills, identifies missing technologies,
                and generates a personalized preparation roadmap to
                help you crack your dream placement.
              </p>

              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/resume-analyzer")}
                className="mt-6 bg-purple-800 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-purple-900"
              >
                Start Resume Analysis
              </motion.button>

            </motion.div>

            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              whileHover={{ scale: 1.05 }}
              src="https://img.freepik.com/free-vector/artificial-intelligence-concept-illustration_114360-7137.jpg"
              className="rounded-xl shadow-xl"
            />

          </section>

          {/* FEATURES */}

          <section>

            <h2 className="text-3xl font-bold text-center mb-12">
              AI Powered Platform Features
            </h2>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: 0.2,
                  },
                },
              }}
              className="grid md:grid-cols-3 gap-10"
            >

              <Feature
                title="Resume Analyzer"
                desc="Our AI scans your resume and calculates ATS compatibility, helping you optimize it for recruiters."
                img="https://img.freepik.com/free-vector/resume-concept-illustration_114360-2784.jpg"
                onClick={() => navigate("/resume-analyzer")}
              />

              <Feature
                title="Skill Gap Detection"
                desc="Analyze your skills and compare them with real industry job descriptions."
                img="https://img.freepik.com/free-vector/data-analysis-concept-illustration_114360-1395.jpg"
                onClick={() => navigate("/skill-gap")}
              />

              <Feature
                title="AI Learning Roadmap"
                desc="Generate a step-by-step preparation plan to become job ready."
                img="https://img.freepik.com/free-vector/roadmap-concept-illustration_114360-1060.jpg"
                onClick={() => navigate("/roadmap")}
              />

            </motion.div>

          </section>

          {/* ABOUT PLATFORM */}

          <section className="bg-white rounded-xl shadow p-10">

            <h2 className="text-3xl font-bold mb-6">
              About AI Placement Analyzer
            </h2>

            <p className="text-gray-600 leading-relaxed">
              AI Placement Analyzer is an intelligent platform designed
              for students preparing for technical placements. The system
              uses artificial intelligence to evaluate resumes, identify
              missing skills, and provide personalized preparation
              strategies. The goal is to help students bridge the gap
              between academic knowledge and industry expectations.
            </p>

          </section>

          {/* STATS */}

          <section className="grid md:grid-cols-4 gap-6">

            <Stat title="Resumes Analyzed" value="1500+" />
            <Stat title="Skills Evaluated" value="500+" />
            <Stat title="Students Helped" value="800+" />
            <Stat title="Placement Success" value="92%" />

          </section>

          {/* FOOTER */}

          <footer className="text-center text-gray-500 pt-10 border-t">

            <p>
              © 2026 AI Placement Analyzer | Final Year Project
              by Abhishek Sardar
            </p>

          </footer>

        </div>

      </div>
    </div>
  );
}

function SidebarItem({ icon, text, show, onClick }) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.05, x: 5 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-purple-700 transition-all"
    >
      <div className="text-lg">{icon}</div>
      {show && <span className="font-medium">{text}</span>}
    </motion.div>
  );
}

function Feature({ title, desc, img, onClick }) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.06, y: -8 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer group"
    >

      <div className="overflow-hidden">

        <motion.img
          src={img}
          className="h-48 w-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.4 }}
        />

      </div>

      <div className="p-6">

        <h3 className="text-xl font-bold text-purple-900 mb-2 group-hover:text-purple-700 transition">
          {title}
        </h3>

        <p className="text-gray-600">
          {desc}
        </p>

      </div>

    </motion.div>
  );
}

function Stat({ title, value }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.08 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="bg-purple-900 text-white rounded-xl p-6 text-center shadow-lg hover:shadow-2xl"
    >
      <h3 className="text-3xl font-bold">{value}</h3>
      <p className="text-sm mt-2">{title}</p>
    </motion.div>
  );
}


function TPODashboard() {

  const navigate = useNavigate();
  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (

<div className="flex min-h-screen bg-gray-100">

{/* SIDEBAR */}

<div className="w-64 bg-purple-900 text-white p-6 space-y-6">

<h2 className="text-2xl font-bold">TPO Panel</h2>

<div className="space-y-4">

<div
onClick={()=>navigate("/tpo/students")}
className="cursor-pointer hover:bg-purple-700 p-3 rounded"
>
Students
</div>

<div
onClick={()=>navigate("/tpo/resume")}
className="cursor-pointer hover:bg-purple-700 p-3 rounded"
>
Resume Analytics
</div>

<div
onClick={()=>navigate("/tpo/skills")}
className="cursor-pointer hover:bg-purple-700 p-3 rounded"
>
Skill Gap Reports
</div>

</div>

</div>

{/* MAIN */}

<div className="flex-1 p-10">

<div className="flex justify-between mb-10">

<h1 className="text-3xl font-bold text-purple-900">
TPO Dashboard
</h1>

<button
onClick={logout}
className="bg-purple-800 text-white px-4 py-2 rounded-lg"
>
Logout
</button>

</div>

<div className="bg-white p-8 rounded-xl shadow">

<h2 className="text-xl font-bold mb-4">
Welcome to TPO Dashboard
</h2>

<p className="text-gray-600">
View student resume analysis, skill gap reports and placement readiness.
</p>

</div>

</div>

</div>

  );
}

export default Dashboard;