require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const resumeRoutes = require("./routes/resume");




const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/uploads", express.static("uploads"));
app.use("/api/resume", resumeRoutes);

app.listen(5000, () =>
  console.log("Server running on port 5000")
);
