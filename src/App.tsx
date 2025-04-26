import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/Dashboard';
import StudentDashboard from './pages/dashboard/StudentDashboard';
import StudentCourses from './pages/dashboard/StudentCourses';
import TeacherDashboard from './pages/dashboard/TeacherDashboard';
import ParentDashboard from './pages/dashboard/ParentDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        
        {/* Authentication Routes */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        
        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/student" element={<StudentDashboard />} />
        <Route path="/dashboard/student/courses" element={<StudentCourses />} />
        <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
        <Route path="/dashboard/parent" element={<ParentDashboard />} />
        
        {/* Add more routes here */}
        
        {/* Catch-all route (404) */}
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
