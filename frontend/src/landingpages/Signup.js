import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import API from '../api/axiosConfig';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // Default role
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await API.post('/signup', { email, password, role });
      alert("Signup Successful! Please Login.");
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <div className="col-md-5 mx-auto p-5 rounded-3 bg-white shadow">
        <Form onSubmit={handleSignup}>
          <h5 className="mb-3 text-center">Create Your Account</h5>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" required onChange={(e) => setEmail(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" required onChange={(e) => setPassword(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Register As</Form.Label>
            <div>
              <Form.Check inline type="radio" label="Admin" name="role" 
                onChange={() => setRole('recruiter')} checked={role === 'recruiter'} />
              <Form.Check inline type="radio" label="Student" name="role" 
                onChange={() => setRole('student')} checked={role === 'student'} />
            </div>
          </Form.Group>
          <Button type="submit" variant="outline-primary" className="w-100">Signup</Button>
          <p className="text-center mt-3">Already have an account? <Link to="/">Login</Link></p>
        </Form>
      </div>
    </div>
  );
}
export default Signup;