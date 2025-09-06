const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' }, // optional for anonymity
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  resolved: { type: Boolean, default: false }
});

module.exports = mongoose.model('Complaint', ComplaintSchema,'complaints');
