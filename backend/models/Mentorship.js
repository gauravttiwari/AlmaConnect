// Mentorship Request Schema
const mongoose = require('mongoose');
const MentorshipSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  alumni: { type: mongoose.Schema.Types.ObjectId, ref: 'Alumni' },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  goals: String,
  progress: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Mentorship', MentorshipSchema,'mentorships');
