import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Box, TextField, Button } from '@mui/material';

export default function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState('');
  const [popup, setPopup] = useState({ show: false, message: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      await axios.post('http://localhost:5000/api/posts/', { content }, { withCredentials: true });
      setContent('');
      setPopup({ show: true, message: 'Post shared!', type: 'success' });
      setTimeout(() => setPopup({ show: false, message: '', type: '' }), 2000);
      if (onPostCreated) onPostCreated();
    } catch {
      setPopup({ show: true, message: 'Failed to share post', type: 'error' });
      setTimeout(() => setPopup({ show: false, message: '', type: '' }), 2000);
    }
  };

  return (
    <Card sx={{ mb: 3, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>Share a Post</Typography>
        {popup.show && (
          <Box sx={{
            background: popup.type === 'success' ? '#4caf50' : '#f44336',
            color: '#fff',
            padding: '8px',
            borderRadius: '6px',
            textAlign: 'center',
            mb: 2,
            fontWeight: 500
          }}>{popup.message}</Box>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            minRows={2}
            placeholder="What's on your mind?"
            value={content}
            onChange={e => setContent(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" type="submit">Share</Button>
        </form>
      </CardContent>
    </Card>
  );
}
