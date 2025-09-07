const express = require('express');
const router = express.Router();
const adminEventController = require('../controllers/adminEventController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Get all events
router.get('/events', adminEventController.getAllEvents);
// Approve/Reject event proposal
router.patch('/events/:id/status', adminEventController.changeEventStatus);
// Edit event details
router.patch('/events/:id', adminEventController.editEvent);
// Get registrations for an event
router.get('/events/:id/registrations', adminEventController.getRegistrations);
// Upload event replay/resources
router.post('/events/:id/replay', upload.single('replay'), adminEventController.uploadReplay);
// Delete event
router.delete('/events/:id', adminEventController.deleteEvent);

module.exports = router;
