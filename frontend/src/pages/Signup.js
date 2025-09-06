import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [branch, setBranch] = useState('');
  const [company, setCompany] = useState('');
  const [popup, setPopup] = useState({ show: false, message: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name,
      email,
      password,
      role: userType,
      graduationYear,
      branch,
      company: userType === 'alumni' ? company : undefined
    };
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setPopup({ show: true, message: 'Account created successfully', type: 'success' });
        setTimeout(() => {
          setPopup({ show: false, message: '', type: '' });
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userType', userType);
          if (userType === 'admin') navigate('/admin');
          else if (userType === 'student') navigate('/student-home');
          else if (userType === 'alumni') navigate('/alumni-home');
          else navigate('/login');
        }, 2000);
      } else {
        setPopup({ show: true, message: data.message || 'Account creation failed', type: 'error' });
        setTimeout(() => setPopup({ show: false, message: '', type: '' }), 2000);
      }
    } catch (err) {
      setPopup({ show: true, message: 'Server error', type: 'error' });
      setTimeout(() => setPopup({ show: false, message: '', type: '' }), 2000);
    }
  };

  return (
    <div className="main-container" style={{ maxWidth: 440, margin: '48px auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Sign Up</h2>
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
        <label>Name</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} required />
        <label>Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        {userType === 'student' && (
          <>
            <label>Graduation Year</label>
            <input type="number" value={graduationYear} onChange={e => setGraduationYear(e.target.value)} />
            <label>Branch</label>
            <input type="text" value={branch} onChange={e => setBranch(e.target.value)} />
          </>
        )}
        {userType === 'alumni' && (
          <>
            <label>Company</label>
            <input type="text" value={company} onChange={e => setCompany(e.target.value)} />
            <label>Graduation Year</label>
            <input type="number" value={graduationYear} onChange={e => setGraduationYear(e.target.value)} />
            <label>Branch</label>
            <input type="text" value={branch} onChange={e => setBranch(e.target.value)} />
          </>
        )}
        <button className="btn-primary" type="submit" style={{ width: '100%', marginTop: 12 }}>Sign Up</button>
      </form>
      <div style={{ textAlign: 'center', marginTop: 18 }}>
        Already have an account?{' '}
        <span style={{ color: '#1976d2', cursor: 'pointer' }} onClick={() => navigate('/login')}>
          Login
        </span>
      </div>
    </div>
  );
};

export default Signup;
