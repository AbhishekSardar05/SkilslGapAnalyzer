const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
  otp: String,
  verified: { type: Boolean, default: false },

  profilePic: { type: String, default: "" },
  bio: { type: String, default: "" },

  // 🔥 ADD THESE FOR FORGOT PASSWORD
  resetToken: String,
  resetTokenExpiry: Date,
});

module.exports = mongoose.model("User", userSchema);