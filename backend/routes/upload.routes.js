import express from 'express';
import multer from 'multer';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  uploadMedia,
  uploadToImageKit,
  isImageKitConfigured,
  isR2Configured,
} from '../config/storage.js';

const router = express.Router();

// Configure Multer for memory buffering
const uploadMem = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 32 * 1024 * 1024, // 32MB max per image
  },
  fileFilter: (_req, file, cb) => {
    const isHeic = /\.(heic|heif)$/i.test(file.originalname);
    const allowed = [
      'image/jpeg', 'image/jpg', 'image/png',
      'image/webp', 'image/avif', 'image/gif',
      'image/heic', 'image/heif'
    ];
    if (allowed.includes(file.mimetype) || isHeic) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, GIF, WebP, AVIF, and HEIC images are allowed'));
    }
  },
});

/**
 * @route   POST /api/upload/imagekit
 * @desc    Compress with Sharp (WebP, auto-rotate, 1920px max) and upload directly to ImageKit (or active storage)
 * @access  Private (Admin / Manager)
 */
router.post('/imagekit', protect, admin, uploadMem.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }

    let result;
    if (isImageKitConfigured) {
      result = await uploadToImageKit(req.file.buffer, req.file.originalname, '/inventory');
    } else {
      // Fallback to active cloud storage (R2 or Cloudinary)
      result = await uploadMedia(req.file.buffer, req.file.originalname, 'inventory');
    }

    res.json({
      success: true,
      url: result.url,
      publicId: result.key || result.filename,
      thumbnail_url: result.thumbnail_url || result.url,
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Image upload and optimization failed',
    });
  }
});

/**
 * @route   POST /api/upload
 * @desc    General media upload route with Sharp optimization
 * @access  Private (Admin / Manager)
 */
router.post('/', protect, admin, uploadMem.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }

    const result = await uploadMedia(req.file.buffer, req.file.originalname, 'inventory');

    res.json({
      success: true,
      url: result.url,
      publicId: result.key || result.filename,
      thumbnail_url: result.thumbnail_url || result.url,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Image upload failed',
    });
  }
});

export default router;
