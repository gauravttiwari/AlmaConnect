const Student = require('../models/Student');
const Alumni = require('../models/Alumni');
const Event = require('../models/Event');
const Mentorship = require('../models/Mentorship');
const Referral = require('../models/referral/Referral');
const { Parser } = require('json2csv');

const mongoose = require('mongoose');

const adminController = {
  async dashboardStats(req, res) {
    try {
      // Key statistics
      const totalStudents = await Student.countDocuments();
      const totalAlumni = await Alumni.countDocuments();
      const totalEvents = await Event.countDocuments();
      const mentorshipStatus = await Mentorship.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);
      const totalMentorships = mentorshipStatus.reduce((acc, cur) => acc + cur.count, 0);
      const totalJobReferrals = await Referral.countDocuments();

      // Monthly mentorships created (last 12 months)
      const mentorshipsMonthly = await Mentorship.aggregate([
        { $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 }
        } },
        { $sort: { _id: 1 } }
      ]);

      // Job referrals over time (last 12 months)
      const jobReferralsMonthly = await Referral.aggregate([
        { $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 }
        } },
        { $sort: { _id: 1 } }
      ]);

      // Event participation trends
      const events = await Event.find({}, 'title participants');
      const eventTrends = events.map(e => ({ title: e.title, participants: e.participants.length }));

      res.json({
        totalStudents,
        totalAlumni,
        totalEvents,
        mentorshipStatus,
        totalMentorships,
        totalJobReferrals,
        mentorshipsMonthly,
        jobReferralsMonthly,
        eventTrends
      });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching dashboard stats', error: err });
    }
  },

  // Get all users (students + alumni) with search/filter
  async getAllUsers(req, res) {
    try {
      const { name, role, graduationYear, branch, company } = req.query;
      let studentQuery = {};
      let alumniQuery = {};
      if (name) {
        studentQuery.name = alumniQuery.name = { $regex: name, $options: 'i' };
      }
      if (role === 'student') alumniQuery = null;
      if (role === 'alumni') studentQuery = null;
      if (graduationYear) {
        studentQuery.graduationYear = alumniQuery.graduationYear = Number(graduationYear);
      }
      if (branch) {
        studentQuery.branch = alumniQuery.branch = branch;
      }
      if (company) alumniQuery.company = company;
      let students = [];
      let alumni = [];
      if (studentQuery) students = await Student.find(studentQuery);
      if (alumniQuery) alumni = await Alumni.find(alumniQuery);
      res.json({ students, alumni });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching users', error: err });
    }
  },

  // Approve/Reject alumni profile
  async verifyAlumni(req, res) {
    try {
      const { id } = req.params;
      const { verified } = req.body;
      const alumni = await Alumni.findByIdAndUpdate(id, { verified }, { new: true });
      if (!alumni) return res.status(404).json({ message: 'Alumni not found' });
      res.json(alumni);
    } catch (err) {
      res.status(500).json({ message: 'Error updating alumni', error: err });
    }
  },

  // Block/Unblock user
  async blockUser(req, res) {
    try {
      const { id, role } = req.params;
      const { blocked } = req.body;
      let user;
      if (role === 'student') user = await Student.findByIdAndUpdate(id, { blocked }, { new: true });
      else user = await Alumni.findByIdAndUpdate(id, { blocked }, { new: true });
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: 'Error updating user', error: err });
    }
  },

  // Soft delete user
  async deleteUser(req, res) {
    try {
      const { id, role } = req.params;
      let user;
      if (role === 'student') user = await Student.findByIdAndUpdate(id, { deleted: true }, { new: true });
      else user = await Alumni.findByIdAndUpdate(id, { deleted: true }, { new: true });
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: 'Error deleting user', error: err });
    }
  },

  // Export users list (CSV)
  async exportUsers(req, res) {
    try {
      const students = await Student.find({ deleted: { $ne: true } });
      const alumni = await Alumni.find({ deleted: { $ne: true } });
      const users = [...students, ...alumni];
      const fields = ['name', 'email', 'role', 'graduationYear', 'branch', 'company', 'linkedin', 'blocked', 'verified'];
      const parser = new Parser({ fields });
      const csv = parser.parse(users);
      res.header('Content-Type', 'text/csv');
      res.attachment('users.csv');
      res.send(csv);
    } catch (err) {
      res.status(500).json({ message: 'Error exporting users', error: err });
    }
  }
};

module.exports = adminController;
