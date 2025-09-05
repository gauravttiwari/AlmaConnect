const Job = require('../models/Job');
const cloudinary = require('../utils/cloudinary');

module.exports = {
  async createJob(req, res) {
    const job = new Job({ ...req.body, postedBy: req.user?.id });
    await job.save();
    res.status(201).json(job);
  },
  async getJobs(req, res) {
    const jobs = await Job.find();
    res.json(jobs);
  },
  async applyJob(req, res) {
    const { id } = req.params;
    const { studentId, resume } = req.body;
    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    job.applicants.push({ student: studentId, resume });
    await job.save();
    res.json({ message: 'Applied', job });
  },
  async updateStatus(req, res) {
    const { id } = req.params;
    const { studentId, status } = req.body;
    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    const applicant = job.applicants.find(a => a.student.toString() === studentId);
    if (!applicant) return res.status(404).json({ message: 'Applicant not found' });
    applicant.status = status;
    await job.save();
    res.json({ message: 'Status updated', job });
  },
  async uploadResume(req, res) {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
      if (error) return res.status(500).json({ message: 'Upload error', error });
      res.json({ url: result.secure_url });
    }).end(req.file.buffer);
  },
  async addFeedback(req, res) {
    const { id } = req.params;
    const { studentId, feedback } = req.body;
    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    const applicant = job.applicants.find(a => a.student.toString() === studentId);
    if (!applicant) return res.status(404).json({ message: 'Applicant not found' });
    applicant.feedback = feedback;
    await job.save();
    res.json({ message: 'Feedback added', job });
  }
};
