import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import landingImg from "../assets/LandingPageImg.jpeg";

function HeroTemplate() {
  const navigate = useNavigate(); // ✅ navigation enabled

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-purple-300 to-indigo-400 flex items-center justify-center p-8">

      {/* Glass Container */}
      <div className="w-full max-w-6xl rounded-3xl backdrop-blur-xl bg-white/20 shadow-2xl overflow-hidden">

        {/* Navbar */}
        <nav className="flex justify-between items-center px-8 py-6 text-black">
          <h1 className="text-2xl font-bold">AI Analyzer</h1>

          {/* LOGIN BUTTON */}
          <button
            onClick={() => navigate("/login")}
            className="border bg-white text-purple-700 px-6 py-3 rounded-lg font-semibold hover:scale-105 transition"
          >
            Login
          </button>
        </nav>

        {/* Hero Section */}
        <div className="grid md:grid-cols-2">

          {/* Left Content */}
          <div className="p-12 text-black">

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              whileHover={{ scale: 1.04 }}
              className="text-5xl font-bold cursor-pointer"
            >
              Smart AI Solutions
              <br />
              for Career Growth
            </motion.h1>

            <p className="mt-6 text-black/80">
              Analyze placement readiness, identify skill gaps,
              and accelerate your career with intelligent insights.
            </p>

            {/* GET STARTED BUTTON */}
            <button
              onClick={() => navigate("/signup")}
              className="mt-8 bg-white text-purple-700 px-6 py-3 rounded-lg font-semibold hover:scale-105 transition"
            >
              Get Started
            </button>

            {/* Stats */}
            <div className="flex gap-12 mt-12 text-black/90">
              <div>
                <h3 className="text-2xl font-bold">70+</h3>
                <p className="text-sm">Projects analyzed</p>
              </div>

              <div>
                <h3 className="text-2xl font-bold">10k+</h3>
                <p className="text-sm">Students helped</p>
              </div>

              <div>
                <h3 className="text-2xl font-bold">100+</h3>
                <p className="text-sm">Institutions</p>
              </div>
            </div>

          </div>

          {/* Right Image */}
          <div className="flex items-center justify-center p-8">

            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2 }}
              src={landingImg} // ✅ fixed image import
              alt="AI Visual"
              whileHover={{ scale: 1.08, rotate: 1 }}
              className="rounded-2xl shadow-2xl"
            />

          </div>

        </div>

      </div>
    </div>
  );
}

export default HeroTemplate;
