import React, { useEffect, useState } from 'react';
import { getTopMentors } from '../utils/feedbackApi';

const TopMentors = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMentors() {
      setLoading(true);
      try {
        const res = await getTopMentors();
        setMentors(res.data);
      } catch {
        setMentors([]);
      }
      setLoading(false);
    }
    fetchMentors();
  }, []);

  if (loading) return <div>Loading top mentors...</div>;

  return (
    <div className="card" style={{ maxWidth: 600, margin: '24px auto' }}>
      <h3>Top Mentors</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f5f7fa' }}>
            <th style={{ padding: 8 }}>Name</th>
            <th style={{ padding: 8 }}>Avg Rating</th>
          </tr>
        </thead>
        <tbody>
          {mentors.map(m => (
            <tr key={m._id}>
              <td style={{ padding: 8 }}>{m.name}</td>
              <td style={{ padding: 8 }}>{m.avgRating ? m.avgRating.toFixed(2) : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopMentors;
