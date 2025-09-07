import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Card, CardContent, Chip, Stack } from '@mui/material';

const JobReferralManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: '', jobId: null, appId: null });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/admin/job-referrals');
      if (!res.ok) throw new Error('API error: ' + res.status);
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (err) {
      setError('Failed to load jobs. ' + (err.message || ''));
      setJobs([]);
    }
    setLoading(false);
  };

  const handleApproveReject = async (jobId, status) => {
    setConfirmDialog({ open: true, action: status, jobId });
  };

  const confirmAction = async () => {
    if (confirmDialog.action === 'Approve' || confirmDialog.action === 'Reject') {
      await fetch(`http://localhost:5000/api/admin/job-referrals/${confirmDialog.jobId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: confirmDialog.action })
      });
      fetchJobs();
    } else if (confirmDialog.action === 'Export') {
      window.open(`http://localhost:5000/api/admin/job-referrals/export`, '_blank');
    } else if (confirmDialog.action && confirmDialog.appId) {
      await fetch(`http://localhost:5000/api/admin/job-applications/${confirmDialog.appId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: confirmDialog.action })
      });
      fetchApplications(selectedJob._id);
    }
    setConfirmDialog({ open: false, action: '', jobId: null, appId: null });
  };

  const fetchApplications = async (jobId) => {
    setSelectedJob(jobs.find(j => j._id === jobId));
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/job-referrals/${jobId}/applications`);
      if (!res.ok) throw new Error('API error: ' + res.status);
      const data = await res.json();
      setApplications(data.applications || []);
    } catch (err) {
      setApplications([]);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ p: 3, background: '#f3f6fb', minHeight: '100vh' }}>
      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 3, background: 'linear-gradient(90deg, #e3f2fd 60%, #fff 100%)' }}>
        <CardContent>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>Job Referral Management</Typography>
              <Typography variant="subtitle1" sx={{ color: '#90caf9' }}>Manage job postings and referral applications</Typography>
            </Box>
            <Button variant="contained" color="primary" onClick={() => setConfirmDialog({ open: true, action: 'Export' })}>Export Data</Button>
          </Stack>
        </CardContent>
      </Card>
      {loading && <Typography sx={{ mb: 2 }}>Loading...</Typography>}
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      <TableContainer component={Paper} sx={{ mb: 4, borderRadius: 3, boxShadow: 2 }}>
        <Table sx={{ minWidth: 900 }}>
          <TableHead sx={{ background: '#e3f2fd' }}>
            <TableRow>
              <TableCell>Job Title</TableCell>
              <TableCell>Company Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Date Posted</TableCell>
              <TableCell>Application Deadline</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>View Applications</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.map(job => (
              <TableRow key={job._id}>
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.company}</TableCell>
                <TableCell>{job.description}</TableCell>
                <TableCell>{job.datePosted ? new Date(job.datePosted).toLocaleDateString() : '-'}</TableCell>
                <TableCell>{job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : '-'}</TableCell>
                <TableCell>
                  <Chip label={job.status} color={job.status === 'Approved' ? 'success' : job.status === 'Rejected' ? 'error' : 'warning'} />
                </TableCell>
                <TableCell>
                  <Button size="small" variant="outlined" color="success" onClick={() => handleApproveReject(job._id, 'Approve')}>Approve</Button>
                  <Button size="small" variant="outlined" color="error" onClick={() => handleApproveReject(job._id, 'Reject')} sx={{ ml: 1 }}>Reject</Button>
                </TableCell>
                <TableCell>
                  <Button size="small" variant="contained" color="primary" onClick={() => fetchApplications(job._id)}>View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Applications Table */}
      {selectedJob && (
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>Applications for {selectedJob.title} at {selectedJob.company}</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ background: '#e3f2fd' }}>
                  <TableRow>
                    <TableCell>Student Name</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Update Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applications.map(app => (
                    <TableRow key={app._id}>
                      <TableCell>{app.studentName}</TableCell>
                      <TableCell>
                        <Chip label={app.status} color={app.status === 'Selected' ? 'success' : app.status === 'Rejected' ? 'error' : app.status === 'Interview' ? 'info' : 'warning'} />
                      </TableCell>
                      <TableCell>
                        <Button size="small" variant="outlined" color="info" onClick={() => setConfirmDialog({ open: true, action: 'Interview', appId: app._id })}>Interview</Button>
                        <Button size="small" variant="outlined" color="success" onClick={() => setConfirmDialog({ open: true, action: 'Selected', appId: app._id })} sx={{ ml: 1 }}>Select</Button>
                        <Button size="small" variant="outlined" color="error" onClick={() => setConfirmDialog({ open: true, action: 'Rejected', appId: app._id })} sx={{ ml: 1 }}>Reject</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, action: '', jobId: null, appId: null })}>
        <DialogTitle>Confirm {confirmDialog.action}</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to {confirmDialog.action.toLowerCase()}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, action: '', jobId: null, appId: null })}>Cancel</Button>
          <Button color="error" onClick={confirmAction}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JobReferralManagement;
