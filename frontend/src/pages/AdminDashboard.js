import React, { useEffect, useState } from 'react';
import { Card, Grid, Typography, Box, Button, Drawer, List, ListItem, ListItemText, AppBar, Toolbar, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { Bar, Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const quickLinks = [
	{ label: 'Dashboard', path: '/admin-dashboard' },
	{ label: 'User Management', path: '/user-management' },
	{ label: 'Manage Events', path: '/admin/events' },
	{ label: 'Job Referrals', path: '/admin/job-referrals' },
	{ label: 'Feedback', path: '/admin/feedback' },
	{ label: 'Mentorships', path: '/admin/mentorships' },
];

const AdminDashboard = () => {
		const [stats, setStats] = useState(null);
		const [loading, setLoading] = useState(true);
		const [sidebarOpen, setSidebarOpen] = useState(false);

		// Listen for sidebar open event from Navbar
		React.useEffect(() => {
			const openSidebar = () => setSidebarOpen(true);
			window.addEventListener('openSidebar', openSidebar);
			return () => window.removeEventListener('openSidebar', openSidebar);
		}, []);
		const navigate = useNavigate();

		useEffect(() => {
			fetch('http://localhost:5000/api/admin/dashboard-stats')
				.then(res => res.json())
				.then(data => {
					setStats(data);
					setLoading(false);
				})
				.catch(() => setLoading(false));
		}, []);

		if (loading) return <Typography>Loading...</Typography>;
		if (!stats) return <Typography>Error loading dashboard data.</Typography>;

		// Pie chart for mentorship status
		const mentorshipPieData = {
			labels: (stats.mentorshipStatus || []).map(s => s._id),
			datasets: [{
				data: (stats.mentorshipStatus || []).map(s => s.count),
				backgroundColor: ['#1976d2', '#4caf50', '#f44336'],
			}],
		};

		// Bar chart for monthly mentorships
		const mentorshipBarData = {
			labels: (stats.mentorshipsMonthly || []).map(m => m._id),
			datasets: [{
				label: 'Mentorships Created',
				data: (stats.mentorshipsMonthly || []).map(m => m.count),
				backgroundColor: '#1976d2',
			}],
		};

		// Line chart for job referrals
		const jobReferralsLineData = {
			labels: (stats.jobReferralsMonthly || []).map(j => j._id),
			datasets: [{
				label: 'Job Referrals',
				data: (stats.jobReferralsMonthly || []).map(j => j.count),
				borderColor: '#1976d2',
				backgroundColor: 'rgba(25, 118, 210, 0.1)',
				fill: true,
			}],
		};

		// Bar chart for event participation
		const eventBarData = {
			labels: (stats.eventTrends || []).map(e => e.title),
			datasets: [{
				label: 'Participants',
				data: (stats.eventTrends || []).map(e => e.participants),
				backgroundColor: '#4caf50',
			}],
		};

		return (
			<Box sx={{ background: '#f3f6fb', minHeight: '100vh', position: 'relative' }}>
				{/* Only show back button, remove AppBar to avoid double nav */}
				<Card sx={{ display: 'flex', alignItems: 'center', mb: 3, px: 3, py: 2, boxShadow: 4, borderRadius: 3, background: 'linear-gradient(90deg, #1976d2 80%, #90caf9 100%)', transition: '0.2s', '&:hover': { boxShadow: 8, background: 'linear-gradient(90deg, #1565c0 80%, #64b5f6 100%)' } }}>
					<Typography variant="h5" sx={{ fontWeight: 700, color: '#fff', letterSpacing: 1, flexGrow: 1 }}>Admin Dashboard</Typography>
				</Card>
				<Drawer anchor="left" open={sidebarOpen} onClose={() => setSidebarOpen(false)}>
					<Box sx={{ width: 240 }} role="presentation" onClick={() => setSidebarOpen(false)}>
						<List>
							{quickLinks.map(link => (
								<ListItem button key={link.label} onClick={() => {
									setSidebarOpen(false);
									navigate(link.path);
								}}>
									<ListItemText primary={link.label} />
								</ListItem>
							))}
						</List>
					</Box>
				</Drawer>
				<Box sx={{ p: 3 }}>
					{/* Action Buttons */}
					<Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
						<Button variant="contained" color="primary" onClick={() => navigate('/admin/events')}>Add Event</Button>
						<Button variant="contained" color="secondary" onClick={() => navigate('/admin/job-referrals')}>Post Job</Button>
						<Button variant="contained" color="success" onClick={() => navigate('/admin/mentorships')}>Start Mentorship</Button>
					</Box>
					{/* Interactive Stat Cards */}
					<Grid container spacing={3}>
						<Grid item xs={12} sm={6} md={2}>
							<Card sx={{ p: 2, boxShadow: 3, borderRadius: 2, transition: '0.2s', cursor: 'pointer', '&:hover': { boxShadow: 8, background: '#e3f2fd' } }} onClick={() => navigate('/user-management')}>
								<Typography variant="h6">Students</Typography>
								<Typography variant="h4">{stats.totalStudents}</Typography>
							</Card>
						</Grid>
						<Grid item xs={12} sm={6} md={2}>
							<Card sx={{ p: 2, boxShadow: 3, borderRadius: 2, transition: '0.2s', cursor: 'pointer', '&:hover': { boxShadow: 8, background: '#e3f2fd' } }} onClick={() => navigate('/user-management')}>
								<Typography variant="h6">Alumni</Typography>
								<Typography variant="h4">{stats.totalAlumni}</Typography>
							</Card>
						</Grid>
						<Grid item xs={12} sm={6} md={2}>
							<Card sx={{ p: 2, boxShadow: 3, borderRadius: 2, transition: '0.2s', cursor: 'pointer', '&:hover': { boxShadow: 8, background: '#e3f2fd' } }} onClick={() => navigate('/admin/events')}>
								<Typography variant="h6">Events</Typography>
								<Typography variant="h4">{stats.totalEvents}</Typography>
							</Card>
						</Grid>
						<Grid item xs={12} sm={6} md={2}>
							<Card sx={{ p: 2, boxShadow: 3, borderRadius: 2, transition: '0.2s', cursor: 'pointer', '&:hover': { boxShadow: 8, background: '#e3f2fd' } }} onClick={() => navigate('/admin/mentorships')}>
								<Typography variant="h6">Mentorships</Typography>
								<Typography variant="h4">{stats.totalMentorships}</Typography>
							</Card>
						</Grid>
						<Grid item xs={12} sm={6} md={2}>
							<Card sx={{ p: 2, boxShadow: 3, borderRadius: 2, transition: '0.2s', cursor: 'pointer', '&:hover': { boxShadow: 8, background: '#e3f2fd' } }} onClick={() => navigate('/admin/job-referrals')}>
								<Typography variant="h6">Job Referrals</Typography>
								<Typography variant="h4">{stats.totalJobReferrals}</Typography>
							</Card>
						</Grid>
					</Grid>
					{/* Recent Activity Feed */}
					<Box sx={{ mt: 5, mb: 3 }}>
						<Typography variant="h6" sx={{ mb: 2 }}>Recent Activity</Typography>
						<Card sx={{ p: 2, boxShadow: 2, borderRadius: 2, mb: 2 }}>
							<Typography variant="body1">New event added: <strong>{stats.eventTrends?.[0]?.title || 'No recent events'}</strong></Typography>
							<Typography variant="body2" color="text.secondary">Participants: {stats.eventTrends?.[0]?.participants || 0}</Typography>
						</Card>
						<Card sx={{ p: 2, boxShadow: 2, borderRadius: 2, mb: 2 }}>
							<Typography variant="body1">Latest job referral: <strong>{stats.jobReferralsMonthly?.[0]?._id || 'No recent jobs'}</strong></Typography>
							<Typography variant="body2" color="text.secondary">Referrals: {stats.jobReferralsMonthly?.[0]?.count || 0}</Typography>
						</Card>
						<Card sx={{ p: 2, boxShadow: 2, borderRadius: 2, mb: 2 }}>
							<Typography variant="body1">Recent mentorship: <strong>{stats.mentorshipsMonthly?.[0]?._id || 'No recent mentorships'}</strong></Typography>
							<Typography variant="body2" color="text.secondary">Mentorships: {stats.mentorshipsMonthly?.[0]?.count || 0}</Typography>
						</Card>
					</Box>
					{/* Interactive Charts */}
					<Box sx={{ mt: 5 }}>
						<Typography variant="h6" sx={{ mb: 2 }}>Mentorship Status</Typography>
						<Pie data={mentorshipPieData} />
					</Box>
					<Box sx={{ mt: 5 }}>
						<Typography variant="h6" sx={{ mb: 2 }}>Monthly Mentorships</Typography>
						<Bar data={mentorshipBarData} />
					</Box>
					<Box sx={{ mt: 5 }}>
						<Typography variant="h6" sx={{ mb: 2 }}>Job Referrals Over Time</Typography>
						<Line data={jobReferralsLineData} />
					</Box>
					<Box sx={{ mt: 5 }}>
						<Typography variant="h6" sx={{ mb: 2 }}>Event Participation Trends</Typography>
						<Bar data={eventBarData} />
					</Box>
				</Box>
			</Box>
		);
};

export default AdminDashboard;
