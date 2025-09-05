import React, { useState, useEffect } from 'react';

const Events = () => {
	const [events, setEvents] = useState([]);
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [createForm, setCreateForm] = useState({ title: '', description: '', date: '' });
	const [registerMsg, setRegisterMsg] = useState('');
	const [replayFile, setReplayFile] = useState(null);
	const [replayMsg, setReplayMsg] = useState('');

	useEffect(() => {
		fetch('/api/events/upcoming')
			.then(res => res.json())
			.then(data => setEvents(data));
	}, []);

	const handleCreateChange = e => {
		setCreateForm({ ...createForm, [e.target.name]: e.target.value });
	};

	const handleCreateEvent = async e => {
		e.preventDefault();
		const res = await fetch('/api/events/create', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(createForm),
		});
		const data = await res.json();
		setEvents(events => [...events, data]);
		setShowCreateForm(false);
		setCreateForm({ title: '', description: '', date: '' });
	};

	const handleRegister = async (eventId) => {
		const res = await fetch(`/api/events/${eventId}/register`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ studentId: 'replace_with_student_id' }),
		});
		const data = await res.json();
		setRegisterMsg(data.message || 'Registered!');
	};

	const handleReplayChange = e => {
		setReplayFile(e.target.files[0]);
	};

	const handleReplayUpload = async () => {
		if (!replayFile) return setReplayMsg('Please select a file.');
		const formData = new FormData();
		formData.append('file', replayFile);
		const res = await fetch('/api/events/recording', {
			method: 'POST',
			body: formData,
		});
		const data = await res.json();
		setReplayMsg(data.url ? 'Replay uploaded!' : 'Upload failed.');
	};

	return (
		<div className="main-container">
			<h2>Events & Webinars</h2>
			<button className="btn-primary" style={{ marginBottom: 18 }} onClick={() => setShowCreateForm(!showCreateForm)}>
				{showCreateForm ? 'Cancel' : 'Create Event'}
			</button>
			{showCreateForm && (
				<form onSubmit={handleCreateEvent} style={{ marginBottom: 24 }}>
					<label>Title</label>
					<input name="title" value={createForm.title} onChange={handleCreateChange} required />
					<label>Description</label>
					<textarea name="description" value={createForm.description} onChange={handleCreateChange} required />
					<label>Date</label>
					<input name="date" type="date" value={createForm.date} onChange={handleCreateChange} required />
					<button className="btn-primary" type="submit">Create Event</button>
				</form>
			)}
			<div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
						{events.map(event => (
							<div className="card" key={event._id || event.title} style={{ flex: '1 1 340px', minWidth: 340 }}>
								<h3>{event.title}</h3>
								<p>Date: {event.date && event.date.slice(0,10)}</p>
								<p>{event.description}</p>
								<button className="btn-primary" onClick={() => handleRegister(event._id)} style={{ marginRight: 8 }}>Register</button>
								<button
									className="btn-primary"
									style={{ background: '#1976d2', marginLeft: 8 }}
									onClick={() => window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.date?.replace(/-/g, '')}/${event.date?.replace(/-/g, '')}&details=${encodeURIComponent(event.description)}`, '_blank')}
								>
									Add to Google Calendar
								</button>
								<input type="file" accept="video/*" onChange={handleReplayChange} style={{ marginTop: 8 }} />
								<button className="btn-primary" style={{ background: '#43a047', marginLeft: 8 }} onClick={handleReplayUpload}>Upload Replay</button>
								{event.recordingUrl && (
									<a href={event.recordingUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', marginTop: 8, color: '#1976d2' }}>
										Watch Replay
									</a>
								)}
								{registerMsg && <div style={{ marginTop: 8, color: '#43a047' }}>{registerMsg}</div>}
								{replayMsg && <div style={{ marginTop: 8, color: replayMsg.includes('uploaded') ? '#43a047' : '#e53935' }}>{replayMsg}</div>}
							</div>
						))}
			</div>
		</div>
	);
};
		// ...existing code...
export default Events;
