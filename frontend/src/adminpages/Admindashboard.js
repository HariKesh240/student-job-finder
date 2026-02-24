import React, { useEffect, useContext } from 'react';
import { DataContext } from '../context/DataContext';
import API from '../api/axiosConfig';
import { Table, Badge, Button, Container, Row, Col} from 'react-bootstrap';
import AdminSideNav from '../components/AdminSideNav';
import Header from '../components/Header';

function Admindashboard() {
  const { applications, fetchApplications } = useContext(DataContext);

  useEffect(() => { 
  fetchApplications(); 
}, [fetchApplications]);

  const updateStatus = async (id, status) => {
    const comment = window.prompt(`Enter comment for ${status}:`);
    if (comment === null) return; // Cancelled

    try {
      await API.put(`/updatestatus/${id}`, { status, comment }); // Note: Ensure backend supports 'comment'
      alert(`Candidate ${status}`);
      fetchApplications();
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
      <div style={{ display: "flex", minHeight: "100vh" }}>
            <AdminSideNav />
            <div style={{ flex: 1 }}>
              <Header />
    <Container className="mt-5">
      <Row className='mb-5'>
        <Col md={9}>
      <div style={{ backgroundColor: "#FFFFFF" }} className="p-3 rounded">
            <h2>
              Welcome Back, <span className="text-primary">Admin</span>
            </h2>
          </div>
        </Col>
        <Col md={3}>
          <div style={{ backgroundColor: "#FFFFFF" }} className="p-3 rounded">
            <Row>
              <Col md={8}>
                          <h5>Total Candidate</h5>
              </Col>
              <Col md={4}>
                            <div className=' rounded-3 border border-1 text-center fw-bold fs-4'>{applications.length}</div> 
              </Col>
            </Row>
                        </div>
        </Col>
      </Row>

          
      <Table hover className=' bg-white shadow-sm'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Skills</th>
            <th>Company</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(app => (
            <tr key={app._id}>
              <td>{app.studentName}</td>
              <td>{app.studentSkills?.join(", ")}</td>
              <td>{app.companyName}</td>
              <td>{app.role}</td>
              <td>
                <Badge bg={app.status === 'Selected' ? 'success' : app.status === 'Rejected' ? 'danger' : 'warning'}>
                  {app.status}
                </Badge>
              </td>
              <td>
                <Button size="sm" variant="success" onClick={() => updateStatus(app._id, 'Selected')}>Approve</Button>
                <Button size="sm" variant="danger" className="ms-2" onClick={() => updateStatus(app._id, 'Rejected')}>Reject</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
          
          
    </Container>
    </div>
    </div>
  );
}
export default Admindashboard;