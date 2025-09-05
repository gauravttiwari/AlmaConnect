import React from 'react';
const AlumniDirectory = () => (
	<div className="main-container">
		<h2>Alumni Directory</h2>
		<div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
			<input placeholder="Search by name, company, or skill..." />
			<select>
				<option>All Years</option>
				<option>2025</option>
				<option>2024</option>
				<option>2023</option>
			</select>
			<select>
				<option>All Locations</option>
				<option>Delhi</option>
				<option>Mumbai</option>
				<option>Bangalore</option>
			</select>
			<button className="btn-primary">Search</button>
		</div>
		<div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
			{[1,2,3].map(i => (
				<div className="card" key={i} style={{ flex: '1 1 300px', minWidth: 300 }}>
					<h3>Alumni Name {i}</h3>
					<p>Company: Example Corp</p>
					<p>Skills: React, Node.js</p>
					<button className="btn-primary">View Profile</button>
				</div>
			))}
		</div>
	</div>
);
export default AlumniDirectory;
