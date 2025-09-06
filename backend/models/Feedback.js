const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Alumni', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', FeedbackSchema,'feedbacks');
