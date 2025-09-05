// Event Schema
const mongoose = require('mongoose');
const EventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Alumni' },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  recordingUrl: String,
  calendarLink: String
});
module.exports = mongoose.model('Event', EventSchema);
