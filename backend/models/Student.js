// Student Profile Schema
const mongoose = require('mongoose');
const StudentSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  graduationYear: Number,
  branch: String,
  skills: [String],
  linkedin: String,
  resume: String
});
module.exports = mongoose.model('Student', StudentSchema);
