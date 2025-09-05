const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const upload = require('../middleware/uploadMiddleware');

router.post('/', jobController.createJob);
router.get('/', jobController.getJobs);
router.post('/:id/apply', jobController.applyJob);
router.patch('/:id/status', jobController.updateStatus);
router.post('/resume', upload.single('file'), jobController.uploadResume);
router.post('/:id/feedback', jobController.addFeedback);

module.exports = router;
