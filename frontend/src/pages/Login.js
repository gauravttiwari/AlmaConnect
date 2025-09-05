
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [userType, setUserType] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [popup, setPopup] = useState({ show: false, message: '', type: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add real authentication logic here
    // Simulate login success/failure
    if (email && password) {
      login();
      setPopup({ show: true, message: 'Login successfully', type: 'success' });
      setTimeout(() => setPopup({ show: false, message: '', type: '' }), 2000);
      if (userType === 'admin') {
        navigate('/admin');
      } else if (userType === 'student') {
        navigate('/student-home');
      } else if (userType === 'alumni') {
        navigate('/alumni-home');
      } else {
        navigate('/profile');
      }
    } else {
      setPopup({ show: true, message: 'Login failed', type: 'error' });
      setTimeout(() => setPopup({ show: false, message: '', type: '' }), 2000);
    }
  };

  return (
    <div className="main-container" style={{ maxWidth: 400, margin: '48px auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Login</h2>
      {popup.show && (
        <div style={{
          background: popup.type === 'success' ? '#4caf50' : '#f44336',
          color: '#fff',
          padding: '10px',
          borderRadius: '6px',
          textAlign: 'center',
          marginBottom: 12,
          fontWeight: 500
        }}>
          {popup.message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <label>User Type</label>
        <select value={userType} onChange={e => setUserType(e.target.value)}>
          <option value="student">Student</option>
          <option value="alumni">Alumni</option>
          <option value="admin">Admin</option>
        </select>
        <label>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="btn-primary" type="submit" style={{ width: '100%', marginTop: 12 }}>Login</button>
      </form>
      <div style={{ textAlign: 'center', marginTop: 18 }}>
        Don't have an account?{' '}
        <span style={{ color: '#1976d2', cursor: 'pointer' }} onClick={() => navigate('/signup')}>
          Sign Up
        </span>
      </div>
    </div>
  );
};
export default Login;
