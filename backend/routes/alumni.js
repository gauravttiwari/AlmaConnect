// Alumni Routes
const express = require('express');
const router = express.Router();
const alumniController = require('../controllers/alumniController');
const upload = require('../middleware/uploadMiddleware');
router.post('/:id/upload', upload.single('file'), alumniController.uploadProfile);

router.post('/register', alumniController.register);
router.get('/', alumniController.getAll);
router.get('/search', alumniController.search);
router.get('/:id', alumniController.getById);
router.put('/:id', alumniController.update);
router.delete('/:id', alumniController.delete);
router.put('/:id/verify', alumniController.verify);

module.exports = router;
