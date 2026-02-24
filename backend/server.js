// Importing required libraries
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const JWT_SECRET = "your_super_secret_key";

app.use(cors());
app.use(express.json());


// Connect MongoDB
mongoose.connect("mongodb://localhost:27017/studentdb")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// User Auth Schema
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: String 
});
const User = mongoose.model("User", UserSchema);

// Signup
app.post("/signup", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) {
      // Return 409 Conflict if user exists
      return res.status(409).json({ message: "User already exists. Please login." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashedPassword, role });
    
    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    // Determine redirect
    let redirect = user.role === "recruiter" ? "/admindashboard" : "/studentdashboard";
    
    // Check if student profile exists
    if (user.role === "student") {
      const studentExists = await Student.findOne({ email });
      if (!studentExists) redirect = "/studentdetails";
    }

    res.json({ token, role: user.role, redirect });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});




// Student Data Schema
const StudentSchema = new mongoose.Schema({
    name: String,
    skills: Array,
    email: { type: String, unique: true },
    details: String
});

const Student = mongoose.model("Student", StudentSchema);
app.put("/addstudent", async (req, res) => {
  const { name, skills, email, details } = req.body;
  
  try {
    const student = await Student.findOneAndUpdate(
      { email }, 
      { name, skills, details },
      { upsert: true, new: true }
    );
    res.json({ message: "Student profile saved successfully", student });
  } catch (err) {
    res.status(500).json({ message: "Error saving profile" });
  }
});



app.get("/getstudent/:email", async (req, res) => {
  const student = await Student.findOne({ email: req.params.email });
  res.json(student);
});

app.put("/updatestudent/:id", async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedStudent);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});


// Job DB
const JobSchema = new mongoose.Schema({
  companyName: String,
  jobRole: String,
  ctc: String,
  skills: [String],
  workType: { type: String, default: "On-site" } // Defaulting for compatibility
});
const Job = mongoose.model("Job", JobSchema);

app.post("/addjob", async (req, res) => {
  const { companyName, jobRole, ctc, skills, workType } = req.body;
  try {
    await Job.create({ companyName, jobRole, ctc, skills, workType: workType || "On-site" });
    res.json({ message: "Job added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error adding job" });
  }
});

app.get("/getjobs", async (req, res) => {
    try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
})

// Edit Job
  app.put("/updatejob/:id", async (req, res) => {
  try {
    const { companyName, jobRole, ctc, skills, workType } = req.body;

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      {
        companyName, // Corrected from company
        jobRole,     // Corrected from role
        ctc,
        skills,
        workType
      },
      { new: true }
    );

    if (!updatedJob) return res.status(404).json({ message: "Job not found" });
    res.status(200).json(updatedJob);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

// Delete Job
app.delete("/deletejob/:id", async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
});


// Candidate DB
const CandidateSchema = new mongoose.Schema({
  studentName: String,
  studentSkills: [String],
  companyName: String,
  role: String,
  workType: String,
  appliedAt: { type: Date, default: Date.now },
  status: { type: String, default: "Pending" },
  email: String,
  comment: String // Added comment field
});


const Candidate = mongoose.model("Candidate", CandidateSchema);
// Apply Job
app.post("/applyjob", async (req, res) => {
  try {
    const {
      studentName,
      studentSkills,
      companyName,
      role,
      workType,
      email
    } = req.body;

    const status = "Pending"

    if (
      !studentName ||
      !studentSkills ||
      !companyName ||
      !role ||
      !workType ||
      !email
    ) {
      return res.status(400).json({ message: "Error Occured" });
    }

    await Candidate.create({
      studentName,
      studentSkills,
      companyName,
      role,
      workType,
      status,
      email
    });

    res.status(201).json({ message: "Job applied successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
//get job
app.get("/getapplications", async (req, res) => {
  try {
    const applications = await Candidate.find();
    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// selected or rejected
app.put("/updatestatus/:id", async (req, res) => {
  try {
    const { status, comment } = req.body;
    const updatedCandidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { status, comment }, // Saves both status and comment
      { new: true }
    );
    res.status(200).json(updatedCandidate);
  } catch (err) {
    res.status(500).json({ message: "Failed to update status" });
  }
});

// Delete candidate
app.delete("/deleteapplication/:id", async (req, res) => {
  try {
    const deleted = await Candidate.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res.status(200).json({ message: "Application deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete application" });
  }
});





app.listen(4000, () => console.log("Server Running on port 4000"));