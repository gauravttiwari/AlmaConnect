// Mentorship Controller
const Mentorship = require('../models/Mentorship');
module.exports = {
  async requestMentorship(req, res) {
    const Joi = require('joi');
    const schema = Joi.object({
      mentor: Joi.string().required(),
      student: Joi.string().required(),
      topic: Joi.string().required(),
      message: Joi.string().allow('')
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    // ...request logic...
  },
  async respondToRequest(req, res) {
    // ...accept/reject logic...
    // After acceptance, send email notification
    if (req.body.status === 'accepted') {
      const { sendEmail } = require('../utils/email');
      // Fetch mentor and student emails (pseudo-code, replace with actual fetch)
      const mentorEmail = 'mentor@example.com';
      const studentEmail = 'student@example.com';
      await sendEmail(mentorEmail, 'Mentorship Accepted', 'Your mentorship request has been accepted.');
      await sendEmail(studentEmail, 'Mentorship Accepted', 'You have been accepted for mentorship.');
      // Emit Socket.io notification (pseudo-code, replace with actual Socket.io instance)
      if (global.io) {
        global.io.emit('notification', {
          type: 'mentorship_accepted',
          message: 'Your mentorship request has been accepted.',
          mentorEmail,
          studentEmail
        });
      }
    }
  },
  async getMentorships(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const mentorships = await Mentorship.find().skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await Mentorship.countDocuments();
    res.json({ mentorships, total, page, pages: Math.ceil(total / limit) });
  },
  async updateProgress(req, res) {
    // ...update progress...
  }
};
