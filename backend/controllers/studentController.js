
const cloudinary = require('../utils/cloudinary');
const Student = require('../models/Student');
const mongoose = require('mongoose');

const studentController = {
  async uploadProfile(req, res) {
    try {
      if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
      cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
        if (error) return res.status(500).json({ message: 'Upload error', error });
        Student.findByIdAndUpdate(req.params.id, { profilePic: result.secure_url }, { new: true }, (err, student) => {
          if (err || !student) return res.status(404).json({ message: 'Student not found' });
          res.json({ message: 'Profile picture uploaded', url: result.secure_url, student });
        });
      }).end(req.file.buffer);
    } catch (err) {
      res.status(500).json({ message: 'Server error', err });
    }
  },
  async register(req, res) {
    const Joi = require('joi');
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      graduationYear: Joi.number().integer().min(1950).max(new Date().getFullYear()),
      degree: Joi.string(),
      branch: Joi.string(),
      skills: Joi.array().items(Joi.string()),
      location: Joi.string(),
      linkedin: Joi.string(),
      github: Joi.string()
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    // ...existing code...
  },
  async getAll(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const students = await Student.find().skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await Student.countDocuments();
    res.json({ students, total, page, pages: Math.ceil(total / limit) });
  },
  async getById(req, res) {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Not found' });
    res.json(student);
  },
  async update(req, res) {
    const Joi = require('joi');
    const schema = Joi.object({
      name: Joi.string(),
      email: Joi.string().email(),
      graduationYear: Joi.number().integer().min(1950).max(new Date().getFullYear()),
      degree: Joi.string(),
      branch: Joi.string(),
      skills: Joi.array().items(Joi.string()),
      location: Joi.string(),
      linkedin: Joi.string(),
      github: Joi.string()
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) return res.status(404).json({ message: 'Not found' });
    res.json(student);
  },
  async delete(req, res) {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  },
  async search(req, res) {
    const { skills, graduationYear, branch } = req.query;
    const query = {};
    if (skills) query.skills = { $in: skills.split(',') };
    if (graduationYear) query.graduationYear = Number(graduationYear);
    if (branch) query.branch = branch;
    const students = await Student.find(query);
    res.json(students);
  }
};

module.exports = studentController;
