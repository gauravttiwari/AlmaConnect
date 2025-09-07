const Event = require('../models/Event');
const Registration = require('../models/Registration');
const fs = require('fs');
const path = require('path');

module.exports = {
  // Get all events
  async getAllEvents(req, res) {
    try {
      const events = await Event.find().sort({ createdAt: -1 });
      res.json({ events });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch events.' });
    }
  },

  // Approve/Reject event proposal
  async changeEventStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const event = await Event.findById(id);
      if (!event) return res.status(404).json({ error: 'Event not found.' });
      event.status = status;
      await event.save();
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update event status.' });
    }
  },

  // Edit event details
  async editEvent(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const event = await Event.findByIdAndUpdate(id, updates, { new: true });
      if (!event) return res.status(404).json({ error: 'Event not found.' });
      res.json({ event });
    } catch (err) {
      res.status(500).json({ error: 'Failed to edit event.' });
    }
  },

  // Get registrations for an event
  async getRegistrations(req, res) {
    try {
      const { id } = req.params;
      const regs = await Registration.find({ event: id }).populate('student', 'name');
      const formatted = regs.map(reg => ({
        _id: reg._id,
        studentName: reg.student?.name || ''
      }));
      res.json({ registrations: formatted });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch registrations.' });
    }
  },

  // Upload event replay/resources
  async uploadReplay(req, res) {
    try {
      const { id } = req.params;
      const event = await Event.findById(id);
      if (!event) return res.status(404).json({ error: 'Event not found.' });
      if (req.file) {
        event.replay = req.file.path;
        await event.save();
      }
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to upload replay.' });
    }
  },

  // Delete event
  async deleteEvent(req, res) {
    try {
      const { id } = req.params;
      await Event.findByIdAndDelete(id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete event.' });
    }
  }
};
