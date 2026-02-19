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
    let redirect = user.role === "recruiter" ? "/recruiterdashboard" : "/studentdashboard";
    
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
    name : String,
    year : Number,
    skills : Array,
    email : String
})

const Student = mongoose.model("Student", StudentSchema);

app.put("/addstudent", async (req, res) => {
  const { name, year, skills, email } = req.body;
  if (!name || !year || !skills || !email)
    return res.status(400).json({ message: "All fields required" });

  // Use findOneAndUpdate with 'upsert' to prevent duplicates
  await Student.findOneAndUpdate(
    { email }, 
    { name, year, skills }, 
    { upsert: true, new: true }
  );

  res.json({ message: "Student profile saved successfully" });
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
  company: String,
  role: String,
  workType: String,
  skills: [String]
});

const Job = mongoose.model("Job", JobSchema);

app.post("/addjob", async (req, res) => {
  const {company, role, workType, skills} = req.body;
    if (!company || !role || !skills || !workType) return res.json({message : "All the field must be filled!"})
    await Job.create({company, role, skills, workType});
    res.json({message : "Registration Successfull!"});
})

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
    const { company, role, workType, skills } = req.body;

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      {
        company,
        role,
        workType,
        skills
      },
      { new: true } // returns updated document
    );

    res.status(200).json(updatedJob);
  } catch (err) {
    console.error(err);
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
  appliedAt: {
    type: Date,
    default: Date.now
  },
  status: String,
  email : String
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

    const status = "pending"

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
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const updatedCandidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedCandidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res.status(200).json(updatedCandidate);
  } catch (err) {
    console.error(err);
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



// Google autho
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client("YOUR_GOOGLE_CLIENT_ID");

app.post("/google-auth", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "YOUR_GOOGLE_CLIENT_ID",
    });

    const payload = ticket.getPayload();

    const user = {
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
    };

    // TODO:
    // 1. Check if user exists in DB
    // 2. If not, create user
    // 3. Generate JWT

    res.json(user);
  } catch (err) {
    res.status(401).json({ message: "Invalid Google token" });
  }
});


app.listen(4000, () => console.log("Server Running on port 4000"));