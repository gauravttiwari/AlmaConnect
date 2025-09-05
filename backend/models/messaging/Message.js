// Message Schema
const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, refPath: 'senderModel' },
  senderModel: String, // 'Student' or 'Alumni'
  receiver: { type: mongoose.Schema.Types.ObjectId, refPath: 'receiverModel' },
  receiverModel: String, // 'Student' or 'Alumni'
  content: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Message', MessageSchema);
