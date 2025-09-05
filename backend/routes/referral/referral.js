// Referral Routes
const express = require('express');
const router = express.Router();
const referralController = require('../../controllers/referral/referralController');

router.post('/post', referralController.postReferral);
router.get('/', referralController.getReferrals);
router.put('/status', referralController.updateStatus);
router.put('/feedback', referralController.addFeedback);

module.exports = router;
