const express = require("express");
const router = express.Router();
const User = require("../models/User");
const sendOTP = require("../utils/sendEmail");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");


// SIGNUP → Send OTP
router.post("/signup", async (req, res) => {

  const { username, email, password } = req.body;

  const existingUser = await User.findOne({
    email,
    verified: true,
  });

  if (existingUser) {
    return res.status(400).json({
      message: "User already exists. Please login.",
    });
  }

  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  let user = await User.findOne({ email });

  if (!user) {

    user = new User({
      username,
      email,
      password: await bcrypt.hash(password, 10),

      // ⭐ FORCE ROLE
      role: "Student",
    });
  }

  user.otp = otp;

  await user.save();

  await sendOTP(email, otp);

  res.json({ message: "OTP sent" });

});
// VERIFY OTP
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user || user.otp !== otp)
    return res.status(400).json({ message: "Invalid OTP" });

  user.verified = true;
  user.otp = null;
  await user.save();

  res.json({ message: "Account verified" });
});


// LOGIN
router.post("/login", async (req, res) => {

  const { email, password, role } = req.body;

  const user = await User.findOne({ email });

  if (!user || !user.verified)
    return res.status(400).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);

  if (!match)
    return res.status(400).json({ message: "Wrong password" });

  // ⭐ ROLE CHECK
  if (user.role !== role) {
    return res.status(403).json({
      message: "Access denied for this role",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET
  );

  res.json({
    token,
    role: user.role,
  });

});
// forget password
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});


// 🔥 FORGOT PASSWORD
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    await transporter.sendMail({
      to: email,
      subject: "Password Reset",
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    });

    res.json({ message: "Reset link sent to email" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// 🔥 RESET PASSWORD
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash new password
    user.password = await bcrypt.hash(password, 10);

    // Clear reset fields
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
