// Mentorship Routes
const express = require('express');
const router = express.Router();
const mentorshipController = require('../controllers/mentorshipController');

router.post('/request', mentorshipController.requestMentorship);
router.put('/respond', mentorshipController.respondToRequest);
router.get('/', mentorshipController.getMentorships);
router.put('/progress', mentorshipController.updateProgress);

module.exports = router;
