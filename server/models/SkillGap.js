const mongoose = require("mongoose");

const skillGapSchema = new mongoose.Schema({

 email: String,
 userSkills: String,
 jobSkills: String,
 result: Object,

 createdAt: {
   type: Date,
   default: Date.now
 }

});

module.exports = mongoose.model("SkillGap", skillGapSchema);