const express = require("express");
const router = express.Router();
const User = require("../models/User");
const upload = require("../utils/upload");
const crypto = require("crypto");


// ==============================
// GET PROFILE
// ==============================

router.get("/:email", async (req, res) => {

  try {

    const user = await User.findOne({ email: req.params.email });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    let avatar = user.profilePic;

    if (!avatar) {

      const hash = crypto
        .createHash("md5")
        .update(user.email.trim().toLowerCase())
        .digest("hex");

      avatar = `https://www.gravatar.com/avatar/${hash}?d=identicon`;

    }

    res.json({ ...user._doc, avatar });

  } catch (err) {

    res.status(500).json({ message: "Profile fetch failed" });

  }

});


// ==============================
// UPDATE PROFILE
// ==============================

router.post("/update", upload.single("profilePic"), async (req, res) => {

  try {

    const { email, username, bio } = req.body;

    const updateData = { username, bio };

    if (req.file) {
      updateData.profilePic = req.file.filename;
    }

    await User.updateOne({ email }, updateData);

    res.json({ message: "Profile updated" });

  } catch (err) {

    res.status(500).json({ message: "Profile update failed" });

  }

});


// ==============================
// GET ALL STUDENTS (TPO)
// ==============================

router.get("/students/list", async (req, res) => {

  try {

    const students = await User.find(
      { role: "Student", verified: true },
      "username email profilePic"
    );

    res.json(students);

  } catch (err) {

    res.status(500).json({ message: "Failed to fetch students" });

  }

});


router.get("/admin/users", async (req, res) => {
  try {

    const users = await User.find(
      {},
      { username: 1, email: 1, role: 1 }
    );

    res.json(users);

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

router.get("/admin/users", async (req, res) => {
  try {

    const users = await User.find(
      {},
      { username: 1, email: 1, role: 1 }
    );

    res.json(users);

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

router.post("/admin/role", async (req, res) => {

  const { email, role } = req.body;

  try {

    await User.updateOne(
      { email },
      { role }
    );

    res.json({ message: "Role updated" });

  } catch (err) {

    res.status(500).json({ message: "Update failed" });

  }

});

module.exports = router;