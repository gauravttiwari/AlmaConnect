const mongoose = require('mongoose');

const referralApplicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  status: {
    type: String,
    enum: ['Applied', 'Interview', 'Selected', 'Rejected'],
    default: 'Applied'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ReferralApplication', referralApplicationSchema);
