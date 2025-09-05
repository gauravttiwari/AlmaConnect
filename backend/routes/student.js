// Student Routes
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const upload = require('../middleware/uploadMiddleware');
router.post('/:id/upload', upload.single('file'), studentController.uploadProfile);

router.post('/register', studentController.register);
router.get('/', studentController.getAll);
router.get('/search', studentController.search);
router.get('/:id', studentController.getById);
router.put('/:id', studentController.update);
router.delete('/:id', studentController.delete);

module.exports = router;
