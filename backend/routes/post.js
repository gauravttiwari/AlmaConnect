const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, postController.createPost);
router.get('/feed', authenticateToken, postController.getFeed);
router.post('/:id/like', authenticateToken, postController.likePost);
router.post('/:id/comment', authenticateToken, postController.commentPost);
router.post('/:id/share', authenticateToken, postController.sharePost);

module.exports = router;
