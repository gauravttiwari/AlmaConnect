const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  maxParticipants: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  replay: { type: String }, // file path for replay/resources
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', eventSchema);
