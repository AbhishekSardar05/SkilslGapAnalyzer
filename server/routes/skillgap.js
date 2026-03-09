const express = require("express");
const router = express.Router();
const axios = require("axios");
const SkillGap = require("../models/SkillGap");
router.post("/", async (req, res) => {

  const { userSkills, jobSkills } = req.body;

  const prompt = `
You are an expert AI Career Mentor and Skill Gap Analyzer.

Compare the user's skills with the job required skills.

User Skills:
${userSkills}

Job Required Skills:
${jobSkills}

Return ONLY valid JSON in this format:

{
 "summary": "Professional summary",

 "matchedSkills": [
  {
   "skill": "Skill name",
   "explanation": "Explain why this skill is relevant."
  }
 ],

 "missingSkills": [
  {
   "skill": "Skill name",
   "description": "Explain the skill in detail",
   "importance": "Why companies require it",
   "difficulty": "Beginner / Intermediate / Advanced",
   "estimatedLearningTime": "Example: 2-4 weeks",
   "roadmap": [
    "Step 1",
    "Step 2",
    "Step 3"
   ],
   "projects": [
    "Project idea 1",
    "Project idea 2"
   ],
   "resources": {
     "documentation": "Official docs",
     "courses": ["Course 1","Course 2"],
     "youtube": ["Video 1","Video 2"]
   }
  }
 ],

 "careerAdvice": [
  "Advice 1",
  "Advice 2",
  "Advice 3"
 ]
}

Return only JSON.
`;

  try {

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: 0.3
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "Skill Gap Analyzer"
        }
      }
    );

    let aiText = response.data.choices[0].message.content;

    console.log("AI RESPONSE:", aiText);

    // Extract JSON safely
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);

    let parsed;

    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0]);
    } else {
      parsed = {
        matchedSkills: [],
        missingSkills: [
          {
            skill: "AI Response",
            description: aiText,
            importance: "",
            roadmap: [],
            resources: {}
          }
        ]
      };
    }

    res.json(parsed);

  } catch (error) {

    console.error("AI ERROR:", error.response?.data || error.message);

    res.status(500).json({
      matchedSkills: [],
      missingSkills: [
        {
          skill: "Server Error",
          description: "AI request failed",
          importance: "",
          roadmap: [],
          resources: {}
        }
      ]
    });

  }

});

router.get("/student/:email", async (req, res) => {

  try {

    const reports = await SkillGap.find({
      email: req.params.email
    }).sort({ createdAt: -1 });

    res.json(reports);

  } catch (err) {

    res.status(500).json({ message: "Failed to fetch reports" });

  }

});

module.exports = router;