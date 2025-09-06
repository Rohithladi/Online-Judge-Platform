import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './pages/HomePage';
import Register from './pages/Register';
import Login from './pages/Login';
import VerifyOtp from './pages/verifyotp';
import AdminDashboard from './pages/admin';
import Problempost from './pages/Problempost';
import AllProblem from './pages/AllProblem';
import UserDashboard from './pages/Userdashboard';
import ProblemView from './pages/ProblemView';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/problempost" element={<Problempost />} />

        {/* ✅ Correct dynamic route for editing problems */}
        <Route path="/all" element={<AllProblem />} />

        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/problem/:id" element={<ProblemView />} />      
      </Routes>
    </Router>
  );
}
