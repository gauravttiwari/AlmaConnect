const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const complaintController = require('../controllers/complaintController');

// Feedback
router.post('/feedback', feedbackController.submitFeedback);
router.get('/mentors/top', feedbackController.getTopMentors);

// Complaints
router.post('/complaint', complaintController.submitComplaint);
router.get('/complaints', complaintController.getComplaints); // admin only

module.exports = router;
