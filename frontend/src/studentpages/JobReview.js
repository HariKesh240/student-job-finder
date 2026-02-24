import React, { useEffect, useContext, useState } from 'react'; // Added useState
import { DataContext } from '../context/DataContext';
import { AuthContext } from '../context/AuthContext';
import { Container, Table, Badge, Form, Button } from 'react-bootstrap';
import API from '../api/axiosConfig'; // Added API
import SideNav from '../components/SideNav';
import Header from '../components/Header';

function Jobreview() {
  const { applications, fetchApplications } = useContext(DataContext);
  const { user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState(""); // State for search

  useEffect(() => { 
    fetchApplications(); 
  }, [fetchApplications]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this application?")) {
      try {
        await API.delete(`/deleteapplication/${id}`);
        alert("Application removed.");
        fetchApplications(); // Refresh list
      } catch (err) {
        alert("Error deleting application.");
      }
    }
  };

  // 1. Filter by logged-in student 
  // 2. Filter by search term
  const myApplications = applications.filter(app => 
    app.email === user?.email && 
    app.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <SideNav />
      <div style={{ flex: 1 }}>
        <Header />
        <Container className="mt-5">
          <div className='border'>
            <h4 className='mt-5 ms-3'>My Jobs</h4>
            <div style={{ backgroundColor: "#FFFFFF" }} className="p-3 mt-3 rounded">
              <Form.Control 
                className='w-25' 
                placeholder="Search company..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Table hover className="mt-4 custom-table shadow-sm">
                <thead className="table-light">
                  <tr>
                    <th>Company</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Admin Comment</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {myApplications.map(app => (
                    <tr key={app._id}>
                      <td>{app.companyName}</td>
                      <td>{app.role}</td>
                      <td>
                        <Badge bg={app.status === 'Selected' ? 'success' : app.status === 'Rejected' ? 'danger' : 'warning'}>
                          {app.status}
                        </Badge>
                      </td>
                      <td>{app.comment || "No comments yet"}</td>
                      <td>
                        {/* Only allow delete if status is NOT Pending */}
                        {app.status !== 'Pending' && (
                          <Button 
                            size="sm" 
                            variant="outline-danger" 
                            onClick={() => handleDelete(app._id)}
                          >
                            Delete
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
export default Jobreview;