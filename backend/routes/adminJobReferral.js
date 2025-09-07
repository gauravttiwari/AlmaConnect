const express = require('express');
const router = express.Router();
const adminJobReferralController = require('../controllers/adminJobReferralController');

// Get all job referrals
router.get('/job-referrals', adminJobReferralController.getAllJobs);
// Approve/Reject job posting
router.patch('/job-referrals/:id/status', adminJobReferralController.changeJobStatus);
// Get applications for a job
router.get('/job-referrals/:id/applications', adminJobReferralController.getJobApplications);
// Update application status
router.patch('/job-applications/:appId/status', adminJobReferralController.changeApplicationStatus);
// Export job application data
router.get('/job-referrals/export', adminJobReferralController.exportApplications);

module.exports = router;
