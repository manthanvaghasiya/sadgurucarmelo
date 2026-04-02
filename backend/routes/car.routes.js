import express from 'express';
import Car from '../models/Car.js';

const router = express.Router();

// ═══════════════════════════════════════════════
//  GET /api/cars — Get all cars (Public)
// ═══════════════════════════════════════════════
router.get('/', async (req, res) => {
  try {
    const { status, fuelType, transmission, sort, limit } = req.query;

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (fuelType) filter.fuelType = fuelType;
    if (transmission) filter.transmission = transmission;

    // Build sort
    let sortBy = { createdAt: -1 }; // newest first
    if (sort === 'price-low') sortBy = { price: 1 };
    if (sort === 'price-high') sortBy = { price: -1 };
    if (sort === 'km-low') sortBy = { kms: 1 };

    const cars = await Car.find(filter)
      .sort(sortBy)
      .limit(parseInt(limit) || 50);

    res.json({
      success: true,
      count: cars.length,
      data: cars,
    });
  } catch (error) {
    console.error('Get cars error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ═══════════════════════════════════════════════
//  GET /api/cars/:id — Get single car
// ═══════════════════════════════════════════════
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
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
router.post('/', async (req, res) => {
  try {
    const car = await Car.create(req.body);
    res.status(201).json({ success: true, data: car });
  } catch (error) {
    console.error('Create car error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// ═══════════════════════════════════════════════
//  PUT /api/cars/:id — Update car (Admin)
// ═══════════════════════════════════════════════
router.put('/:id', async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }
    res.json({ success: true, data: car });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ═══════════════════════════════════════════════
//  DELETE /api/cars/:id — Delete car (Admin)
// ═══════════════════════════════════════════════
router.delete('/:id', async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }
    res.json({ success: true, message: 'Car deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
