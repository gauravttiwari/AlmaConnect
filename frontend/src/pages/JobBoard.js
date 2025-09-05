import React, { useState, useEffect } from 'react';

const JobBoard = () => {
	const [jobs, setJobs] = useState([]);
	const [showPostForm, setShowPostForm] = useState(false);
	const [postForm, setPostForm] = useState({ title: '', company: '', description: '' });
	const [applyForm, setApplyForm] = useState({ resume: null, jobId: null });
	const [applyMsg, setApplyMsg] = useState('');

	useEffect(() => {
		fetch('/api/jobs')
			.then(res => res.json())
			.then(data => setJobs(data));
	}, []);

	const handlePostChange = e => {
		setPostForm({ ...postForm, [e.target.name]: e.target.value });
	};

	const handlePostJob = async e => {
		e.preventDefault();
		const res = await fetch('/api/jobs', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(postForm),
		});
		const data = await res.json();
		setJobs(jobs => [...jobs, data]);
		setShowPostForm(false);
		setPostForm({ title: '', company: '', description: '' });
	};

	const handleResumeChange = e => {
		setApplyForm({ ...applyForm, resume: e.target.files[0] });
	};

	const handleApply = async (jobId) => {
		if (!applyForm.resume) return setApplyMsg('Please select a resume file.');
		const formData = new FormData();
		formData.append('file', applyForm.resume);
		// Upload resume to backend
		const uploadRes = await fetch('/api/jobs/resume', {
			method: 'POST',
			body: formData,
		});
		const uploadData = await uploadRes.json();
		// Apply to job with resume URL
		const res = await fetch(`/api/jobs/${jobId}/apply`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ studentId: 'replace_with_student_id', resume: uploadData.url }),
		});
		const data = await res.json();
		setApplyMsg(data.message || 'Applied!');
	};

	return (
		<div className="main-container">
			<h2>Job Board</h2>
			<button className="btn-primary" style={{ marginBottom: 18 }} onClick={() => setShowPostForm(!showPostForm)}>
				{showPostForm ? 'Cancel' : 'Post a Job'}
			</button>
			{showPostForm && (
				<form onSubmit={handlePostJob} style={{ marginBottom: 24 }}>
					<label>Title</label>
					<input name="title" value={postForm.title} onChange={handlePostChange} required />
					<label>Company</label>
					<input name="company" value={postForm.company} onChange={handlePostChange} required />
					<label>Description</label>
					<textarea name="description" value={postForm.description} onChange={handlePostChange} required />
					<button className="btn-primary" type="submit">Post Job</button>
				</form>
			)}
			<div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
				{jobs.map(job => (
					<div className="card" key={job._id || job.title} style={{ flex: '1 1 320px', minWidth: 320 }}>
						<h3>{job.title}</h3>
						<p>Company: {job.company}</p>
						<p>{job.description}</p>
						<form style={{ marginTop: 12 }} onSubmit={e => { e.preventDefault(); handleApply(job._id); }}>
							<label>Upload Resume</label>
							<input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeChange} />
							<button className="btn-primary" type="submit" style={{ marginTop: 8 }}>Apply</button>
						</form>
						{applyMsg && <div style={{ marginTop: 8, color: '#43a047' }}>{applyMsg}</div>}
					</div>
				))}
			</div>
		</div>
	);
};
export default JobBoard;
