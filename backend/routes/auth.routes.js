import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// ── Helper: Generate JWT ──
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// ═══════════════════════════════════════════════
//  POST /api/auth/login — Login (Admin + Sales)
// ═══════════════════════════════════════════════
router.post('/login', async (req, res) => {
  try {
    const { employeeId, password } = req.body;

    if (!employeeId || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Employee ID and password',
      });
    }

    // Find user and explicitly select the password field
    const user = await User.findOne({ employeeId: employeeId.toUpperCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account suspended. Contact the admin.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        employeeId: user.employeeId,
        role: user.role,
        token: generateToken(user._id, user.role),
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ═══════════════════════════════════════════════
//  POST /api/auth/register — Create Staff Account (Admin only)
// ═══════════════════════════════════════════════
router.post('/register', protect, admin, async (req, res) => {
  try {
    const { name, employeeId, password, phone, email, role } = req.body;

    // Check if employee ID already exists
    const exists = await User.findOne({ employeeId: employeeId.toUpperCase() });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID already exists',
      });
    }

    const user = await User.create({
      name,
      employeeId: employeeId.toUpperCase(),
      password,
      phone,
      email,
      role: role || 'sales',
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        employeeId: user.employeeId,
        role: user.role,
        phone: user.phone,
        email: user.email,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Employee ID already exists' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// ═══════════════════════════════════════════════
//  GET /api/auth/me — Get current user profile
// ═══════════════════════════════════════════════
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        employeeId: user.employeeId,
        role: user.role,
        phone: user.phone,
        email: user.email,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ═══════════════════════════════════════════════
//  GET /api/auth/users — Get all staff (Admin only)
// ═══════════════════════════════════════════════
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ═══════════════════════════════════════════════
//  PUT /api/auth/users/:id — Update staff (Admin only)
// ═══════════════════════════════════════════════
router.put('/users/:id', protect, admin, async (req, res) => {
  try {
    const { isActive, role, password } = req.body;
    const user = await User.findById(req.params.id).select('+password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (isActive !== undefined) user.isActive = isActive;
    if (role) user.role = role;
    if (password) user.password = password;

    await user.save();

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        employeeId: user.employeeId,
        role: user.role,
        isActive: user.isActive,
        phone: user.phone,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ═══════════════════════════════════════════════
//  DELETE /api/auth/users/:id — Delete staff (Admin only)
// ═══════════════════════════════════════════════
router.delete('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, message: 'Staff account removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
