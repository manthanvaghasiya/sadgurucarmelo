import express from 'express';
import PromoPoster from '../models/PromoPoster.js';
import { upload } from '../config/cloudinary.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/promo-posters - Public
router.get('/', async (req, res) => {
  try {
    const posters = await PromoPoster.find({ isActive: true }).limit(10).sort({ createdAt: -1 });
    res.json({ success: true, data: posters });
  } catch (error) {
    console.error('Get posters error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/promo-posters/admin - Admin only
// Uploads 1 pair (desktop and mobile)
router.post('/admin', protect, admin, upload.fields([
  { name: 'desktopImage', maxCount: 1 },
  { name: 'mobileImage', maxCount: 1 }
]), async (req, res) => {
  try {
    // Check limit first
    const count = await PromoPoster.countDocuments();
    if (count >= 10) {
      return res.status(400).json({ success: false, message: 'Maximum 10 poster pairs allowed.' });
    }

    if (!req.files || !req.files.desktopImage || !req.files.mobileImage) {
      return res.status(400).json({ success: false, message: 'Both desktop and mobile images are required.' });
    }

    const newPoster = await PromoPoster.create({
      desktopImageUrl: req.files.desktopImage[0].path,
      mobileImageUrl: req.files.mobileImage[0].path,
      isActive: true,
    });

    res.status(201).json({ success: true, data: newPoster });
  } catch (error) {
    console.error('Create poster error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/promo-posters/admin/:id - Admin only
router.delete('/admin/:id', protect, admin, async (req, res) => {
  try {
    const poster = await PromoPoster.findByIdAndDelete(req.params.id);
    if (!poster) {
      return res.status(404).json({ success: false, message: 'Poster not found' });
    }
    res.json({ success: true, message: 'Poster successfully deleted.' });
  } catch (error) {
    console.error('Delete poster error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
