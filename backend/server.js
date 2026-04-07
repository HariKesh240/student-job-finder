const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key";
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://hkesh2050_db_user:harirose08@cluster0.p9d6ty4.mongodb.net/studentdb?retryWrites=true&w=majority&appName=Cluster0";

app.use(cors());
app.use(express.json({ limit: "10mb" }));

let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection) {
    return cachedConnection;
  }

  cachedConnection = mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 30000,
  });

  try {
    await cachedConnection;
    console.log("MongoDB connected");
    return cachedConnection;
  } catch (error) {
    cachedConnection = null;
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({
      message: "Database connection failed",
      error: error.message,
    });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "Student Job Finder server is running" });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    dbState: mongoose.connection.readyState,
  });
});

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: String,
});
const User = mongoose.models.User || mongoose.model("User", UserSchema);

const StudentSchema = new mongoose.Schema({
  name: String,
  skills: Array,
  email: { type: String, unique: true },
  details: String,
  resume: String,
});
const Student =
  mongoose.models.Student || mongoose.model("Student", StudentSchema);

const JobSchema = new mongoose.Schema({
  companyName: String,
  jobRole: String,
  ctc: String,
  skills: [String],
  workType: { type: String, default: "On-site" },
});
const Job = mongoose.models.Job || mongoose.model("Job", JobSchema);

const CandidateSchema = new mongoose.Schema({
  studentName: String,
  studentSkills: [String],
  companyName: String,
  role: String,
  workType: String,
  appliedAt: { type: Date, default: Date.now },
  status: { type: String, default: "Pending" },
  email: String,
  comment: String,
  resume: String,
});
const Candidate =
  mongoose.models.Candidate || mongoose.model("Candidate", CandidateSchema);

app.post("/signup", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "User already exists. Please login." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashedPassword, role });

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    let redirect =
      user.role === "recruiter" ? "/admindashboard" : "/studentdashboard";

    if (user.role === "student") {
      const studentExists = await Student.findOne({ email: user.email });
      if (!studentExists) {
        redirect = "/studentdetails";
      }
    }

    res.json({ token, role: user.role, redirect });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/addstudent", async (req, res) => {
  const { name, skills, email, details, resume } = req.body;

  try {
    const student = await Student.findOneAndUpdate(
      { email },
      { name, skills, details, resume },
      { upsert: true, new: true }
    );
    res.json({ message: "Student profile saved successfully", student });
  } catch (err) {
    console.error("Add student error:", err);
    res.status(500).json({ message: "Error saving profile" });
  }
});

app.get("/getstudent/:email", async (req, res) => {
  try {
    const student = await Student.findOne({ email: req.params.email });
    res.json(student);
  } catch (err) {
    console.error("Get student error:", err);
    res.status(500).json({ message: "Failed to fetch student" });
  }
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
    console.error("Update student error:", err);
    res.status(500).json({ message: "Update failed" });
  }
});

app.post("/addjob", async (req, res) => {
  const { companyName, jobRole, ctc, skills, workType } = req.body;
  try {
    await Job.create({
      companyName,
      jobRole,
      ctc,
      skills,
      workType: workType || "On-site",
    });
    res.json({ message: "Job added successfully" });
  } catch (err) {
    console.error("Add job error:", err);
    res.status(500).json({ message: "Error adding job" });
  }
});

app.get("/getjobs", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (err) {
    console.error("Get jobs error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/updatejob/:id", async (req, res) => {
  try {
    const { companyName, jobRole, ctc, skills, workType } = req.body;

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      {
        companyName,
        jobRole,
        ctc,
        skills,
        workType,
      },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(updatedJob);
  } catch (err) {
    console.error("Update job error:", err);
    res.status(500).json({ message: "Update failed" });
  }
});

app.delete("/deletejob/:id", async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error("Delete job error:", err);
    res.status(500).json({ message: "Delete failed" });
  }
});

app.post("/applyjob", async (req, res) => {
  try {
    const {
      studentName,
      studentSkills,
      companyName,
      role,
      workType,
      email,
      resume,
    } = req.body;

    await Candidate.create({
      studentName,
      studentSkills,
      companyName,
      role,
      workType,
      status: "Pending",
      email,
      resume,
    });

    res.status(201).json({ message: "Job applied successfully" });
  } catch (err) {
    console.error("Apply job error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/getapplications", async (req, res) => {
  try {
    const applications = await Candidate.find();
    res.status(200).json(applications);
  } catch (err) {
    console.error("Get applications error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/updatestatus/:id", async (req, res) => {
  try {
    const { status, comment } = req.body;
    const updatedCandidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { status, comment },
      { new: true }
    );
    res.status(200).json(updatedCandidate);
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ message: "Failed to update status" });
  }
});

app.delete("/deleteapplication/:id", async (req, res) => {
  try {
    const deleted = await Candidate.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res.status(200).json({ message: "Application deleted successfully" });
  } catch (err) {
    console.error("Delete application error:", err);
    res.status(500).json({ message: "Failed to delete application" });
  }
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
