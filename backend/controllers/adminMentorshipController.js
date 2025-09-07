const Mentorship = require('../models/Mentorship');
const Alumni = require('../models/Alumni');

module.exports = {
  // Get all mentorship requests with details
  async getAllRequests(req, res) {
    try {
      const requests = await Mentorship.find()
        .populate('student', 'name')
        .populate('alumni', 'name')
        .sort({ createdAt: -1 });
      // Format for frontend
      const formatted = requests.map(req => ({
        _id: req._id,
        studentName: req.student?.name || '',
        alumniName: req.alumni?.name || '',
        goalDescription: req.goalDescription,
        status: req.status,
        dateRequested: req.createdAt,
        dateAccepted: req.dateAccepted,
        dateCompleted: req.dateCompleted,
        goalsSet: req.goalsSet || 0,
        goalsCompleted: req.goalsCompleted || 0
      }));
      res.json({ requests: formatted });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch mentorship requests.' });
    }
  },

  // Change status manually (Accept/Reject)
  async changeStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const mentorship = await Mentorship.findById(id);
      if (!mentorship) return res.status(404).json({ error: 'Request not found.' });
      mentorship.status = status;
      if (status === 'Accepted') mentorship.dateAccepted = new Date();
      if (status === 'Rejected') mentorship.dateCompleted = new Date();
      await mentorship.save();
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update status.' });
    }
  },

  // Summary reports
  async getSummary(req, res) {
    try {
      // Count of active mentorships per alumni
      const active = await Mentorship.aggregate([
        { $match: { status: 'Accepted' } },
        { $group: { _id: '$alumni', count: { $sum: 1 } } }
      ]);
      // Get alumni names
      const alumniIds = active.map(a => a._id);
      const alumniList = await Alumni.find({ _id: { $in: alumniIds } });
      const activePerAlumni = {};
      active.forEach(a => {
        const alumni = alumniList.find(al => al._id.equals(a._id));
        activePerAlumni[alumni?.name || 'Unknown'] = a.count;
      });
      // Average duration of mentorships
      const completed = await Mentorship.find({ dateAccepted: { $exists: true }, dateCompleted: { $exists: true } });
      let avgDuration = 0;
      if (completed.length > 0) {
        const totalDays = completed.reduce((sum, m) => {
          const start = new Date(m.dateAccepted);
          const end = new Date(m.dateCompleted);
          return sum + ((end - start) / (1000 * 60 * 60 * 24));
        }, 0);
        avgDuration = Math.round(totalDays / completed.length);
      }
      res.json({ activePerAlumni, avgDuration });
    } catch (err) {
      res.json({ activePerAlumni: {}, avgDuration: 0 });
    }
  }
};
