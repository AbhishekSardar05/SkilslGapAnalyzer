import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import jsPDF from "jspdf";

import heroImg from "../assets/resume1.png";
import analysisImg from "../assets/resume2.png";
import skillImg from "../assets/resume3.png";
import historyImg from "../assets/resume4.png";

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

    if (!file) return alert("Upload PDF Resume");

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
    doc.text(`Placement Readiness: ${feedback?.placementReadiness}%`, 10, 50);

    doc.save("Resume-Analysis.pdf");
  };

  return (

<motion.div
initial={{opacity:0}}
animate={{opacity:1}}
className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 p-10"
>

<div className="max-w-7xl mx-auto">

{/* HERO SECTION */}

<div className="grid md:grid-cols-2 gap-10 items-center mb-16">

<motion.div
initial={{x:-50,opacity:0}}
animate={{x:0,opacity:1}}
transition={{duration:0.7}}
>

<h1 className="text-5xl font-bold text-white leading-tight mb-6">
AI Resume Intelligence Platform
</h1>

<p className="text-white/80 text-lg mb-6">
Upload your resume and let AI analyze your skills, ATS compatibility
and placement readiness instantly.
</p>

</motion.div>

<motion.img
src={heroImg}
initial={{x:50,opacity:0}}
animate={{x:0,opacity:1}}
transition={{duration:0.7}}
className="w-full"
/>

</div>


{/* GLASS CONTAINER */}

<div className="bg-white/20 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/40">


{/* Upload Section */}

<div className="grid md:grid-cols-2 gap-10 items-center mb-16">

<motion.img
src={analysisImg}
initial={{opacity:0}}
animate={{opacity:1}}
className="w-full"
/>

<div>

<h2 className="text-3xl text-white font-bold mb-6">
Upload Resume for AI Analysis
</h2>

<div className="flex gap-4">

<input
type="file"
accept=".pdf"
className="p-2 bg-white border rounded-lg"
onChange={(e)=>setFile(e.target.files[0])}
/>

<motion.button
whileHover={{scale:1.05}}
whileTap={{scale:0.95}}
onClick={handleUpload}
className="px-6 py-2 bg-purple-700 text-white rounded-xl shadow-lg"
>
{loading ? "Analyzing Resume..." : "Upload & Analyze"}
</motion.button>

</div>

</div>

</div>


{/* SCORE */}

{score > 0 && (

<div className="flex justify-center mb-16">

<motion.div
initial={{scale:0}}
animate={{scale:1}}
transition={{duration:0.6}}
className="w-48 h-48 rounded-full bg-purple-800 text-white flex items-center justify-center text-5xl font-bold shadow-2xl"
>

{score}%

</motion.div>

</div>

)}


{/* ANALYSIS SECTION */}

{feedback && (

<div className="grid md:grid-cols-2 gap-10 items-center mb-16">

<div>

<div className="grid md:grid-cols-3 gap-6">

<div className="bg-white p-6 rounded-xl shadow-lg">
<h3 className="font-bold text-purple-700 mb-2">Detected Role</h3>
<p>{feedback.detectedRole}</p>
</div>

<div className="bg-white p-6 rounded-xl shadow-lg">
<h3 className="font-bold text-orange-600 mb-2">ATS Score</h3>
<p>{feedback.atsScore}%</p>
</div>

<div className="bg-white p-6 rounded-xl shadow-lg">
<h3 className="font-bold text-blue-600 mb-2">Placement Readiness</h3>
<p>{feedback.placementReadiness}%</p>
</div>

</div>

</div>

<motion.img
src={skillImg}
animate={{y:[0,-10,0]}}
transition={{repeat:Infinity,duration:3}}
className="w-full"
/>

</div>

)}


{/* FEEDBACK CARDS */}

{feedback && (

<div className="grid md:grid-cols-3 gap-8 mb-16">

<div className="bg-white p-6 rounded-xl shadow-lg">
<h3 className="font-bold text-green-600 mb-4">Strengths</h3>
{feedback.strengths?.map((s,i)=>(<p key={i}>• {s}</p>))}
</div>

<div className="bg-white p-6 rounded-xl shadow-lg">
<h3 className="font-bold text-red-600 mb-4">Missing Skills</h3>
{feedback.missingSkills?.map((s,i)=>(<p key={i}>• {s}</p>))}
</div>

<div className="bg-white p-6 rounded-xl shadow-lg">
<h3 className="font-bold text-blue-600 mb-4">Suggestions</h3>
{feedback.suggestions?.map((s,i)=>(<p key={i}>• {s}</p>))}
</div>

</div>

)}


{/* DOWNLOAD */}

{feedback && (

<div className="text-center mb-16">

<motion.button
whileHover={{scale:1.1}}
whileTap={{scale:0.9}}
onClick={downloadPDF}
className="px-10 py-3 bg-green-600 text-white rounded-xl shadow-lg"
>

Download PDF Report

</motion.button>

</div>

)}


{/* HISTORY */}

<div className="grid md:grid-cols-2 gap-10 items-center mb-10">

<motion.img
src={historyImg}
className="w-full"
/>

<div>

<h2 className="text-2xl font-bold text-white mb-6">
Previous Resume Analysis
</h2>

{history.map((item)=>(
<motion.div
key={item._id}
initial={{opacity:0,x:-20}}
animate={{opacity:1,x:0}}
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
onClick={()=>handleDelete(item._id)}
className="px-4 py-1 bg-red-500 text-white rounded-lg"
>

Delete

</button>

</motion.div>
))}

</div>

</div>

</div>

</div>

</motion.div>

  );
}

export default ResumeAnalyzer;