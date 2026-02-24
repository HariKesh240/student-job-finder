import React, { useState } from "react";
import SideNav from "../components/SideNav";
import Header from "../components/Header";
import { Container, Row, Col, Button, Modal, Form, Badge } from "react-bootstrap";
import { useContext } from "react";
import { DataContext } from "../context/DataContext";
import { AuthContext } from "../context/AuthContext";
import { useEffect } from "react";
import API from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

function Studentdashboard() {

   const { user } = useContext(AuthContext);
  const { applications, fetchApplications } = useContext(DataContext);
  const [show, setShow] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const navigate = useNavigate();


  const [student, setStudent] = useState({
    name: "",
    email: "",
    skills: [],
    details: ""
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const addSkill = () => {
    if (skillInput.trim() !== "") {
      setStudent({
        ...student,
        skills: [...student.skills, skillInput.trim()]
      });
      setSkillInput("");
    }
  };

  const removeSkill = (index) => {
    const updatedSkills = student.skills.filter((_, i) => i !== index);
    setStudent({ ...student, skills: updatedSkills });
  };



  useEffect(() => {
    const getStudentProfile = async () => {
      try {
        const res = await API.get(`/getstudent/${user.email}`);
        if (res.data) {
          setStudent(res.data);
        }
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };

    getStudentProfile();
    fetchApplications();
  }, [user.email, fetchApplications]);

 const appliedCount = applications.filter(app => app.email === user.email).length;

  const handleUpdate = async () => {
    try {
      await API.put('/addstudent', student); // Reuse the addstudent route (it upserts)
      alert("Profile Updated!");
      setShow(false);
    } catch (err) {
      alert("Update failed");
    }
  };
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <SideNav />
      <div style={{ flex: 1 }}>
        <Header />
        <Container>

          <div style={{ backgroundColor: "#FFFFFF" }} className="p-3 mt-5 rounded">
            <h2>
              Welcome Back, <span className="text-primary">{student.name}</span>
            </h2>
          </div>

          <Row>
            <Col>
              <div style={{ backgroundColor: "#FFFFFF" }} className="p-4 mt-5 rounded">
                <h4>Jobs Wallet</h4>
                <Row className='mt-4'> 
                  <Col> 
                  <span className='fw-bold text-secondary'>Skill Count</span> 
                  <div className='p-3 mt-3 rounded-3 border border-1 text-center fw-bold fs-3'>{student.skills.length}</div> 
                  </Col> 
                  <Col> 
                  <span className='fw-bold text-secondary'>Job Applied</span>
                  <div className='p-3 mt-3 rounded-3 border border-1 text-center fw-bold fs-3'>
                  {appliedCount}
                  </div>    
                  </Col> 
                    </Row> 
                    <Button onClick={() => navigate('/joblist')} className='mt-5'>Explore Jobs</Button>
              </div>
            </Col>

            <Col>
              <div style={{ backgroundColor: "#FFFFFF" }} className="p-4 mt-5 rounded">
                <h4>{student.name}</h4>
                <span className="text-secondary">{student.email}</span>
                <p className="mt-3"><span className="fw-bold">About Me</span>
                <br />
                {student.details}</p>
                <p className="fw-bold mt-4">Skills Loadout</p>

                {student.skills.map((skill, index) => (
                  <Badge key={index}  className="me-2 p-2 rounded-pill custom-badge">
                    {skill}
                  </Badge>
                ))}
                <br />
                <Button
                  variant="outline-primary"
                  className="mt-4 w-25"
                  onClick={handleShow}
                >
                  Edit Profile
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* EDIT MODAL */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={student.name}
                onChange={(e) =>
                  setStudent({ ...student, name: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={student.email}
                onChange={(e) =>
                  setStudent({ ...student, email: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="textarea"
                value={student.details}
                onChange={(e) =>
                  setStudent({ ...student, details: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Skills</Form.Label>
              <div className="d-flex gap-2 mb-3">
                <Form.Control
                  type="text"
                  placeholder="Add skill"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                />
                <Button variant="outline-secondary" onClick={addSkill}>
                  Add
                </Button>
              </div>

              {student.skills.map((skill, index) => (
                <Badge
                  key={index}
                  bg="secondary"
                  className="me-2 mb-2 p-2 rounded-pill"
                  style={{ cursor: "pointer" }}
                  onClick={() => removeSkill(index)}
                >
                  {skill} ✕
                </Badge>
              ))}
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export default Studentdashboard;