const Student = require('../models/Student');
const Alumni = require('../models/Alumni');
const Mentorship = require('../models/Mentorship');
const Referral = require('../models/referral/Referral');
const Event = require('../models/event/Event');

const adminController = {
  async dashboardStats(req, res) {
    try {
      const totalStudents = await Student.countDocuments();
      const totalAlumni = await Alumni.countDocuments();
      const activeUsers = totalStudents + totalAlumni;
      const pendingAlumni = await Alumni.countDocuments({ verified: false });
      const pendingEvents = await Event.countDocuments({ approved: false });
      const activeMentorships = await Mentorship.countDocuments({ status: 'accepted' });
      const jobReferrals = await Referral.countDocuments();
      // Event participation trends
      const events = await Event.find({}, 'title participants');
      const eventTrends = events.map(e => ({ title: e.title, participants: e.participants.length }));
      res.json({
        totalStudents,
        totalAlumni,
        activeUsers,
        pendingAlumni,
        pendingEvents,
        activeMentorships,
        jobReferrals,
        eventTrends
      });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching dashboard stats', error: err });
    }
  }
};

module.exports = adminController;
