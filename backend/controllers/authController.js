// Auth Controller: Register, Login, Refresh
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret } = require('../middleware/authMiddleware');
const Student = require('../models/Student');
const Alumni = require('../models/Alumni');

async function register(req, res) {
  const { name, email, password, role, graduationYear, branch, company } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  let user;
  if (role === 'student') {
    user = new Student({ name, email, password: hashedPassword, graduationYear, branch });
  } else if (role === 'alumni') {
    user = new Alumni({ name, email, password: hashedPassword, graduationYear, branch, company });
  } else {
    return res.status(400).json({ message: 'Invalid role' });
  }
  await user.save();
  res.status(201).json({ message: 'User registered', user });
}

async function login(req, res) {
  const { email, password, role } = req.body;
  let user;
  if (role === 'student') {
    user = await Student.findOne({ email });
  } else if (role === 'alumni') {
    user = await Alumni.findOne({ email });
  }
  if (!user) return res.status(404).json({ message: 'User not found' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid password' });
  const token = jwt.sign({ id: user._id, role }, secret, { expiresIn: '1h' });
  res.json({ token, user });
}

module.exports = { register, login };
