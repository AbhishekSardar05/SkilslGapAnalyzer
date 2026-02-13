const express = require("express");
const router = express.Router();
const User = require("../models/User");
const sendOTP = require("../utils/sendEmail");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// SIGNUP → Send OTP
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  // Check existing verified user
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
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !user.verified)
    return res.status(400).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);

  if (!match)
    return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.json({ token });
});

module.exports = router;
