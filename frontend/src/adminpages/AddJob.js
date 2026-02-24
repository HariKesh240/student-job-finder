import React, { useState, useEffect, useContext } from 'react';
import { DataContext } from '../context/DataContext';
import API from '../api/axiosConfig';
import { Badge, Container, Table, Button, Col, Form, Row } from 'react-bootstrap';
import AdminSideNav from '../components/AdminSideNav';
import Header from '../components/Header';

function AddJob() {
  const { jobs, fetchJobs } = useContext(DataContext);
  
  // Form States
  const [formData, setFormData] = useState({ companyName: '', jobRole: '', ctc: '', workType: 'On-site' });
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);
  
  // Edit States
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const addSkill = () => {
    if (skillInput.trim() !== "") {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  // Pre-fill form for editing
  const handleEditClick = (job) => {
    setIsEditing(true);
    setEditId(job._id);
    setFormData({
      companyName: job.companyName,
      jobRole: job.jobRole,
      ctc: job.ctc,
      workType: job.workType || 'On-site'
    });
    setSkills(job.skills || []);
    window.scrollTo(0, 0); // Scroll to form
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // UPDATE Logic
        await API.put(`/updatejob/${editId}`, { ...formData, skills });
        alert("Job Updated Successfully!");
      } else {
        // ADD Logic
        await API.post('/addjob', { ...formData, skills });
        alert("Job Added Successfully!");
      }
      
      // Reset Form
      setFormData({ companyName: '', jobRole: '', ctc: '', workType: 'On-site' });
      setSkills([]);
      setIsEditing(false);
      setEditId(null);
      fetchJobs(); // Refresh table
    } catch (err) {
      alert("Error processing request");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await API.delete(`/deletejob/${id}`);
      fetchJobs();
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSideNav />
      <div style={{ flex: 1 }}>
        <Header />
        <Container>
          <div className='border rounded-3 mt-5 p-4'>
            <h3>{isEditing ? "Update Job" : "Add New Job!"}</h3>
            <Form className='mt-4' onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Form.Group as={Col} md="4">
                  <Form.Label>Company Name</Form.Label>
                  <Form.Control required type="text" value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} />
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>Job Role</Form.Label>
                  <Form.Control required type="text" value={formData.jobRole} onChange={(e) => setFormData({...formData, jobRole: e.target.value})} />
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>CTC</Form.Label>
                  <Form.Control required type="text" value={formData.ctc} onChange={(e) => setFormData({...formData, ctc: e.target.value})} />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Label>Skills (Add multiple)</Form.Label>
                  <div className='d-flex gap-2'>
                    <Form.Control type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} />
                    <Button variant='secondary' onClick={addSkill}>Add</Button>
                  </div>
                  <div className='mt-2'>
                    {skills.map((s, i) => (
                      <Badge key={i} onClick={() => removeSkill(i)} className='me-1 bg-primary' style={{cursor:'pointer'}}>{s} x</Badge>
                    ))}
                  </div>
                </Col>
                <Col md={6}>
                   <Form.Label>Work Type</Form.Label>
                   <Form.Select value={formData.workType} onChange={(e) => setFormData({...formData, workType: e.target.value})}>
                      <option value="On-site">On-site</option>
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                   </Form.Select>
                </Col>
              </Row>
              <Button className='w-100' variant={isEditing ? "success" : "primary"} type="submit">
                {isEditing ? "Update Job" : "Add New Job"}
              </Button>
              {isEditing && <Button variant="link" className='w-100' onClick={() => { setIsEditing(false); setFormData({companyName:'', jobRole:'', ctc:''}); setSkills([]); }}>Cancel Edit</Button>}
            </Form>

            <Table className='mt-5' hover>
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Job Role</th>
                  <th>Skills</th>
                  <th>CTC</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job._id}>
                    <td>{job.companyName}</td>
                    <td>{job.jobRole}</td>
                    <td>{job.skills?.map(s => <Badge key={s} className='custom-badge rounded-pill me-1'>{s}</Badge>)}</td>
                    <td>{job.ctc}</td>
                    <td>
                      <Button size='sm' variant='outline-primary' className='me-2' onClick={() => handleEditClick(job)}>Edit</Button>
                      <Button size='sm' variant='outline-danger' onClick={() => handleDelete(job._id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Container>
      </div>
    </div>
  );
}

export default AddJob;