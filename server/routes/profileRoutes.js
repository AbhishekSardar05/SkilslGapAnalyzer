const express = require("express");
const router = express.Router();
const User = require("../models/User");
const upload = require("../utils/upload");
const crypto = require("crypto");

// GET PROFILE
router.get("/:email", async (req, res) => {
  const user = await User.findOne({ email: req.params.email });

  if (!user) return res.status(404).json({ message: "User not found" });

  // Generate gravatar if no profile picture uploaded
  let avatar = user.profilePic;

  if (!avatar) {
    const hash = crypto
      .createHash("md5")
      .update(user.email.trim().toLowerCase())
      .digest("hex");

    avatar = `https://www.gravatar.com/avatar/${hash}?d=identicon`;
  }

  res.json({ ...user._doc, avatar });
});

// UPDATE PROFILE
router.post("/update", upload.single("profilePic"), async (req, res) => {
  const { email, username, bio } = req.body;

  const updateData = { username, bio };

  if (req.file) {
    updateData.profilePic = req.file.filename;
  }

  await User.updateOne({ email }, updateData);

  res.json({ message: "Profile updated" });
});

module.exports = router;