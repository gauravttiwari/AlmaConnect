const express = require('express');
const router = express.Router();
const alumniController = require('../controllers/alumniController');
const eventController = require('../controllers/event/eventController');

router.patch('/alumni/:id/approve', alumniController.approve);
router.patch('/alumni/:id/block', alumniController.block);
router.patch('/alumni/:id/unblock', alumniController.unblock);
router.get('/alumni/count', alumniController.count);
router.get('/alumni', alumniController.list); // paginated
router.patch('/events/:id/approve', eventController.approveEvent);
router.patch('/events/:id/reject', eventController.rejectEvent);
router.get('/events/stats', eventController.eventStats);

module.exports = router;
