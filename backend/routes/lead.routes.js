import express from 'express';
import Lead from '../models/Lead.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ═══════════════════════════════════════════════
//  GET /api/leads — Get all leads (Admin/Sales)
// ═══════════════════════════════════════════════
router.get('/', protect, async (req, res) => {
  try {
    const { status, urgency, source, sort } = req.query;

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (urgency) filter.urgency = urgency;
    if (source) filter.source = source;

    // Build sort
    let sortBy = { createdAt: -1 };
    if (sort === 'urgency') sortBy = { urgency: 1, createdAt: -1 };

    const leads = await Lead.find(filter)
      .sort(sortBy)
      .populate('carOfInterest', 'title make model year price')
      .populate('assignedTo', 'name employeeId');

    res.json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ═══════════════════════════════════════════════
//  POST /api/leads — Create new lead
// ═══════════════════════════════════════════════
router.post('/', protect, async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json({ success: true, data: lead });
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// ═══════════════════════════════════════════════
//  PUT /api/leads/:id — Update lead status/notes
// ═══════════════════════════════════════════════
router.put('/:id', protect, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.json({ success: true, data: lead });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ═══════════════════════════════════════════════
//  DELETE /api/leads/:id — Delete lead
// ═══════════════════════════════════════════════
router.delete('/:id', protect, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    res.json({ success: true, message: 'Lead deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
