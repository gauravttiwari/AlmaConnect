import React, { useEffect, useState } from 'react';
import CreatePost from './CreatePost';
import BottomNavBar from '../components/BottomNavBar';
import axios from 'axios';
import { Card, CardContent, Typography, IconButton, Box, TextField, Button, Divider } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ShareIcon from '@mui/icons-material/Share';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const API_URL = 'http://localhost:5000/api/posts/feed';

export default function StudentHome() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState({});

  const fetchPosts = () => {
    axios.get(API_URL, { withCredentials: true })
      .then(res => setPosts(res.data))
      .catch(() => setPosts([]));
  };
  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = async (id) => {
    await axios.post(`http://localhost:5000/api/posts/${id}/like`, {}, { withCredentials: true });
    fetchPosts();
  };

  const handleShare = async (id) => {
    await axios.post(`http://localhost:5000/api/posts/${id}/share`, {}, { withCredentials: true });
    fetchPosts();
  };

  const handleComment = async (id) => {
    if (!commentText[id]) return;
    await axios.post(`http://localhost:5000/api/posts/${id}/comment`, { text: commentText[id] }, { withCredentials: true });
    setCommentText({ ...commentText, [id]: '' });
    fetchPosts();
  };

  return (
    <>
      <Box sx={{ position: 'relative' }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{ position: 'absolute', top: 24, left: 24, background: '#fff', boxShadow: 2, zIndex: 1000 }}
          aria-label="back"
        >
          <ArrowBackIcon sx={{ color: '#1976d2', fontSize: 32 }} />
        </IconButton>
      <Box sx={{ maxWidth: 600, margin: '32px auto', pb: 10 }}>
        <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>Student & Alumni Feed</Typography>
        <CreatePost onPostCreated={fetchPosts} />
        {posts.length === 0 && (
          <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>No posts yet.</Typography>
        )}
        {posts.map(post => (
          <Card key={post._id} sx={{ mb: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                {post.author?.name || 'User'} • {new Date(post.createdAt).toLocaleString()}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>{post.content}</Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <IconButton onClick={() => handleLike(post._id)} color="primary">
                  <ThumbUpIcon /> {post.likes.length}
                </IconButton>
                <IconButton onClick={() => handleShare(post._id)} color="secondary">
                  <ShareIcon /> {post.shares.length}
                </IconButton>
                <IconButton color="default">
                  <ChatBubbleOutlineIcon /> {post.comments.length}
                </IconButton>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  placeholder="Add a comment..."
                  value={commentText[post._id] || ''}
                  onChange={e => setCommentText({ ...commentText, [post._id]: e.target.value })}
                  sx={{ flex: 1 }}
                />
                <Button variant="contained" onClick={() => handleComment(post._id)}>Comment</Button>
              </Box>
              {post.comments.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  {post.comments.map((c, idx) => (
                    <Typography key={idx} variant="body2" sx={{ mb: 1 }}>
                      <strong>{c.user?.name || 'User'}:</strong> {c.text}
                    </Typography>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
      <BottomNavBar />
    </>
  );
}
