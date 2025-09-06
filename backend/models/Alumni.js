// Alumni Profile Schema
const mongoose = require('mongoose');
const AlumniSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  graduationYear: Number,
  degree: String,
  branch: String,
  company: String,
  role: String,
  skills: [String],
  location: String,
  linkedin: String,
  github: String,
  verified: { type: Boolean, default: false },
  avgRating: { type: Number, default: null },
  createdAt: { type: Date, default: Date.now }
});

AlumniSchema.index({ email: 1 });
AlumniSchema.index({ name: 1 });
AlumniSchema.index({ avgRating: -1 });
module.exports = mongoose.model('Alumni', AlumniSchema,'alumnis');
