import express from 'express';
import PromoPoster from '../models/PromoPoster.js';
import { upload } from '../config/cloudinary.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// ── GET /api/promo-posters - Public active banners ──
router.get('/', async (req, res) => {
  try {
    const posters = await PromoPoster.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .limit(10)
      .lean();
    res.json({ success: true, data: posters });
  } catch (error) {
    console.error('Get posters error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── GET /api/promo-posters/all - Admin all banners ──
router.get('/all', protect, admin, async (req, res) => {
  try {
    const posters = await PromoPoster.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();
    res.json({ success: true, data: posters });
  } catch (error) {
    console.error('Get all posters error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── POST /api/promo-posters/admin - Admin create ──
router.post('/admin', protect, admin, upload.fields([
  { name: 'desktopImage', maxCount: 1 },
  { name: 'mobileImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const count = await PromoPoster.countDocuments();
    if (count >= 15) {
      return res.status(400).json({ success: false, message: 'Maximum 15 banners allowed.' });
    }

    if (!req.files || !req.files.desktopImage || !req.files.mobileImage) {
      return res.status(400).json({ success: false, message: 'Both desktop and mobile images are required.' });
    }

    const { title, link, order } = req.body;

    const newPoster = await PromoPoster.create({
      title: title?.trim() || '',
      link: link?.trim() || '',
      order: parseInt(order) || 0,
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

// ── PUT /api/promo-posters/admin/:id - Admin update ──
router.put('/admin/:id', protect, admin, upload.fields([
  { name: 'desktopImage', maxCount: 1 },
  { name: 'mobileImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const poster = await PromoPoster.findById(req.params.id);
    if (!poster) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    if (req.files?.desktopImage?.[0]) {
      poster.desktopImageUrl = req.files.desktopImage[0].path;
    }
    if (req.files?.mobileImage?.[0]) {
      poster.mobileImageUrl = req.files.mobileImage[0].path;
    }

    if (req.body.title !== undefined) poster.title = req.body.title.trim();
    if (req.body.link !== undefined) poster.link = req.body.link.trim();
    if (req.body.isActive !== undefined) poster.isActive = req.body.isActive === true || req.body.isActive === 'true';
    if (req.body.order !== undefined) poster.order = parseInt(req.body.order) || 0;

    await poster.save();

    res.json({ success: true, data: poster });
  } catch (error) {
    console.error('Update poster error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── DELETE /api/promo-posters/admin/:id - Admin delete ──
router.delete('/admin/:id', protect, admin, async (req, res) => {
  try {
    const poster = await PromoPoster.findByIdAndDelete(req.params.id);
    if (!poster) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }
    res.json({ success: true, message: 'Banner successfully deleted.' });
  } catch (error) {
    console.error('Delete poster error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
