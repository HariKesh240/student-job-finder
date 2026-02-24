import React from 'react'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';

function AdminSideNav() {
  return (
    <div>
        <Navbar bg="light" className="vh-100 sticky-top" style={{ width: "150px" }}>
        <Nav variant="underline" defaultActiveKey="/" className="flex-column gap-3 px-3 py-3 fw-bold mb-auto">
          <Nav.Link as={NavLink} to="/admindashboard">Dashboard</Nav.Link>
          <Nav.Link as={NavLink} to="/addjob">Add New Jobs</Nav.Link>
          <Nav.Link as={NavLink} to="/">Logout</Nav.Link>
        </Nav>
      </Navbar>

    </div>
  )
}

export default AdminSideNav