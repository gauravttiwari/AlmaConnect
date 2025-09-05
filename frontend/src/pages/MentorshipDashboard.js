import React from 'react';
const MentorshipDashboard = () => (
	<div className="main-container">
		<h2>Mentorship Dashboard</h2>
		<div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
			{[1,2].map(i => (
				<div className="card" key={i} style={{ flex: '1 1 320px', minWidth: 320 }}>
					<h3>Mentee Name {i}</h3>
					<p>Goal: Get placed in a tech company</p>
					<div style={{ margin: '12px 0' }}>
						<label>Progress</label>
						<progress value={i*40} max="100" style={{ width: '100%' }}></progress>
					</div>
					<button className="btn-primary">View Progress</button>
				</div>
			))}
		</div>
	</div>
);
export default MentorshipDashboard;
