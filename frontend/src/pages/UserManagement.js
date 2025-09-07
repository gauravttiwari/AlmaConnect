import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Select, MenuItem, Box, Typography } from '@mui/material';

const UserManagement = () => {
  const [students, setStudents] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  const [graduationYear, setGraduationYear] = useState('');
  const [branch, setBranch] = useState('');
  const [company, setCompany] = useState('');
  // Dialog state
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: '', user: null, role: '' });

  useEffect(() => {
    fetchUsers();
  }, [search, role, graduationYear, branch, company]);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (search) params.append('name', search);
      if (role !== 'all') params.append('role', role);
      if (graduationYear) params.append('graduationYear', graduationYear);
      if (branch) params.append('branch', branch);
      if (company) params.append('company', company);
      const res = await fetch(`http://localhost:5000/api/admin/users?${params.toString()}`);
      if (!res.ok) throw new Error('API error: ' + res.status);
      const data = await res.json();
      setStudents(data.students || []);
      setAlumni(data.alumni || []);
    } catch (err) {
      setError('Failed to load users. ' + (err.message || ''));
      setStudents([]);
      setAlumni([]);
    }
    setLoading(false);
  };

  const handleVerify = async (id, verified) => {
    await fetch(`http://localhost:5000/api/admin/alumni/${id}/verify`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verified })
    });
    fetchUsers();
  };

  const handleBlock = async (role, id, blocked) => {
    setConfirmDialog({ open: true, action: blocked ? 'Unblock' : 'Block', user: id, role });
  };

  const handleDelete = async (role, id) => {
    setConfirmDialog({ open: true, action: 'Delete', user: id, role });
  };

  const confirmAction = async () => {
    if (confirmDialog.action === 'Block' || confirmDialog.action === 'Unblock') {
      await fetch(`http://localhost:5000/api/admin/user/${confirmDialog.role}/${confirmDialog.user}/block`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blocked: confirmDialog.action === 'Block' })
      });
    } else if (confirmDialog.action === 'Delete') {
      await fetch(`http://localhost:5000/api/admin/user/${confirmDialog.role}/${confirmDialog.user}`, {
        method: 'DELETE'
      });
    }
    setConfirmDialog({ open: false, action: '', user: null, role: '' });
    fetchUsers();
  };

  const handleExport = () => {
    window.open('http://localhost:5000/api/admin/users/export', '_blank');
  };

  return (
    <Box sx={{ p: 3 }}>
      {loading && <Typography sx={{ mb: 2 }}>Loading users...</Typography>}
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>User Management</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField label="Search Name" value={search} onChange={e => setSearch(e.target.value)} />
        <Select value={role} onChange={e => setRole(e.target.value)}>
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="student">Student</MenuItem>
          <MenuItem value="alumni">Alumni</MenuItem>
        </Select>
        <TextField label="Graduation Year" value={graduationYear} onChange={e => setGraduationYear(e.target.value)} />
        <TextField label="Branch" value={branch} onChange={e => setBranch(e.target.value)} />
        <TextField label="Company" value={company} onChange={e => setCompany(e.target.value)} />
        <Button variant="contained" color="primary" onClick={handleExport}>Export CSV</Button>
      </Box>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Graduation Year</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>LinkedIn</TableCell>
              <TableCell>Verified</TableCell>
              <TableCell>Blocked</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map(user => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>Student</TableCell>
                <TableCell>{user.graduationYear}</TableCell>
                <TableCell>{user.branch}</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>{user.blocked ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <Button size="small" color={user.blocked ? 'success' : 'error'} onClick={() => handleBlock('student', user._id, !user.blocked)}>
                    {user.blocked ? 'Unblock' : 'Block'}
                  </Button>
                  <Button size="small" color="error" onClick={() => handleDelete('student', user._id)} sx={{ ml: 1 }}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
            {alumni.map(user => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>Alumni</TableCell>
                <TableCell>{user.graduationYear}</TableCell>
                <TableCell>{user.branch}</TableCell>
                <TableCell>{user.company}</TableCell>
                <TableCell><a href={user.linkedin} target="_blank" rel="noopener noreferrer">{user.linkedin}</a></TableCell>
                <TableCell>{user.verified ? 'Yes' : 'No'}</TableCell>
                <TableCell>{user.blocked ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <Button size="small" color={user.verified ? 'error' : 'success'} onClick={() => handleVerify(user._id, !user.verified)}>
                    {user.verified ? 'Reject' : 'Approve'}
                  </Button>
                  <Button size="small" color={user.blocked ? 'success' : 'error'} onClick={() => handleBlock('alumni', user._id, !user.blocked)} sx={{ ml: 1 }}>
                    {user.blocked ? 'Unblock' : 'Block'}
                  </Button>
                  <Button size="small" color="error" onClick={() => handleDelete('alumni', user._id)} sx={{ ml: 1 }}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, action: '', user: null, role: '' })}>
        <DialogTitle>Confirm {confirmDialog.action}</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to {confirmDialog.action.toLowerCase()} this user?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, action: '', user: null, role: '' })}>Cancel</Button>
          <Button color="error" onClick={confirmAction}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
