// Event Routes
const express = require('express');
const router = express.Router();
const eventController = require('../../controllers/event/eventController');
const upload = require('../../middleware/uploadMiddleware');

router.post('/create', eventController.createEvent);
router.get('/', eventController.getEvents);
router.post('/:id/register', eventController.registerEvent);
router.post('/recording', upload.single('file'), eventController.addRecording);
router.get('/upcoming', eventController.upcomingEvents);

module.exports = router;
