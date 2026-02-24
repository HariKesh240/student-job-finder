import React, { useState, useContext } from "react"; // Added useContext
import { Button, Badge } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Header from "../components/Header";
import { AuthContext } from "../context/AuthContext"; // Import Auth
import API from "../api/axiosConfig"; // Import API
import { useNavigate } from "react-router-dom"; // Import Navigate

function Studentdetails() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);
  const [details, setDetails] = useState("");

  const addSkill = () => {
    if (skillInput.trim() !== "") {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (index) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const studentData = {
      name,
      skills,
      details,
      email: user.email // Get email from context
    };

    try {
      await API.put('/addstudent', studentData);
      alert("Profile Created Successfully!");
      navigate('/studentdashboard'); // Redirect to dashboard
    } catch (err) {
      alert("Failed to save profile. Please try again.");
    }
  };

  return (
    <div>
      <Header />

      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div
          style={{ backgroundColor: "#FFFFFF" }}
          className="col-md-6 p-5 shadow rounded-3"
        >
          <Form onSubmit={handleSubmit}>
            <h5 className="mb-3 text-center">Student Profile</h5>

            {/* Name */}
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            {/* Skills */}
            <Form.Group className="mb-3">
              <Form.Label>Skills</Form.Label>
              <div className="d-flex gap-2">
                <Form.Control
                  type="text"
                  placeholder="Add a skill"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                />
                <Button variant="outline-secondary" onClick={addSkill}>
                  Add
                </Button>
              </div>

              <div className="mt-3">
                {skills.map((skill, index) => (
                  <Badge
                    bg="primary"
                    key={index}
                    className="me-2 p-2 mt-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => removeSkill(index)}
                  >
                    {skill} ✕
                  </Badge>
                ))}
              </div>
            </Form.Group>

            {/* Additional Details */}
            <Form.Group className="mb-3">
              <Form.Label>Additional Details</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Tell us more about yourself..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </Form.Group>

            <Button variant="outline-primary" className="w-100" type="submit">
              Submit
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Studentdetails;