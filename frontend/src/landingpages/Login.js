import React, { useState, useContext } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/login', { email, password });
      login({ email, role: res.data.role }, res.data.token);
      alert("Login Successful");
      navigate(res.data.redirect);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <div className='col-md-5 mx-auto p-5 rounded-3 bg-white shadow'>
        <Form onSubmit={handleLogin}>
          <h5 className='mb-3 text-center'>Hi, Welcome Back!</h5>
          <Form.Group className="mb-3">
            <Form.Label>User Email</Form.Label>
            <Form.Control type="email" required onChange={(e) => setEmail(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" required onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" variant='outline-primary' className='mt-3 w-100'>Login</Button>
          </Form.Group>
          <p className='text-center'>New User ? <Link to="/signup">Signup</Link></p>
        </Form>
      </div>
    </div>
  );
}
export default Login;