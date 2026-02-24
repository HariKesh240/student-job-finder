import React from 'react'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

function Header() {
  return (
    <div>
        <Navbar bg="light" data-bs-theme="light">
        <Container>
          <Navbar.Brand className='fw-bold ms-4 fs-4'>Job Finder</Navbar.Brand>
        </Container>
      </Navbar>
    </div>
  )
}

export default Header