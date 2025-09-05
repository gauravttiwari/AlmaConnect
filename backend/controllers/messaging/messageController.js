// Message Controller
const Message = require('../../models/messaging/Message');
const mongoose = require('mongoose');

module.exports = {
  async sendMessage(req, res) {
    const { sender, senderModel, receiver, receiverModel, content, groupId } = req.body;
    const message = new Message({ sender, senderModel, receiver, receiverModel, content, groupId });
    await message.save();
    res.status(201).json(message);
  },
  async getMessages(req, res) {
    const { conversationId, groupId } = req.params;
    let messages;
    if (groupId) {
      messages = await Message.find({ groupId });
    } else {
      messages = await Message.find({
        $or: [
          { sender: conversationId },
          { receiver: conversationId }
        ]
      });
    }
    res.json(messages);
  }
};
