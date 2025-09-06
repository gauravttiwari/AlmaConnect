import React, { useEffect, useState } from 'react';
import { Card, Grid, Typography, Box } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const AdminDashboard = () => {
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(true);

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

	const eventChartData = {
		labels: stats.eventTrends.map(e => e.title),
		datasets: [
			{
				label: 'Event Participation',
				data: stats.eventTrends.map(e => e.participants),
				backgroundColor: '#1976d2',
			},
		],
	};

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>Admin Dashboard</Typography>
			<Grid container spacing={3}>
				<Grid item xs={12} sm={6} md={3}>
					<Card sx={{ p: 2 }}>
						<Typography variant="h6">Total Students</Typography>
						<Typography variant="h4">{stats.totalStudents}</Typography>
					</Card>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<Card sx={{ p: 2 }}>
						<Typography variant="h6">Total Alumni</Typography>
						<Typography variant="h4">{stats.totalAlumni}</Typography>
					</Card>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<Card sx={{ p: 2 }}>
						<Typography variant="h6">Active Users</Typography>
						<Typography variant="h4">{stats.activeUsers}</Typography>
					</Card>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<Card sx={{ p: 2 }}>
						<Typography variant="h6">Pending Alumni Approvals</Typography>
						<Typography variant="h4">{stats.pendingAlumni}</Typography>
					</Card>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<Card sx={{ p: 2 }}>
						<Typography variant="h6">Pending Event Approvals</Typography>
						<Typography variant="h4">{stats.pendingEvents}</Typography>
					</Card>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<Card sx={{ p: 2 }}>
						<Typography variant="h6">Active Mentorships</Typography>
						<Typography variant="h4">{stats.activeMentorships}</Typography>
					</Card>
				</Grid>
				<Grid item xs={12} sm={6} md={3}>
					<Card sx={{ p: 2 }}>
						<Typography variant="h6">Job Referrals Shared</Typography>
						<Typography variant="h4">{stats.jobReferrals}</Typography>
					</Card>
				</Grid>
			</Grid>
			<Box sx={{ mt: 5 }}>
				<Typography variant="h6" sx={{ mb: 2 }}>Event Participation Trends</Typography>
				<Bar data={eventChartData} />
			</Box>
		</Box>
	);
};

export default AdminDashboard;
