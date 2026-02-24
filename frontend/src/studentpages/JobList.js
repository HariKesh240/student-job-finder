import React, { useEffect, useState, useContext } from 'react';
import { DataContext } from '../context/DataContext';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axiosConfig';
import { Container, Row, Col, Form, InputGroup, Card, Badge, Button } from 'react-bootstrap';
import SearchIcon from '@mui/icons-material/Search';
import SideNav from '../components/SideNav';
import Header from '../components/Header';

function Joblist() {
  const { jobs, fetchJobs, applications, fetchApplications } = useContext(DataContext);
  const { user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterWorkType, setFilterWorkType] = useState('');

  useEffect(() => { 
    fetchJobs(); 
    fetchApplications(); // Ensure we have latest applications to check status
  }, [fetchJobs, fetchApplications]);

  const handleApply = async (job) => {
    try {
      const studentRes = await API.get(`/getstudent/${user.email}`);
      const student = studentRes.data;

      const applicationData = {
        studentName: student.name,
        studentSkills: student.skills,
        companyName: job.companyName,
        role: job.jobRole,
        workType: job.workType,
        email: user.email
      };

      await API.post('/applyjob', applicationData);
      alert("Applied Successfully!");
      fetchApplications(); // Refresh local application list
    } catch (err) {
      alert("Error applying. Make sure your profile is complete.");
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterWorkType === '' || job.workType === filterWorkType)
  );

  // Function to check if student already applied for this job
  const checkIfApplied = (job) => {
    return applications.some(app => 
      app.email === user.email && 
      app.companyName === job.companyName && 
      app.role === job.jobRole
    );
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <SideNav />
      <div style={{ flex: 1 }}>
        <Header />
        <Container>
          <h3 className='fw-bold mt-5'>Jobs Available</h3>
          <div className='p-3 mt-3 rounded bg-white shadow-sm'>
            <Row>
              <Col md={6}>
                <InputGroup>
                  <InputGroup.Text><SearchIcon /></InputGroup.Text>
                  <Form.Control placeholder="Search company..." onChange={(e) => setSearchTerm(e.target.value)} />
                </InputGroup>
              </Col>
              <Col md={6}>
                <Form.Select onChange={(e) => setFilterWorkType(e.target.value)}>
                  <option value="">All Work Types</option>
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                </Form.Select>
              </Col>
            </Row>
          </div>

          <Row className='mt-5'>
            {filteredJobs.map(job => {
              const alreadyApplied = checkIfApplied(job); // Check status
              
              return (
                <Col key={job._id} md={4} className="mb-4">
                  <Card className='p-2 shadow-sm'>
                    <Card.Body>
                      <Card.Title>{job.jobRole} - {job.ctc} LPA</Card.Title>
                      <Card.Subtitle className="mb-3 text-muted">{job.companyName} | {job.workType}</Card.Subtitle>
                      <Card.Text>
                        <span className='fw-bold'>Skills:</span><br/>
                        {job.skills?.map(s => <Badge key={s} className='me-1 bg-info custom-badge'>{s}</Badge>)}
                        
                      </Card.Text>
                      
                      <Button 
                        onClick={() => handleApply(job)} 
                        variant={alreadyApplied ? 'primary' : 'outline-primary'} 
                        className='w-100'
                        disabled={alreadyApplied}
                      >
                        {alreadyApplied ? "Job Applied!" : "Apply Job"}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Container>
      </div>
    </div>
  );
}
export default Joblist;