// Main backend entry point
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');


const authRoutes = require('./routes/auth');
const alumniRoutes = require('./routes/alumni');
const studentRoutes = require('./routes/student');
const mentorshipRoutes = require('./routes/mentorship');
const messageRoutes = require('./routes/messaging/message');
const eventRoutes = require('./routes/event/event');
const referralRoutes = require('./routes/referral/referral');
const jobRoutes = require('./routes/adminJob');
const adminRoutes = require('./routes/admin');
const feedbackRoutes = require('./routes/feedback');
const postRoutes = require('./routes/post');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });
global.io = io;

app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
// Rate limiting: 100 requests per 15 minutes per IP
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// API routes

app.use('/api/auth', authRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/mentorship', mentorshipRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', feedbackRoutes);
app.use('/api/posts', postRoutes);

// Socket.io setup
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('sendMessage', (data) => {
    io.emit('receiveMessage', data);
  });
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// MongoDB connection
mongoose.connect('mongodb+srv://almaconnect03_db_user:Lucifer892482@cluster0.swyxgex.mongodb.net/almaconnect?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
