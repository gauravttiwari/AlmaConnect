const Complaint = require('../models/Complaint');

const Joi = require('joi');
exports.submitComplaint = async (req, res) => {
  const schema = Joi.object({
    message: Joi.string().min(10).required()
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  try {
    const { message } = req.body;
    // Optionally, student can be attached if not anonymous
    const student = req.user ? req.user._id : undefined;
    const complaint = await Complaint.create({ message, student });
    res.status(201).json({ message: 'Complaint submitted', complaint });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
