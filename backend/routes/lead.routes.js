import express from 'express';
import Lead from '../models/Lead.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ═══════════════════════════════════════════════
//  GET /api/leads/stats — Lead KPIs (Protected)
// ═══════════════════════════════════════════════
router.get('/stats', protect, async (req, res) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(endOfToday.getDate() + 1);

    // 🚨 THE FIX: Admin sees all, Sales sees only their own stats
    const userFilter = req.user.role === 'admin' ? {} : { assignedTo: req.user.id };

    const [total, newCount, contacted, followUp, todayFollowUps] = await Promise.all([
      Lead.countDocuments({ ...userFilter }),
      Lead.countDocuments({ ...userFilter, status: 'New' }),
      Lead.countDocuments({ ...userFilter, status: 'Contacted' }),
      Lead.countDocuments({ ...userFilter, status: 'Follow-up' }),
      Lead.countDocuments({
        ...userFilter,
        followUpDate: { $gte: startOfToday, $lt: endOfToday },
      }),
    ]);

    res.json({
      success: true,
      data: { total, newCount, contacted, followUp, todayFollowUps },
    });
  } catch (error) {
    console.error('Lead stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ═══════════════════════════════════════════════
//  GET /api/leads — Get all leads (Admin/Sales)
// ═══════════════════════════════════════════════
router.get('/', protect, async (req, res) => {
  try {
    const { status, urgency, source, sort } = req.query;

    // 🚨 THE FIX: Admin sees all, Sales sees only their own leads
    const filter = req.user.role === 'admin' ? {} : { assignedTo: req.user.id };

    if (status) filter.status = status;
    if (urgency) filter.urgency = urgency;
    if (source) filter.source = source;

    let sortBy = { createdAt: -1 };
    if (sort === 'urgency') sortBy = { urgency: 1, createdAt: -1 };

    const leads = await Lead.find(filter)
      .sort(sortBy)
      .populate('carOfInterest', 'title make model year price')
      .populate('assignedTo', 'name');

    res.json({ success: true, count: leads.length, data: leads });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ═══════════════════════════════════════════════
//  GET /api/leads/:id — Get a single lead
// ═══════════════════════════════════════════════
router.get('/:id', protect, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('carOfInterest', 'title make model year price');

    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

    // 🚨 SECURITY: Prevent Salesman A from viewing Salesman B's lead if they guess the ID
    if (req.user.role !== 'admin' && lead.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this lead' });
    }

    res.json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ═══════════════════════════════════════════════
//  POST /api/leads — Create new lead
// ═══════════════════════════════════════════════
router.post('/', protect, async (req, res) => {
  try {
    // 🚨 THE FIX: Automatically assign the new lead to the person creating it
    const leadData = {
      ...req.body,
      assignedTo: req.user.id
    };

    const lead = await Lead.create(leadData);
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
    let lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

    // 🚨 SECURITY: Prevent Salesman A from editing Salesman B's lead
    if (req.user.role !== 'admin' && lead.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this lead' });
    }

    lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

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
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

    // 🚨 SECURITY: Prevent Salesman A from deleting Salesman B's lead
    if (req.user.role !== 'admin' && lead.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this lead' });
    }

    await lead.deleteOne();
    res.json({ success: true, message: 'Lead deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;