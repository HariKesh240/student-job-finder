// src/App.js
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Studentdashboard from './studentpages/Studentdashboard';
import Joblist from './studentpages/JobList';
import Jobreview from './studentpages/JobReview';
import Admindashboard from './adminpages/Admindashboard';
import AddJob from './adminpages/AddJob';
import Login from './landingpages/Login';
import Signup from './landingpages/Signup';
import Studentdetails from './studentpages/Studentdetails';

function App() {
  return (
    // BrowserRouter MUST be the outermost wrapper for useNavigate to work
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <Routes>
            <Route path='/' element={<Login />}/>
            <Route path='/signup' element={<Signup />}/>
            
            {/* Protected Routes */}
            <Route path='/studentdetails' element={<ProtectedRoute allowedRole="student"><Studentdetails /></ProtectedRoute>}/>
            <Route path='/studentdashboard' element={<ProtectedRoute allowedRole="student"><Studentdashboard /></ProtectedRoute>}/>
            <Route path='/joblist' element={<ProtectedRoute allowedRole="student"><Joblist /></ProtectedRoute>}/>
            <Route path='/jobreview' element={<ProtectedRoute allowedRole="student"><Jobreview /></ProtectedRoute>}/>
            
            <Route path='/admindashboard' element={<ProtectedRoute allowedRole="recruiter"><Admindashboard /></ProtectedRoute>}/>
            <Route path='/addjob' element={<ProtectedRoute allowedRole="recruiter"><AddJob /></ProtectedRoute>}/>
          </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;