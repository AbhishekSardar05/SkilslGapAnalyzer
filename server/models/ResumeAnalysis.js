const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  email: String,
  resumeText: String,
  feedback: Object,   // ✅ JSON object
  score: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ResumeAnalysis", resumeSchema);