const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const axios = require("axios");
const ResumeAnalysis = require("../models/ResumeAnalysis");

const router = express.Router();

// ================================
// Multer Setup (PDF Only)
// ================================
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"), false);
    }
    cb(null, true);
  },
});

// ================================
// 🚀 Resume Analyze API (OpenRouter)
// ================================
router.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    console.log("API HIT");

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ message: "OpenRouter API key missing" });
    }

    const { email } = req.body;
    const filePath = req.file.path;

    // Extract PDF text
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.length < 50) {
      return res.status(400).json({ message: "Resume content too short" });
    }

    // 🔥 Call OpenRouter API
    const aiResponse = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `
You are an AI Resume Evaluator.

Analyze the following resume carefully.

Based on the resume content, automatically identify:
- The candidate's primary domain (e.g., Frontend, Backend, Full Stack, Data Science, AI, DevOps, etc.)
- Skill strengths
- Skill gaps
- Areas of improvement

Return ONLY valid JSON in this format:

{
  "detectedRole": "string",
  "score": number (0-100),
  "atsScore": number (0-100),
  "placementReadiness": number (0-100),
  "strengths": ["point1", "point2"],
  "missingSkills": ["skill1", "skill2"],
  "suggestions": ["suggestion1", "suggestion2"]
}

Resume:
${resumeText}
            `,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const text = aiResponse.data.choices[0].message.content;

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      console.log("AI JSON parse error:", text);
      return res.status(500).json({ message: "AI response format invalid" });
    }

    const score = parsed.score;

    // Save to MongoDB
    const newAnalysis = new ResumeAnalysis({
      email,
      resumeText,
      feedback: parsed,
      score,
    });

    await newAnalysis.save();

    res.json({
      score,
      feedback: parsed,
    });

  } catch (err) {
    console.log("FULL ERROR:", err.response?.data || err.message);
    res.status(500).json({ message: "Resume analysis failed" });
  }
});

// ================================
// 📜 Get Resume History
// ================================
router.get("/history/:email", async (req, res) => {
  try {
    const history = await ResumeAnalysis.find({
      email: req.params.email,
    }).sort({ createdAt: -1 });

    res.json(history);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch history" });
  }
});
// Get Student Resume Data

router.get("/student/:email", async (req, res) => {

  try {

    const data = await ResumeAnalysis.find({
      email: req.params.email
    }).sort({ createdAt: -1 });

    res.json(data);

  } catch (err) {

    res.status(500).json({ message: "Failed to fetch resume data" });

  }

});

// ================================
// 🗑 Delete Resume Analysis
// ================================
router.delete("/delete/:id", async (req, res) => {
  try {
    await ResumeAnalysis.findByIdAndDelete(req.params.id);
    res.json({ message: "Analysis deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;