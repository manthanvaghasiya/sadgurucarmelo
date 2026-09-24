import express from 'express';
import mongoose from 'mongoose';
import Analytics from '../models/Analytics.js';

const router = express.Router();

// Helper to get today's date normalized to IST (Asia/Kolkata)
const getTodayIST = () => {
  const now = new Date();
  const istString = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(now);
  return new Date(istString + 'T00:00:00.000Z');
};

// @route   GET /api/analytics/app-installs/total
// @desc    Get real total app installs across all time
// @access  Public
router.get('/app-installs/total', async (req, res) => {
  try {
    const result = await Analytics.aggregate([
      { $group: { _id: null, totalInstalls: { $sum: '$appInstalls' } } },
    ]);
    const total = result.length > 0 ? result[0].totalInstalls : 0;
    res.status(200).json({ success: true, total });
  } catch (err) {
    console.error('Failed to get app installs total:', err);
    res.status(200).json({ success: true, total: 0 });
  }
});

// @route   POST /api/analytics/app-install
// @desc    Track real PWA app installation
// @access  Public
router.post('/app-install', async (req, res) => {
  try {
    const today = getTodayIST();

    await Analytics.findOneAndUpdate(
      { date: today },
      { $inc: { appInstalls: 1 } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('App install tracking error:', err);
    res.status(500).json({ error: err.message });
  }
});

// @route   POST /api/analytics/track
// @desc    Track real page views and unique visitors
// @access  Public
router.post('/track', async (req, res) => {
  try {
    const today = getTodayIST();

    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip || '127.0.0.1';
    const ip = typeof rawIp === 'string' ? rawIp.split(',')[0].trim() : '127.0.0.1';
    const visitorId = req.body?.visitorId ? String(req.body.visitorId).trim() : null;

    // Atomically increment pageViews and ensure document exists
    const doc = await Analytics.findOneAndUpdate(
      { date: today },
      { $inc: { pageViews: 1 } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Check if this visitor is unique for today
    let isNewVisitor = false;
    const updateOps = {};

    if (visitorId && (!doc.visitorIds || !doc.visitorIds.includes(visitorId))) {
      updateOps.$addToSet = { ...(updateOps.$addToSet || {}), visitorIds: visitorId };
      isNewVisitor = true;
    }

    if (ip && (!doc.ips || !doc.ips.includes(ip))) {
      updateOps.$addToSet = { ...(updateOps.$addToSet || {}), ips: ip };
      if (!visitorId) {
        isNewVisitor = true;
      }
    }

    if (isNewVisitor) {
      updateOps.$inc = { visitors: 1 };
      await Analytics.updateOne({ date: today }, updateOps);
    } else if (updateOps.$addToSet) {
      await Analytics.updateOne({ date: today }, updateOps);
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Analytics tracking error:', err);
    res.status(500).json({ error: err.message });
  }
});

// @route   GET /api/analytics/summary
// @desc    Get real traffic summary & growth comparison for the last N days
// @access  Public
router.get('/summary', async (req, res) => {
  try {
    const limitDays = parseInt(req.query.days) || 30;
    const today = getTodayIST();

    // Current period range
    const currentStartDate = new Date(today);
    currentStartDate.setDate(currentStartDate.getDate() - (limitDays - 1));

    // Previous period range for growth calculation
    const prevStartDate = new Date(currentStartDate);
    prevStartDate.setDate(prevStartDate.getDate() - limitDays);

    const prevEndDate = new Date(currentStartDate);
    prevEndDate.setDate(prevEndDate.getDate() - 1);
    prevEndDate.setUTCHours(23, 59, 59, 999);

    const [currentData, prevData] = await Promise.all([
      Analytics.find({ date: { $gte: currentStartDate, $lte: today } }).sort({ date: 1 }),
      Analytics.find({ date: { $gte: prevStartDate, $lte: prevEndDate } }),
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const timeline = [];

    let totalPageViews = 0;
    let totalVisitors = 0;
    let peakViews = 0;
    let peakDate = '';

    for (let i = limitDays - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);

      const record = currentData.find((r) => r.date.getTime() === d.getTime());
      const views = record ? record.pageViews : 0;
      const vists = record ? record.visitors : 0;
      const formattedDate = `${d.getDate()} ${monthNames[d.getMonth()]}`;

      totalPageViews += views;
      totalVisitors += vists;

      if (views > peakViews) {
        peakViews = views;
        peakDate = formattedDate;
      }

      timeline.push({
        name: formattedDate,
        date: d.toISOString().split('T')[0],
        pageViews: views,
        visitors: vists,
        fullDate: d,
      });
    }

    const prevTotalPageViews = prevData.reduce((acc, cur) => acc + (cur.pageViews || 0), 0);
    const prevTotalVisitors = prevData.reduce((acc, cur) => acc + (cur.visitors || 0), 0);

    const pageViewsGrowth = prevTotalPageViews > 0
      ? Number((((totalPageViews - prevTotalPageViews) / prevTotalPageViews) * 100).toFixed(1))
      : (totalPageViews > 0 ? 100 : 0);

    const visitorsGrowth = prevTotalVisitors > 0
      ? Number((((totalVisitors - prevTotalVisitors) / prevTotalVisitors) * 100).toFixed(1))
      : (totalVisitors > 0 ? 100 : 0);

    const dailyAverage = limitDays > 0 ? Math.round(totalPageViews / limitDays) : 0;

    res.status(200).json({
      success: true,
      timeline,
      summary: {
        totalPageViews,
        totalVisitors,
        prevTotalPageViews,
        prevTotalVisitors,
        pageViewsGrowth,
        visitorsGrowth,
        dailyAverage,
        peakViews,
        peakDate: peakDate || `${timeline[timeline.length - 1]?.name || ''}`,
      },
    });
  } catch (err) {
    console.error('Analytics summary error:', err);
    res.status(500).json({ error: err.message });
  }
});

// @route   GET /api/analytics/storage
// @desc    Get MongoDB and ImageKit storage & bandwidth stats
// @access  Public
router.get('/storage', async (req, res) => {
  try {
    // MongoDB Stats
    const db = mongoose.connection.db;
    const dbStats = await db.stats();
    const mongoUsedMB = (dbStats.storageSize || 0) / (1024 * 1024);
    const mongoTotalMB = 512;
    const mongoPercentage = (mongoUsedMB / mongoTotalMB) * 100;

    // ImageKit Stats
    let ikUsedGB = 0;
    let ikBandwidthGB = 0;
    
    if (process.env.IMAGEKIT_PRIVATE_KEY) {
      try {
        const axios = (await import('axios')).default;
        
        // ImageKit requires date range for usage API (last 30 days)
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 30);
        
        const startStr = startDate.toISOString().split('T')[0];
        const endStr = endDate.toISOString().split('T')[0];
        
        const ikAuth = Buffer.from(process.env.IMAGEKIT_PRIVATE_KEY + ':').toString('base64');
        const ikRes = await axios.get(`https://api.imagekit.io/v1/accounts/usage?startDate=${startStr}&endDate=${endStr}`, {
          headers: {
            'Authorization': `Basic ${ikAuth}`,
            'Accept': 'application/json'
          }
        });
        
        if (ikRes.status === 200 && ikRes.data) {
          const ikData = ikRes.data;
          ikUsedGB = (ikData.mediaLibraryStorageBytes || 0) / (1024 * 1024 * 1024);
          ikBandwidthGB = (ikData.bandwidthBytes || 0) / (1024 * 1024 * 1024);
        }
      } catch (ikErr) {
        console.error('Failed to fetch ImageKit stats via axios:', ikErr.message);
      }
    }

    res.status(200).json({
      success: true,
      mongodb: {
        usedMB: parseFloat(mongoUsedMB.toFixed(2)),
        totalMB: mongoTotalMB,
        percentage: parseFloat(mongoPercentage.toFixed(2))
      },
      imagekit: {
        usedGB: parseFloat(ikUsedGB.toFixed(4)),
        bandwidthGB: parseFloat(ikBandwidthGB.toFixed(4)),
        totalGB: 3,
        bandwidthTotalGB: 20
      },
      cloudinary: {
        usedGB: parseFloat(ikUsedGB.toFixed(4)),
        bandwidthGB: parseFloat(ikBandwidthGB.toFixed(4)),
        totalGB: 3,
        bandwidthTotalGB: 20
      }
    });
  } catch (err) {
    console.error('Storage stats error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
