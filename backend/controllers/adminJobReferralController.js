const Job = require('../models/Job');
const ReferralApplication = require('../models/ReferralApplication');
const { Parser } = require('json2csv');

module.exports = {
  // Get all jobs posted by alumni
  async getAllJobs(req, res) {
    try {
      const jobs = await Job.find().sort({ createdAt: -1 });
      res.json({ jobs });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch jobs.' });
    }
  },

  // Approve/Reject job posting
  async changeJobStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const job = await Job.findById(id);
      if (!job) return res.status(404).json({ error: 'Job not found.' });
      job.status = status;
      await job.save();
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update job status.' });
    }
  },

  // Get applications for a job
  async getJobApplications(req, res) {
    try {
      const { id } = req.params;
      const applications = await ReferralApplication.find({ job: id }).populate('student', 'name');
      const formatted = applications.map(app => ({
        _id: app._id,
        studentName: app.student?.name || '',
        status: app.status
      }));
      res.json({ applications: formatted });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch applications.' });
    }
  },

  // Update application status
  async changeApplicationStatus(req, res) {
    try {
      const { appId } = req.params;
      const { status } = req.body;
      const app = await ReferralApplication.findById(appId);
      if (!app) return res.status(404).json({ error: 'Application not found.' });
      app.status = status;
      await app.save();
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update application status.' });
    }
  },

  // Export job application data
  async exportApplications(req, res) {
    try {
      const applications = await ReferralApplication.find().populate('student', 'name').populate('job', 'title company');
      const data = applications.map(app => ({
        student: app.student?.name || '',
        jobTitle: app.job?.title || '',
        company: app.job?.company || '',
        status: app.status
      }));
      const parser = new Parser();
      const csv = parser.parse(data);
      res.header('Content-Type', 'text/csv');
      res.attachment('job_applications.csv');
      return res.send(csv);
    } catch (err) {
      res.status(500).json({ error: 'Failed to export applications.' });
    }
  }
};
