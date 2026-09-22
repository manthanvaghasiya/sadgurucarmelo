import express from 'express';
import SellRequest from '../models/SellRequest.js';
import { upload } from '../config/cloudinary.js';
import { v2 as cloudinary } from 'cloudinary';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// ── POST /api/sell-requests — Public submission with up to 10 photos ──
router.post('/', upload.array('photos', 10), async (req, res) => {
  try {
    const {
      ownerName,
      phone,
      email,
      carBrand,
      carModel,
      year,
      kmDriven,
      fuelType,
      transmission,
      expectedPrice,
      notes,
    } = req.body;

    if (!ownerName || !phone || !carBrand || !carModel) {
      return res.status(400).json({
        success: false,
        message: 'Owner name, phone number, car brand, and car model are required.',
      });
    }

    // Process uploaded photos from Multer/Cloudinary
    let photos = [];
    if (req.files && req.files.length > 0) {
      photos = req.files.map((file) => ({
        url: file.path,
        publicId: file.filename,
      }));
    }

    const sellRequest = await SellRequest.create({
      ownerName: ownerName.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : undefined,
      carBrand: carBrand.trim(),
      carModel: carModel.trim(),
      year: year ? Number(year) : undefined,
      kmDriven: kmDriven ? Number(kmDriven) : undefined,
      fuelType: fuelType || 'Petrol',
      transmission: transmission || 'Manual',
      expectedPrice: expectedPrice ? Number(expectedPrice) : undefined,
      notes: notes ? notes.trim() : undefined,
      photos,
      status: 'Pending',
    });

    res.status(201).json({
      success: true,
      message: 'Your car selling request has been submitted successfully! Our team will contact you shortly.',
      data: sellRequest,
    });
  } catch (error) {
    console.error('Error submitting sell request:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit sell request.',
    });
  }
});

// ── GET /api/sell-requests — Admin: List all sell requests ──
router.get('/', protect, admin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    const filter = {};

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { ownerName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { carBrand: { $regex: search, $options: 'i' } },
        { carModel: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [requests, total, pendingCount] = await Promise.all([
      SellRequest.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      SellRequest.countDocuments(filter),
      SellRequest.countDocuments({ status: 'Pending' }),
    ]);

    res.json({
      success: true,
      data: requests,
      total,
      pendingCount,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error('Error fetching sell requests:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch sell requests.',
    });
  }
});

// ── PATCH /api/sell-requests/:id/status — Admin: Update status ──
router.patch('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Reviewed', 'Contacted', 'Closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value.',
      });
    }

    const updated = await SellRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Sell request not found.',
      });
    }

    res.json({
      success: true,
      message: 'Status updated successfully.',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating sell request status:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update status.',
    });
  }
});

// ── DELETE /api/sell-requests/:id — Admin: Delete request & cleanup Cloudinary photos ──
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const request = await SellRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Sell request not found.',
      });
    }

    // Delete photos from Cloudinary
    if (request.photos && request.photos.length > 0) {
      for (const photo of request.photos) {
        if (photo.publicId) {
          try {
            await cloudinary.uploader.destroy(photo.publicId);
          } catch (delErr) {
            console.warn('Failed to delete Cloudinary photo:', photo.publicId, delErr);
          }
        }
      }
    }

    await SellRequest.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Sell request and photos deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting sell request:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete sell request.',
    });
  }
});

export default router;
