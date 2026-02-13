import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Brain, BarChart3, ShieldCheck, Users } from "lucide-react";
import landingImg from "../assets/LandingPageImg.jpeg";

export default function HeroTemplate() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI Skill Analysis",
      desc: "Advanced AI evaluates student skills and provides personalized improvement plans.",
    },
    {
      icon: BarChart3,
      title: "Placement Insights",
      desc: "Real‑time analytics to track readiness and predict placement success.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Dashboard",
      desc: "Protected authentication and data privacy for every user.",
    },
    {
      icon: Users,
      title: "Student Community",
      desc: "Collaborate, learn, and grow with a network of ambitious students.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-purple-300 to-indigo-400 text-gray-900">
      {/* Main Glass Container */}
      <div className="max-w-7xl mx-auto backdrop-blur-xl bg-white/20 shadow-2xl rounded-3xl overflow-hidden">
        {/* Navbar */}
        <nav className="flex justify-between items-center px-10 py-6">
          <h1 className="text-2xl font-bold">AI Analyzer</h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/login")}
              className="bg-white text-purple-700 px-6 py-2 rounded-xl font-semibold shadow hover:scale-105 transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="bg-purple-700 text-white px-6 py-2 rounded-xl font-semibold shadow hover:scale-105 transition"
            >
              Sign Up
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="grid md:grid-cols-2 gap-8 px-10 py-16">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-5xl font-bold leading-tight"
            >
              Smart AI Solutions
              <br />
              for Career Growth
            </motion.h1>

            <p className="mt-6 text-gray-700">
              Analyze placement readiness, identify skill gaps, and accelerate
              your career with intelligent AI‑driven insights.
            </p>

            <button
              onClick={() => navigate("/signup")}
              className="mt-8 bg-white text-purple-700 px-8 py-3 rounded-xl font-semibold shadow hover:scale-105 transition"
            >
              Get Started
            </button>

            {/* Stats */}
            <div className="flex gap-12 mt-12">
              {[
                { value: "70+", label: "Projects analyzed" },
                { value: "10k+", label: "Students helped" },
                { value: "100+", label: "Institutions" },
              ].map((stat, i) => (
                <div key={i}>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                  <p className="text-sm text-gray-700">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex items-center justify-center">
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2 }}
              whileHover={{ scale: 1.05 }}
              src={landingImg}
              alt="AI Visual"
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </section>

        {/* Features Section */}
        <section className="px-10 py-16 bg-white/30">
          <h2 className="text-3xl font-bold text-center mb-12">
            Powerful Features
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -8, scale: 1.03 }}
                  className="bg-white rounded-2xl p-6 shadow-lg cursor-pointer"
                >
                  <Icon className="w-10 h-10 text-purple-700 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="px-10 py-16 bg-white/20">
          <h2 className="text-3xl font-bold text-center mb-12">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Your Profile",
                desc: "Sign up and build your student profile by adding your skills, projects, and academic details.",
              },
              {
                step: "02",
                title: "AI Skill Assessment",
                desc: "Our AI analyzes your data to detect skill gaps and measure your placement readiness.",
              },
              {
                step: "03",
                title: "Get Personalized Guidance",
                desc: "Receive customized learning paths and recommendations to improve your career prospects.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-2xl p-8 shadow-lg text-center"
              >
                <div className="text-4xl font-bold text-purple-700 mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* About Section */}
        <section className="px-10 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">About the Project</h2>
            <p className="text-gray-700">
              AI Analyzer is a smart platform designed to help students assess
              their placement readiness using artificial intelligence. It
              provides personalized feedback, tracks performance, and bridges
              skill gaps to improve career opportunities. Our mission is to
              empower every student with data‑driven career guidance.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-purple-800 text-white px-10 py-10">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-3">AI Analyzer</h3>
              <p className="text-sm text-purple-200">
                Empowering students with AI‑powered placement insights and
                career growth tools.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm text-purple-200">
                <li className="hover:text-white cursor-pointer">Home</li>
                <li
                  className="hover:text-white cursor-pointer"
                  onClick={() => navigate("/login")}
                >
                  Login
                </li>
                <li
                  className="hover:text-white cursor-pointer"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Contact</h4>
              <p className="text-sm text-purple-200">
                Email: support@aianalyzer.com
                <br />
                © {new Date().getFullYear()} AI Analyzer. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
