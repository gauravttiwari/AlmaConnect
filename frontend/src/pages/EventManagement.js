import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Card, CardContent, Chip, Stack, TextField } from '@mui/material';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: '', eventId: null });
  const [editDialog, setEditDialog] = useState({ open: false, event: null });
  const [replayDialog, setReplayDialog] = useState({ open: false, eventId: null });
  const [editFields, setEditFields] = useState({ title: '', description: '', date: '', time: '', maxParticipants: '' });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/admin/events');
      if (!res.ok) throw new Error('API error: ' + res.status);
      const data = await res.json();
      setEvents(data.events || []);
    } catch (err) {
      setError('Failed to load events. ' + (err.message || ''));
      setEvents([]);
    }
    setLoading(false);
  };

  const handleApproveReject = async (eventId, status) => {
    setConfirmDialog({ open: true, action: status, eventId });
  };

  const confirmAction = async () => {
    if (confirmDialog.action === 'Approve' || confirmDialog.action === 'Reject') {
      await fetch(`http://localhost:5000/api/admin/events/${confirmDialog.eventId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: confirmDialog.action })
      });
      fetchEvents();
    } else if (confirmDialog.action === 'Delete') {
      await fetch(`http://localhost:5000/api/admin/events/${confirmDialog.eventId}`, {
        method: 'DELETE'
      });
      fetchEvents();
    }
    setConfirmDialog({ open: false, action: '', eventId: null });
  };

  const handleEdit = (event) => {
    setEditFields({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      maxParticipants: event.maxParticipants
    });
    setEditDialog({ open: true, event });
  };

  const saveEdit = async () => {
    await fetch(`http://localhost:5000/api/admin/events/${editDialog.event._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editFields)
    });
    setEditDialog({ open: false, event: null });
    fetchEvents();
  };

  const handleViewRegistrations = async (eventId) => {
    setSelectedEvent(events.find(e => e._id === eventId));
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/events/${eventId}/registrations`);
      if (!res.ok) throw new Error('API error: ' + res.status);
      const data = await res.json();
      setRegistrations(data.registrations || []);
    } catch (err) {
      setRegistrations([]);
    }
    setLoading(false);
  };

  const handleUploadReplay = (eventId) => {
    setReplayDialog({ open: true, eventId });
  };

  const uploadReplay = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    await fetch(`http://localhost:5000/api/admin/events/${replayDialog.eventId}/replay`, {
      method: 'POST',
      body: formData
    });
    setReplayDialog({ open: false, eventId: null });
    fetchEvents();
  };

  return (
    <Box sx={{ p: 3, background: '#f3f6fb', minHeight: '100vh' }}>
      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 3, background: 'linear-gradient(90deg, #e3f2fd 60%, #fff 100%)' }}>
        <CardContent>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>Event Management</Typography>
              <Typography variant="subtitle1" sx={{ color: '#90caf9' }}>Admin controls creation and approval of events</Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
      {loading && <Typography sx={{ mb: 2 }}>Loading...</Typography>}
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      <TableContainer component={Paper} sx={{ mb: 4, borderRadius: 3, boxShadow: 2 }}>
        <Table sx={{ minWidth: 900 }}>
          <TableHead sx={{ background: '#e3f2fd' }}>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Max Participants</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>Registrations</TableCell>
              <TableCell>Replay/Resources</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map(event => (
              <TableRow key={event._id}>
                <TableCell>{event.title}</TableCell>
                <TableCell>{event.description}</TableCell>
                <TableCell>{event.date}</TableCell>
                <TableCell>{event.time}</TableCell>
                <TableCell>{event.maxParticipants}</TableCell>
                <TableCell>
                  <Chip label={event.status} color={event.status === 'Approved' ? 'success' : event.status === 'Rejected' ? 'error' : 'warning'} />
                </TableCell>
                <TableCell>
                  <Button size="small" variant="outlined" color="success" onClick={() => handleApproveReject(event._id, 'Approve')}>Approve</Button>
                  <Button size="small" variant="outlined" color="error" onClick={() => handleApproveReject(event._id, 'Reject')} sx={{ ml: 1 }}>Reject</Button>
                  <Button size="small" variant="outlined" color="info" onClick={() => handleEdit(event)} sx={{ ml: 1 }}>Edit</Button>
                  <Button size="small" variant="outlined" color="error" onClick={() => handleApproveReject(event._id, 'Delete')} sx={{ ml: 1 }}>Delete</Button>
                </TableCell>
                <TableCell>
                  <Button size="small" variant="contained" color="primary" onClick={() => handleViewRegistrations(event._id)}>View</Button>
                </TableCell>
                <TableCell>
                  <Button size="small" variant="contained" color="info" onClick={() => handleUploadReplay(event._id)}>Upload</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Registrations Table */}
      {selectedEvent && (
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>Registrations for {selectedEvent.title}</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ background: '#e3f2fd' }}>
                  <TableRow>
                    <TableCell>Student Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {registrations.map(reg => (
                    <TableRow key={reg._id}>
                      <TableCell>{reg.studentName}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, event: null })}>
        <DialogTitle>Edit Event</DialogTitle>
        <DialogContent>
          <TextField label="Title" fullWidth margin="normal" value={editFields.title} onChange={e => setEditFields({ ...editFields, title: e.target.value })} />
          <TextField label="Description" fullWidth margin="normal" value={editFields.description} onChange={e => setEditFields({ ...editFields, description: e.target.value })} />
          <TextField label="Date" fullWidth margin="normal" value={editFields.date} onChange={e => setEditFields({ ...editFields, date: e.target.value })} />
          <TextField label="Time" fullWidth margin="normal" value={editFields.time} onChange={e => setEditFields({ ...editFields, time: e.target.value })} />
          <TextField label="Max Participants" fullWidth margin="normal" value={editFields.maxParticipants} onChange={e => setEditFields({ ...editFields, maxParticipants: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, event: null })}>Cancel</Button>
          <Button color="primary" onClick={saveEdit}>Save</Button>
        </DialogActions>
      </Dialog>
      {/* Replay Upload Dialog */}
      <Dialog open={replayDialog.open} onClose={() => setReplayDialog({ open: false, eventId: null })}>
        <DialogTitle>Upload Event Replay/Resources</DialogTitle>
        <DialogContent>
          <form onSubmit={uploadReplay} encType="multipart/form-data">
            <input type="file" name="replay" accept="video/*,application/pdf,ppt,pptx" required />
            <Button type="submit" color="primary" variant="contained" sx={{ mt: 2 }}>Upload</Button>
          </form>
        </DialogContent>
      </Dialog>
      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, action: '', eventId: null })}>
        <DialogTitle>Confirm {confirmDialog.action}</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to {confirmDialog.action.toLowerCase()}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, action: '', eventId: null })}>Cancel</Button>
          <Button color="error" onClick={confirmAction}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EventManagement;
