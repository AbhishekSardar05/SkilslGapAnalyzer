import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import jsPDF from "jspdf";

function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const email = localStorage.getItem("email");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/resume/history/${email}`
    );
    setHistory(res.data);
  };

  const handleUpload = async () => {
    if (!file) return alert("Upload PDF resume");

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("email", email);

    setLoading(true);

    const res = await axios.post(
      "http://localhost:5000/api/resume/analyze",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    setScore(res.data.score);
    setFeedback(res.data.feedback);
    fetchHistory();
    setLoading(false);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/resume/delete/${id}`);
    fetchHistory();
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("AI Resume Analysis Report", 10, 10);
    doc.text(`Detected Role: ${feedback?.detectedRole}`, 10, 20);
    doc.text(`Score: ${score}/100`, 10, 30);
    doc.text(`ATS Score: ${feedback?.atsScore}%`, 10, 40);
    doc.text(
      `Placement Readiness: ${feedback?.placementReadiness}%`,
      10,
      50
    );
    doc.save("Resume-Analysis.pdf");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-300 via-indigo-300 to-blue-400 p-10">
      <div className="max-w-6xl mx-auto bg-white/40 backdrop-blur-xl p-10 rounded-3xl shadow-2xl">

        <h1 className="text-4xl font-bold text-purple-900 mb-8 text-center">
          AI Resume Intelligence
        </h1>

        {/* Upload */}
        <div className="flex items-center gap-4 justify-center mb-10">
          <input
            type="file"
            accept=".pdf"
            className="p-2 bg-white rounded-lg"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button
            onClick={handleUpload}
            className="px-6 py-2 bg-purple-800 text-white rounded-xl"
          >
            {loading ? "Analyzing..." : "Upload & Analyze"}
          </button>
        </div>

        {/* Score Circle */}
        {score > 0 && (
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-40 h-40 rounded-full bg-purple-800 text-white flex items-center justify-center text-3xl font-bold shadow-xl"
            >
              {score}%
            </motion.div>
          </div>
        )}

        {/* Role + ATS + Readiness */}
        {feedback && (
          <div className="grid md:grid-cols-3 gap-6 mb-10">

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-bold text-purple-700">
                Detected Role
              </h3>
              <p>{feedback.detectedRole}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-bold text-orange-600">
                ATS Match
              </h3>
              <p>{feedback.atsScore}%</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-bold text-blue-600">
                Placement Readiness
              </h3>
              <p>{feedback.placementReadiness}%</p>
            </div>

          </div>
        )}

        {/* Feedback Cards */}
        {feedback && (
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-bold text-green-600 mb-3">
                Strengths
              </h3>
              {feedback.strengths?.map((item, i) => (
                <p key={i}>• {item}</p>
              ))}
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-bold text-red-600 mb-3">
                Missing Skills
              </h3>
              {feedback.missingSkills?.map((item, i) => (
                <p key={i}>• {item}</p>
              ))}
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-bold text-blue-600 mb-3">
                Suggestions
              </h3>
              {feedback.suggestions?.map((item, i) => (
                <p key={i}>• {item}</p>
              ))}
            </div>
          </div>
        )}

        {/* Download */}
        {feedback && (
          <div className="text-center mb-10">
            <button
              onClick={downloadPDF}
              className="px-6 py-2 bg-green-600 text-white rounded-xl"
            >
              Download PDF Report
            </button>
          </div>
        )}

        {/* History */}
        <h2 className="text-2xl font-bold mb-6 text-purple-900">
          Previous Analysis
        </h2>

        {history.map((item) => (
          <div
            key={item._id}
            className="bg-white p-5 mb-4 rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <p className="text-sm text-gray-500">
                {new Date(item.createdAt).toLocaleString()}
              </p>
              <p className="font-semibold">
                Score: {item.score}/100
              </p>
            </div>

            <button
              onClick={() => handleDelete(item._id)}
              className="px-4 py-1 bg-red-500 text-white rounded-lg"
            >
              Delete
            </button>
          </div>
        ))}

      </div>
    </div>
  );
}

export default ResumeAnalyzer;