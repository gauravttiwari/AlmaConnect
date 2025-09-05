// Multer middleware for file uploads
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
module.exports = upload;
