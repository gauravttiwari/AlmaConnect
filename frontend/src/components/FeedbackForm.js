import React, { useState } from 'react';
import { submitFeedback } from '../utils/feedbackApi';

const FeedbackForm = ({ mentorId, studentId }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitFeedback(mentorId, studentId, rating, comment);
      setSuccess(true);
      setComment('');
      setRating(5);
    } catch (err) {
      setError('Failed to submit feedback');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 400, margin: '0 auto' }}>
      <h3>Rate Your Mentor</h3>
      <label>Rating:
        <select value={rating} onChange={e => setRating(Number(e.target.value))}>
          {[1,2,3,4,5].map(val => <option key={val} value={val}>{val}</option>)}
        </select>
      </label>
      <label>Comment:
        <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} />
      </label>
      <button type="submit" className="btn-primary">Submit Feedback</button>
      {success && <div style={{ color: 'green' }}>Thank you for your feedback!</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
};

export default FeedbackForm;
