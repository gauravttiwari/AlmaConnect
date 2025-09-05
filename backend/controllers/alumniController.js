
const Alumni = require('../models/Alumni');
const mongoose = require('mongoose');
const cloudinary = require('../utils/cloudinary');

const alumniController = {
  async approve(req, res) {
    const alumni = await Alumni.findByIdAndUpdate(req.params.id, { verified: true }, { new: true });
    if (!alumni) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Alumni approved', alumni });
  },
  async block(req, res) {
    const alumni = await Alumni.findByIdAndUpdate(req.params.id, { blocked: true }, { new: true });
    if (!alumni) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Alumni blocked', alumni });
  },
  async unblock(req, res) {
    const alumni = await Alumni.findByIdAndUpdate(req.params.id, { blocked: false }, { new: true });
    if (!alumni) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Alumni unblocked', alumni });
  },
  async count(req, res) {
    const count = await Alumni.countDocuments();
    res.json({ count });
  },
  async list(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const alumni = await Alumni.find().skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await Alumni.countDocuments();
    res.json({ alumni, total, page, pages: Math.ceil(total / limit) });
  },
  async uploadProfile(req, res) {
    try {
      if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
      cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
        if (error) return res.status(500).json({ message: 'Upload error', error });
        Alumni.findByIdAndUpdate(req.params.id, { profilePic: result.secure_url }, { new: true }, (err, alumni) => {
          if (err || !alumni) return res.status(404).json({ message: 'Alumni not found' });
          res.json({ message: 'Profile picture uploaded', url: result.secure_url, alumni });
        });
      }).end(req.file.buffer);
    } catch (err) {
      res.status(500).json({ message: 'Server error', err });
    }
  },
  async register(req, res) {
    // ...existing code...
  },
  async getAll(req, res) {
    const alumni = await Alumni.find();
    res.json(alumni);
  },
  async getById(req, res) {
    const alumni = await Alumni.findById(req.params.id);
    if (!alumni) return res.status(404).json({ message: 'Not found' });
    res.json(alumni);
  },
  async update(req, res) {
    const alumni = await Alumni.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!alumni) return res.status(404).json({ message: 'Not found' });
    res.json(alumni);
  },
  async delete(req, res) {
    const alumni = await Alumni.findByIdAndDelete(req.params.id);
    if (!alumni) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  },
  async verify(req, res) {
    const alumni = await Alumni.findByIdAndUpdate(req.params.id, { verified: true }, { new: true });
    if (!alumni) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Alumni verified', alumni });
  },
  async search(req, res) {
    const { skills, company, graduationYear, location } = req.query;
    const query = {};
    if (skills) query.skills = { $in: skills.split(',') };
    if (company) query.company = company;
    if (graduationYear) query.graduationYear = Number(graduationYear);
    if (location) query.location = location;
    const alumni = await Alumni.find(query);
    res.json(alumni);
  }
};

module.exports = alumniController;
