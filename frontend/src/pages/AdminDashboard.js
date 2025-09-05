
import React, { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {
	getAlumniList,
	approveAlumni,
	blockAlumni,
	unblockAlumni,
	getEventList,
	approveEvent,
	rejectEvent,
	getAdminStats
} from '../utils/adminApi';

const AdminDashboard = () => {
		const [alumni, setAlumni] = useState([]);
		const [events, setEvents] = useState([]);
		const [stats, setStats] = useState({});
		const [loading, setLoading] = useState(true);
		const [search, setSearch] = useState('');
		const [page, setPage] = useState(1);
		const [rowsPerPage] = useState(5);
		const [snackbar, setSnackbar] = useState({ open: false, message: '' });

	useEffect(() => {
		async function fetchData() {
			setLoading(true);
			try {
				const [alumniRes, eventRes, statsRes] = await Promise.all([
					getAlumniList(),
					getEventList(),
					getAdminStats()
				]);
				setAlumni(alumniRes.data);
				setEvents(eventRes.data);
				setStats(statsRes.data);
			} catch (err) {
				// handle error
			}
			setLoading(false);
		}
		fetchData();
	}, []);

		const handleApproveAlumni = async (id) => {
			await approveAlumni(id);
			setAlumni(alumni.map(a => a._id === id ? { ...a, status: 'Active' } : a));
			setSnackbar({ open: true, message: 'Alumni approved!' });
		};
		const handleBlockAlumni = async (id) => {
			await blockAlumni(id);
			setAlumni(alumni.map(a => a._id === id ? { ...a, status: 'Blocked' } : a));
			setSnackbar({ open: true, message: 'Alumni blocked!' });
		};
		const handleUnblockAlumni = async (id) => {
			await unblockAlumni(id);
			setAlumni(alumni.map(a => a._id === id ? { ...a, status: 'Active' } : a));
			setSnackbar({ open: true, message: 'Alumni unblocked!' });
		};
	const handleApproveEvent = async (id) => {
		await approveEvent(id);
		setEvents(events.map(e => e._id === id ? { ...e, status: 'Approved' } : e));
	};
	const handleRejectEvent = async (id) => {
		await rejectEvent(id);
		setEvents(events.map(e => e._id === id ? { ...e, status: 'Rejected' } : e));
	};


		if (loading) return <div>Loading...</div>;

		// Filter alumni by search
		const filteredAlumni = alumni.filter(a =>
			a.name.toLowerCase().includes(search.toLowerCase()) ||
			a.role.toLowerCase().includes(search.toLowerCase())
		);
		// Pagination
		const paginatedAlumni = filteredAlumni.slice((page - 1) * rowsPerPage, page * rowsPerPage);
		const totalPages = Math.ceil(filteredAlumni.length / rowsPerPage);

		return (
			<div className="main-container">
				<h2>Admin Dashboard</h2>
				<div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
					<div className="card" style={{ flex: 1 }}>
						<h3>Mentorship Success Rate</h3>
						<p style={{ fontSize: '2rem', color: '#43a047' }}>{stats.mentorshipSuccessRate || '-'}</p>
					</div>
					<div className="card" style={{ flex: 1 }}>
						<h3>Referrals Made</h3>
						<p style={{ fontSize: '2rem', color: '#1976d2' }}>{stats.referralsMade || '-'}</p>
					</div>
					<div className="card" style={{ flex: 1 }}>
						<h3>Active Events</h3>
						<p style={{ fontSize: '2rem', color: '#ff9800' }}>{stats.activeEvents || '-'}</p>
					</div>
				</div>
				<div className="card" style={{ marginBottom: 32 }}>
					<h3>User Management</h3>
					<input
						type="text"
						placeholder="Search alumni by name or role..."
						value={search}
						onChange={e => setSearch(e.target.value)}
						style={{ marginBottom: 12, padding: 8, width: '100%' }}
					/>
					<table style={{ width: '100%', borderCollapse: 'collapse' }}>
						<thead>
							<tr style={{ background: '#f5f7fa' }}>
								<th style={{ padding: 8, borderBottom: '1px solid #b0bec5' }}>Name</th>
								<th style={{ padding: 8, borderBottom: '1px solid #b0bec5' }}>Role</th>
								<th style={{ padding: 8, borderBottom: '1px solid #b0bec5' }}>Status</th>
								<th style={{ padding: 8, borderBottom: '1px solid #b0bec5' }}>Action</th>
							</tr>
						</thead>
						<tbody>
							{paginatedAlumni.map(a => (
								<tr key={a._id}>
									<td style={{ padding: 8 }}>{a.name}</td>
									<td style={{ padding: 8 }}>{a.role}</td>
									<td style={{ padding: 8 }}>{a.status}</td>
									<td style={{ padding: 8 }}>
										{a.status === 'Pending' && <button className="btn-primary" onClick={() => handleApproveAlumni(a._id)}>Approve</button>}
										{a.status === 'Active' && <button className="btn-primary" style={{ background: '#e53935' }} onClick={() => handleBlockAlumni(a._id)}>Block</button>}
										{a.status === 'Blocked' && <button className="btn-primary" style={{ background: '#43a047' }} onClick={() => handleUnblockAlumni(a._id)}>Unblock</button>}
									</td>
								</tr>
							))}
						</tbody>
					</table>
					<div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 8 }}>
						<button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
						<span>Page {page} of {totalPages}</span>
						<button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
					</div>
				</div>
				<div className="card">
					<h3>Event Moderation</h3>
					<table style={{ width: '100%', borderCollapse: 'collapse' }}>
						<thead>
							<tr style={{ background: '#f5f7fa' }}>
								<th style={{ padding: 8, borderBottom: '1px solid #b0bec5' }}>Title</th>
								<th style={{ padding: 8, borderBottom: '1px solid #b0bec5' }}>Status</th>
								<th style={{ padding: 8, borderBottom: '1px solid #b0bec5' }}>Action</th>
							</tr>
						</thead>
						<tbody>
							{events.map(e => (
								<tr key={e._id}>
									<td style={{ padding: 8 }}>{e.title}</td>
									<td style={{ padding: 8 }}>{e.status}</td>
									<td style={{ padding: 8 }}>
										{e.status === 'Pending' && <>
											<button className="btn-primary" onClick={() => handleApproveEvent(e._id)}>Approve</button>
											<button className="btn-primary" style={{ background: '#e53935', marginLeft: 8 }} onClick={() => handleRejectEvent(e._id)}>Reject</button>
										</>}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<Snackbar
					anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
					open={snackbar.open}
					autoHideDuration={3000}
					onClose={() => setSnackbar({ ...snackbar, open: false })}
					message={snackbar.message}
					action={
						<IconButton size="small" color="inherit" onClick={() => setSnackbar({ ...snackbar, open: false })}>
							<CloseIcon fontSize="small" />
						</IconButton>
					}
				/>
			</div>
		);
	};
	export default AdminDashboard;
