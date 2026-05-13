import express from 'express';
import NodeCache from 'node-cache';
import Car from '../models/Car.js';
import { upload } from '../config/cloudinary.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// ── Shared In-Memory Cache ──
// 60 seconds TTL for traffic spikes: 1 DB hit per minute, serving 999 hits from RAM
const carCache = new NodeCache({ stdTTL: 60 });

// ── Cache Interceptor Middleware ──
// Synthesizes a unique memory key based on exact query params and paths
const checkCache = (req, res, next) => {
  const key = req.originalUrl;
  const cachedData = carCache.get(key);
  
  if (cachedData) {
    console.log(`⚡ API CACHE HIT: ${key}`);
    return res.json(cachedData); // Instantly reply without Mongoose
  }
  
  // Hijack res.json to automatically capture and cache the MongoDB payload
  const originalJson = res.json;
  res.json = (body) => {
    if (body && body.success !== false) {
      carCache.set(key, body);
    }
    originalJson.call(res, body);
  };
  next();
};

// ═══════════════════════════════════════════════
//  GET /api/cars — Get all cars (Public) with filtering + pagination
// ═══════════════════════════════════════════════
router.get('/', checkCache, async (req, res) => {
  try {
    const {
      status, fuelType, transmission, sort, limit,
      make, model, bodyType, year, owner,
      priceMin, priceMax, kmsMax,
      page = 1,
      search,
      isFeaturedOnHome,
    } = req.query;

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (isFeaturedOnHome) filter.isFeaturedOnHome = isFeaturedOnHome === 'true';
    if (fuelType) filter.fuelType = fuelType;
    if (transmission) filter.transmission = transmission;
    if (make) filter.make = { $regex: make, $options: 'i' };
    if (model) filter.model = { $regex: new RegExp(`^${model}$`, 'i') };
    if (bodyType) filter.bodyType = { $regex: bodyType, $options: 'i' };
    if (year) filter.year = parseInt(year);
    if (owner) filter.owner = owner;

    // Price range
    if (priceMin || priceMax) {
      filter.price = {};
      if (priceMin) filter.price.$gte = parseInt(priceMin);
      if (priceMax) filter.price.$lte = parseInt(priceMax);
    }

    // KMs max
    if (kmsMax) {
      filter.kms = { $lte: parseInt(kmsMax) };
    }

    // Full-text search across make, model, title
    if (search) {
      filter.$or = [
        { make: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort
    let sortBy = { createdAt: -1 }; // newest first
    if (sort === 'price-low') sortBy = { price: 1 };
    if (sort === 'price-high') sortBy = { price: -1 };
    if (sort === 'km-low') sortBy = { kms: 1 };
    if (sort === 'year-new') sortBy = { year: -1 };

    const pageNum = parseInt(page) || 1;
    const perPage = parseInt(limit) || 12;
    const skip = (pageNum - 1) * perPage;

    const [cars, total] = await Promise.all([
      Car.find(filter).sort(sortBy).skip(skip).limit(perPage).lean(),
      Car.countDocuments(filter),
    ]);

    res.json({
      success: true,
      count: cars.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / perPage),
      data: cars,
    });
  } catch (error) {
    console.error('Get cars error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ═══════════════════════════════════════════════
//  GET /api/cars/stats — Dashboard stats (Admin)
// ═══════════════════════════════════════════════
router.get('/stats', protect, admin, checkCache, async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalCars, availableCars, soldThisMonth, totalValue] = await Promise.all([
      Car.countDocuments(),
      Car.countDocuments({ status: 'Available' }),
      Car.countDocuments({ status: 'Sold', updatedAt: { $gte: startOfMonth } }),
      Car.aggregate([
        { $match: { status: 'Available' } },
        { $group: { _id: null, total: { $sum: '$price' } } },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        totalCars,
        availableCars,
        soldThisMonth,
        totalValue: totalValue[0]?.total || 0,
      },
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ═══════════════════════════════════════════════
//  GET /api/cars/filters — Get unique filter values (Public)
// ═══════════════════════════════════════════════
router.get('/filters', checkCache, async (req, res) => {
  try {
    const [makes, bodyTypes, years, brandModelMap] = await Promise.all([
      Car.distinct('make', { status: { $ne: 'Sold' } }),
      Car.distinct('bodyType', { status: { $ne: 'Sold' } }),
      Car.distinct('year', { status: { $ne: 'Sold' } }),
      Car.aggregate([
        { $match: { status: { $ne: 'Sold' } } },
        { $group: { _id: "$make", models: { $addToSet: "$model" } } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        makes: makes.filter(Boolean).sort(),
        bodyTypes: bodyTypes.filter(Boolean).sort(),
        years: years.sort((a, b) => b - a),
        brandModelMap: brandModelMap,
        fuelTypes: ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'],
        transmissions: ['Manual', 'Automatic'],
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ═══════════════════════════════════════════════
//  GET /api/cars/:id — Get single car
// ═══════════════════════════════════════════════
router.get('/:id', checkCache, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).lean();
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }
    res.json({ success: true, data: car });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ═══════════════════════════════════════════════
//  POST /api/cars — Add new car (Admin)
// ═══════════════════════════════════════════════
router.post('/', protect, admin, upload.array('images', 10), async (req, res) => {
  try {
    const carData = { ...req.body };
    
    if (typeof carData.features === 'string') {
      carData.features = carData.features.split(',').map(f => f.trim()).filter(Boolean);
    }

    if (typeof carData.spinImages === 'string') {
      carData.spinImages = carData.spinImages.split(',').map(u => u.trim()).filter(Boolean);
    }
    
    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map(file => file.path);
      
      const mainIndex = parseInt(req.body.mainPhotoIndex, 10) || 0;
      if (imageUrls[mainIndex]) {
          const mainUrl = imageUrls[mainIndex];
          imageUrls.splice(mainIndex, 1);
          imageUrls.unshift(mainUrl);
      }

      carData.images = imageUrls;
      carData.image = imageUrls[0];
    } else {
      carData.image = 'https://placehold.co/600x400/e2e8f0/64748b?text=' + encodeURIComponent(`${carData.make || 'Car'} ${carData.model || ''}`);
      carData.images = [carData.image];
    }

    const car = await Car.create(carData);
    
    // Auto-Invalidate global Cache so public site updates instantly!
    carCache.flushAll();
    
    res.status(201).json({ success: true, data: car });
  } catch (error) {
    console.error('Create car error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// ═══════════════════════════════════════════════
//  PUT /api/cars/:id — Update car (Admin)
// ═══════════════════════════════════════════════
router.put('/:id', protect, admin, upload.array('images', 10), async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    if (typeof updateData.features === 'string') {
      updateData.features = updateData.features.split(',').map(f => f.trim()).filter(Boolean);
    }

    if (typeof updateData.spinImages === 'string') {
      updateData.spinImages = updateData.spinImages.split(',').map(u => u.trim()).filter(Boolean);
    }

    let finalImages = [];
    if (req.body.keptImages) {
        if (Array.isArray(req.body.keptImages)) {
            finalImages = req.body.keptImages;
        } else {
            finalImages = [req.body.keptImages];
        }
    }

    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map(file => file.path);
      
      const mainType = req.body.mainPhotoType || 'existing';
      const mainIndex = parseInt(req.body.mainPhotoIndex, 10) || 0;

      let mainUrl = null;
      if (mainType === 'new' && imageUrls[mainIndex]) {
          mainUrl = imageUrls[mainIndex];
          imageUrls.splice(mainIndex, 1);
      } else if (mainType === 'existing' && finalImages[mainIndex]) {
          mainUrl = finalImages[mainIndex];
          finalImages.splice(mainIndex, 1);
      }

      finalImages = [...finalImages, ...imageUrls];
      if (mainUrl) {
          finalImages.unshift(mainUrl);
      }
    } else {
      const mainType = req.body.mainPhotoType || 'existing';
      const mainIndex = parseInt(req.body.mainPhotoIndex, 10) || 0;
      if (mainType === 'existing' && finalImages[mainIndex]) {
          const mainUrl = finalImages[mainIndex];
          finalImages.splice(mainIndex, 1);
          finalImages.unshift(mainUrl);
      }
    }

    // Only update images if we have any final images
    // If empty, we don't wipe it out entirely unless specifically told to, but since they can delete all, we should apply it.
    updateData.images = finalImages;
    if (finalImages.length > 0) {
      updateData.image = finalImages[0];
    } else {
      updateData.image = '';
    }

    const car = await Car.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }
    
    carCache.flushAll(); // Delete stale cache records
    
    res.json({ success: true, data: car });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ═══════════════════════════════════════════════
//  DELETE /api/cars/:id — Delete car (Admin)
// ═══════════════════════════════════════════════
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }
    
    carCache.flushAll();
    
    res.json({ success: true, message: 'Vehicle successfully deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ═══════════════════════════════════════════════
//  PATCH /api/cars/:id/toggle-featured — Toggle Home Page status (Admin)
// ═══════════════════════════════════════════════
router.patch('/:id/toggle-featured', protect, admin, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }
    car.isFeaturedOnHome = !car.isFeaturedOnHome;
    await car.save();
    
    carCache.flushAll();
    
    res.json({ success: true, data: car });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
