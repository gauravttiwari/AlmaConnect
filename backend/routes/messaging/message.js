// Message Routes
const express = require('express');
const router = express.Router();
const messageController = require('../../controllers/messaging/messageController');

router.post('/send', messageController.sendMessage);
router.get('/:conversationId', messageController.getMessages);
router.get('/group/:groupId', messageController.getMessages);

module.exports = router;
