// Referral Schema
const mongoose = require('mongoose');
const ReferralSchema = new mongoose.Schema({
  alumni: { type: mongoose.Schema.Types.ObjectId, ref: 'Alumni' },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  jobTitle: String,
  company: String,
  status: { type: String, enum: ['applied', 'interview', 'selected', 'rejected'], default: 'applied' },
  feedback: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Referral', ReferralSchema);
