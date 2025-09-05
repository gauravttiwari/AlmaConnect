const Event = require('../../models/event/Event');
const cloudinary = require('../../utils/cloudinary');

const eventController = {
  async approveEvent(req, res) {
    const event = await Event.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event approved', event });
  },
  async rejectEvent(req, res) {
    const event = await Event.findByIdAndUpdate(req.params.id, { approved: false }, { new: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event rejected', event });
  },
  async eventStats(req, res) {
    const total = await Event.countDocuments();
    const upcoming = await Event.countDocuments({ date: { $gte: new Date() } });
    res.json({ total, upcoming });
  },
  async createEvent(req, res) {
    const Joi = require('joi');
    const schema = Joi.object({
      title: Joi.string().required(),
      date: Joi.date().required(),
      description: Joi.string().required(),
      location: Joi.string().required()
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const event = new Event({ ...req.body, createdBy: req.user?.id });
    await event.save();
    res.status(201).json(event);
  },
  async getEvents(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const events = await Event.find().skip(skip).limit(limit).sort({ date: 1 });
    const total = await Event.countDocuments();
    res.json({ events, total, page, pages: Math.ceil(total / limit) });
  },
  async registerEvent(req, res) {
    const { id } = req.params;
    const { studentId } = req.body;
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    event.participants.push(studentId);
    await event.save();
    // Send event reminder email (pseudo-code, replace with actual fetch)
    const { sendEmail } = require('../../utils/email');
    const studentEmail = 'student@example.com';
    await sendEmail(studentEmail, 'Event Reminder', `You are registered for event: ${event.title}`);
    res.json({ message: 'Registered', event });
  },
  async addRecording(req, res) {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    cloudinary.uploader.upload_stream({ resource_type: 'video' }, (error, result) => {
      if (error) return res.status(500).json({ message: 'Upload error', error });
      res.json({ url: result.secure_url });
    }).end(req.file.buffer);
  },
  async upcomingEvents(req, res) {
    const now = new Date();
    const events = await Event.find({ date: { $gte: now } });
    res.json(events);
  }
};

module.exports = eventController;
