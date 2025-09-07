import EventManagement from './pages/EventManagement';
import React from 'react';

import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import AlumniDirectory from './pages/AlumniDirectory';
import MentorshipDashboard from './pages/MentorshipDashboard';
import Chat from './pages/Chat';
import JobBoard from './pages/JobBoard';
import JobReferralManagement from './pages/JobReferralManagement';
import Events from './pages/Events';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import AdminMentorship from './pages/AdminMentorship';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import FeedbackForm from './components/FeedbackForm';
import ComplaintForm from './components/ComplaintForm';
import TopMentors from './components/TopMentors';


function App() {
  const { isAuthenticated, userType } = useAuth();
  // Optionally, you can use userType for role-based feature access
  return (
    <>
  <Navbar />
  <Sidebar />
      <div style={{ minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* Role-based protected routes */}
          <Route path="/profile" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Profile /></ProtectedRoute>} />
          <Route path="/alumni" element={<ProtectedRoute isAuthenticated={isAuthenticated && userType === 'alumni'}><AlumniDirectory /></ProtectedRoute>} />
          <Route path="/mentorship" element={<ProtectedRoute isAuthenticated={isAuthenticated}><MentorshipDashboard /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Chat /></ProtectedRoute>} />
          <Route path="/jobs" element={<ProtectedRoute isAuthenticated={isAuthenticated}><JobBoard /></ProtectedRoute>} />
          <Route path="/events" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Events /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute isAuthenticated={isAuthenticated && userType === 'admin'}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/user-management" element={<ProtectedRoute isAuthenticated={isAuthenticated && userType === 'admin'}><UserManagement /></ProtectedRoute>} />
          <Route path="/admin/job-referrals" element={<ProtectedRoute isAuthenticated={isAuthenticated && userType === 'admin'}><JobReferralManagement /></ProtectedRoute>} />
          <Route path="/admin/events" element={<ProtectedRoute isAuthenticated={isAuthenticated && userType === 'admin'}><EventManagement /></ProtectedRoute>} />
            <Route path="/admin-mentorship" element={<ProtectedRoute isAuthenticated={isAuthenticated && userType === 'admin'}><AdminMentorship /></ProtectedRoute>} />
            <Route path="/admin/mentorships" element={<ProtectedRoute isAuthenticated={isAuthenticated && userType === 'admin'}><AdminMentorship /></ProtectedRoute>} />
          <Route path="/feedback" element={<ProtectedRoute isAuthenticated={isAuthenticated}><FeedbackForm /></ProtectedRoute>} />
          <Route path="/complaint" element={<ProtectedRoute isAuthenticated={isAuthenticated}><ComplaintForm /></ProtectedRoute>} />
          <Route path="/top-mentors" element={<TopMentors />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}
export default App;
