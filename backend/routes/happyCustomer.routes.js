import express from 'express';
import HappyCustomer from '../models/HappyCustomer.js';
import { upload } from '../config/cloudinary.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/happy-customers - Public
router.get('/', async (req, res) => {
  try {
    const records = await HappyCustomer.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: records });
  } catch (error) {
    console.error('Get Happy Customers error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/happy-customers/admin - Admin only
// Uploads 1 photo and saves record
router.post('/admin', protect, admin, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'A photo is required.' });
    }

    const { customerName, reviewText } = req.body;
    
    if (!customerName) {
         return res.status(400).json({ success: false, message: 'Customer name is required.' });
    }

    const newCustomer = await HappyCustomer.create({
      photo: req.file.path,
      customerName,
      reviewText: reviewText || '',
    });

    res.status(201).json({ success: true, data: newCustomer });
  } catch (error) {
    console.error('Create Happy Customer error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/happy-customers/admin/:id - Admin only
router.delete('/admin/:id', protect, admin, async (req, res) => {
  try {
    const record = await HappyCustomer.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Customer record not found' });
    }
    res.json({ success: true, message: 'Record successfully deleted.' });
  } catch (error) {
    console.error('Delete Happy Customer error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
