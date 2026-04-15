import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import Message from '../models/Message.js';

const router = express.Router();

// @route   POST /api/messages
// @desc    Create a new message (Public)
// @access  Public
router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone, message, type } = req.body;
    
    // Basic validation
    if (!name || (!phone && !email) || !message) {
      return res.status(400).json({ success: false, message: 'Name, contact info, and message are required' });
    }

    const newMessage = await Message.create({ name, email, phone, message, type });
    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/messages
// @desc    Get all messages
// @access  Private/Admin
router.get('/', protect, admin, async (req, res, next) => {
  try {
    const messages = await Message.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/messages/:id/read
// @desc    Mark message as read
// @access  Private/Admin
router.put('/:id/read', protect, admin, async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    message.status = 'Read';
    const updatedMessage = await message.save();

    res.status(200).json({ success: true, data: updatedMessage });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/messages/:id
// @desc    Delete message
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    await message.deleteOne();
    res.status(200).json({ success: true, message: 'Message removed' });
  } catch (error) {
    next(error);
  }
});

export default router;
