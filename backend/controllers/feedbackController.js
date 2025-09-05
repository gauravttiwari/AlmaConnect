const Feedback = require('../models/Feedback');
const Alumni = require('../models/Alumni');

const Joi = require('joi');
exports.submitFeedback = async (req, res) => {
  const schema = Joi.object({
    mentor: Joi.string().required(),
    student: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().allow('')
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  try {
    const { mentor, student, rating, comment } = req.body;
    const feedback = await Feedback.create({ mentor, student, rating, comment });
    // Update mentor's ratings
    const feedbacks = await Feedback.find({ mentor });
    const avgRating = feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length;
    await Alumni.findByIdAndUpdate(mentor, { avgRating });
    res.status(201).json({ message: 'Feedback submitted', feedback });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTopMentors = async (req, res) => {
  try {
    const topMentors = await Alumni.find({ avgRating: { $exists: true } })
      .sort({ avgRating: -1 })
      .limit(10);
    res.json(topMentors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
