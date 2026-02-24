import axios from 'axios';

const API = axios.create({
  baseURL: 'https://student-job-finder-backend.onrender.com',
});

// Add a request interceptor to include JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
