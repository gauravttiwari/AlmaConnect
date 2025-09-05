import React, { useState } from 'react';
import { submitComplaint } from '../utils/feedbackApi';

const ComplaintForm = () => {
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitComplaint(message);
      setSuccess(true);
      setMessage('');
    } catch (err) {
      setError('Failed to submit complaint');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 400, margin: '0 auto' }}>
      <h3>Anonymous Complaint</h3>
      <label>Message:
        <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3} />
      </label>
      <button type="submit" className="btn-primary">Submit Complaint</button>
      {success && <div style={{ color: 'green' }}>Your complaint has been submitted anonymously.</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
};

export default ComplaintForm;
