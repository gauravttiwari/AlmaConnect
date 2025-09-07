import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Card, CardContent, Chip, LinearProgress, Avatar, Stack } from '@mui/material';
import { blue, green, orange, red } from '@mui/material/colors';

const AdminMentorship = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: '', requestId: null });
  const [summary, setSummary] = useState({ activePerAlumni: {}, avgDuration: 0 });

  useEffect(() => {
    fetchRequests();
    fetchSummary();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/admin/mentorship-requests');
      if (!res.ok) throw new Error('API error: ' + res.status);
      const data = await res.json();
      setRequests(data.requests || []);
    } catch (err) {
      setError('Failed to load requests. ' + (err.message || ''));
      setRequests([]);
    }
    setLoading(false);
  };

  const fetchSummary = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/mentorship-summary');
      if (!res.ok) throw new Error('API error: ' + res.status);
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      setSummary({ activePerAlumni: {}, avgDuration: 0 });
    }
  };

  const handleStatusChange = (id, status) => {
    setConfirmDialog({ open: true, action: status, requestId: id });
  };

  const confirmAction = async () => {
    await fetch(`http://localhost:5000/api/admin/mentorship-requests/${confirmDialog.requestId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: confirmDialog.action })
    });
    setConfirmDialog({ open: false, action: '', requestId: null });
    fetchRequests();
  };

  return (
    <Box sx={{ p: { xs: 1, md: 4 }, background: '#f3f6fb', minHeight: '100vh' }}>
      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 3, background: 'linear-gradient(90deg, #e3f2fd 60%, #fff 100%)' }}>
        <CardContent>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: blue[700] }}>Mentorship Requests</Typography>
              <Typography variant="subtitle1" sx={{ color: blue[400] }}>Manage mentorship activity between students and alumni</Typography>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: green[700] }}>Active: {Object.values(summary.activePerAlumni).reduce((a, b) => a + b, 0)}</Typography>
              <Typography variant="body2" sx={{ color: orange[700] }}>Avg Duration: {summary.avgDuration} days</Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
      {loading && <LinearProgress sx={{ mb: 2 }} />}
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      <TableContainer component={Paper} sx={{ mb: 4, borderRadius: 3, boxShadow: 2 }}>
        <Table sx={{ minWidth: 900 }}>
          <TableHead sx={{ background: '#e3f2fd' }}>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Alumni</TableCell>
              <TableCell>Goal</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date Requested</TableCell>
              <TableCell>Date Accepted</TableCell>
              <TableCell>Date Completed</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map(req => (
              <TableRow key={req._id} sx={{ '&:hover': { background: '#f5faff' } }}>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: blue[100], color: blue[700], fontWeight: 700 }}>{req.studentName?.[0]}</Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 500 }}>{req.studentName}</Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: green[100], color: green[700], fontWeight: 700 }}>{req.alumniName?.[0]}</Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 500 }}>{req.alumniName}</Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: blue[900] }}>{req.goalDescription}</Typography>
                </TableCell>
                <TableCell>
                  <Chip label={req.status} sx={{
                    bgcolor:
                      req.status === 'Accepted' ? green[100] :
                      req.status === 'Rejected' ? red[100] :
                      req.status === 'Completed' ? blue[100] : orange[100],
                    color:
                      req.status === 'Accepted' ? green[700] :
                      req.status === 'Rejected' ? red[700] :
                      req.status === 'Completed' ? blue[700] : orange[700],
                    fontWeight: 600
                  }} />
                </TableCell>
                <TableCell>{req.dateRequested ? new Date(req.dateRequested).toLocaleDateString() : '-'}</TableCell>
                <TableCell>{req.dateAccepted ? new Date(req.dateAccepted).toLocaleDateString() : '-'}</TableCell>
                <TableCell>{req.dateCompleted ? new Date(req.dateCompleted).toLocaleDateString() : '-'}</TableCell>
                <TableCell>
                  <Box sx={{ minWidth: 120 }}>
                    <LinearProgress variant="determinate" value={req.goalsSet ? (req.goalsCompleted / req.goalsSet) * 100 : 0} sx={{ height: 8, borderRadius: 5, bgcolor: blue[50] }} />
                    <Typography variant="caption" sx={{ color: blue[700], fontWeight: 500 }}>{req.goalsCompleted}/{req.goalsSet} goals</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Button size="small" variant="outlined" color="success" onClick={() => handleStatusChange(req._id, 'Accepted')} sx={{ fontWeight: 600 }}>Accept</Button>
                  <Button size="small" variant="outlined" color="error" onClick={() => handleStatusChange(req._id, 'Rejected')} sx={{ ml: 1, fontWeight: 600 }}>Reject</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Card sx={{ mb: 2, borderRadius: 3, boxShadow: 1 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1, color: blue[700] }}>Summary Reports</Typography>
          <Stack direction="row" spacing={4}>
            <Box>
              <Typography variant="subtitle2" sx={{ color: green[700] }}>Active mentorships per alumni:</Typography>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {Object.entries(summary.activePerAlumni).map(([alumni, count]) => (
                  <li key={alumni} style={{ color: blue[900], fontWeight: 500 }}>{alumni}: {count}</li>
                ))}
              </ul>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ color: orange[700] }}>Average duration of mentorships:</Typography>
              <Typography variant="body2" sx={{ color: blue[700], fontWeight: 500 }}>{summary.avgDuration} days</Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, action: '', requestId: null })}>
        <DialogTitle>Confirm {confirmDialog.action}</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to mark this request as {confirmDialog.action.toLowerCase()}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, action: '', requestId: null })}>Cancel</Button>
          <Button color="error" onClick={confirmAction}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminMentorship;
