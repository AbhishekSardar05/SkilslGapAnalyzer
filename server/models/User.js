const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,

  email: { type: String, unique: true },

  password: String,

  otp: String,

  verified: { type: Boolean, default: false },

  profilePic: { type: String, default: "" },

  bio: { type: String, default: "" },

  // ⭐ ROLE FIELD ADD
  role: {
    type: String,
    enum: ["Student", "TPO", "Admin"],
    default: "Student",
  },

  // Forgot password
  resetToken: String,
  resetTokenExpiry: Date,
});

module.exports = mongoose.model("User", userSchema);