import React, { useState } from 'react';

const Profile = () => {
	const [file, setFile] = useState(null);
	const [uploading, setUploading] = useState(false);
	const [uploadMsg, setUploadMsg] = useState('');
	const userId = 'replace_with_user_id'; // Replace with actual user ID from auth context
	const userType = 'student'; // or 'alumni', replace with actual user type

	const handleFileChange = (e) => {
		setFile(e.target.files[0]);
	};

	const handleUpload = async (e) => {
		e.preventDefault();
		if (!file) return;
		setUploading(true);
		setUploadMsg('');
		const formData = new FormData();
		formData.append('file', file);
		try {
			const res = await fetch(`/api/${userType === 'student' ? 'students' : 'alumni'}/${userId}/upload`, {
				method: 'POST',
				body: formData,
			});
			const data = await res.json();
			if (data.url) {
				setUploadMsg('Upload successful!');
			} else {
				setUploadMsg('Upload failed.');
			}
		} catch {
			setUploadMsg('Upload error.');
		}
		setUploading(false);
	};

	return (
		<div className="main-container">
			<h2>My Profile</h2>
			<div className="card" style={{ maxWidth: 500, margin: '0 auto' }}>
				<form>
					<label>Name</label>
					<input type="text" value="John Doe" readOnly />
					<label>Email</label>
					<input type="email" value="john@example.com" readOnly />
					<label>Graduation Year</label>
					<input type="number" value="2025" readOnly />
					<label>Skills</label>
					<input type="text" value="React, Node.js" readOnly />
					<button className="btn-primary" type="button">Edit Profile</button>
				</form>
				<hr style={{ margin: '24px 0' }} />
						<form onSubmit={handleUpload}>
							<label>Upload Profile Picture / Resume</label>
							<input type="file" onChange={handleFileChange} accept="image/*,.pdf,.doc,.docx" />
							<button className="btn-primary" type="submit" disabled={uploading} style={{ marginTop: 12 }}>
								{uploading ? 'Uploading...' : 'Upload'}
							</button>
							<div style={{ fontSize: '0.95rem', color: '#1976d2', marginTop: 8 }}>
								Files are securely uploaded to Cloudinary. Supported: images, PDF, DOC, DOCX.<br />
								(Admin can switch to AWS S3 by updating backend config.)
							</div>
							{uploadMsg && <div style={{ marginTop: 12, color: uploadMsg.includes('successful') ? '#43a047' : '#e53935' }}>{uploadMsg}</div>}
						</form>
			</div>
		</div>
	);
};
export default Profile;
