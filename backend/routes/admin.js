const express = require('express');
const router = express.Router();
const alumniController = require('../controllers/alumniController');
const eventController = require('../controllers/event/eventController');
const adminController = require('../controllers/adminController');

router.patch('/alumni/:id/approve', alumniController.approve);
router.patch('/alumni/:id/block', alumniController.block);
router.patch('/alumni/:id/unblock', alumniController.unblock);
router.get('/alumni/count', alumniController.count);
router.get('/alumni', alumniController.getAll); // paginated
router.patch('/events/:id/approve', eventController.approveEvent);
router.patch('/events/:id/reject', eventController.rejectEvent);
router.get('/events/stats', eventController.eventStats);
router.get('/dashboard-stats', adminController.dashboardStats);

module.exports = router;
