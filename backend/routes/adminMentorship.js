const express = require('express');
const router = express.Router();
const adminMentorshipController = require('../controllers/adminMentorshipController');

// Get all mentorship requests (for admin)
router.get('/mentorship-requests', adminMentorshipController.getAllRequests);
// Change status manually (Accept/Reject)
router.patch('/mentorship-requests/:id/status', adminMentorshipController.changeStatus);
// Get mentorship summary reports
router.get('/mentorship-summary', adminMentorshipController.getSummary);

module.exports = router;
