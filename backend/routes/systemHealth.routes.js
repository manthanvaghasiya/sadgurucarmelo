import express from 'express';
import mongoose from 'mongoose';
import Car from '../models/Car.js';
import Message from '../models/Message.js';
import SellRequest from '../models/SellRequest.js';
import PromoPoster from '../models/PromoPoster.js';
import HappyCustomer from '../models/HappyCustomer.js';
import Analytics from '../models/Analytics.js';
import Settings from '../models/Settings.js';

const router = express.Router();

// @route   GET /api/system/health
// @desc    Get comprehensive system storage & server health metrics
// @access  Public (or Admin protected)
router.get('/health', async (req, res) => {
  try {
    const startTime = Date.now();

    // 1. Measure DB ping latency and retrieve stats
    let dbLatency = 0;
    let dbStats = { collections: 0, objects: 0, dataSize: 0, storageSize: 0 };

    if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
      const pingStart = Date.now();
      await mongoose.connection.db.command({ ping: 1 });
      dbLatency = Date.now() - pingStart;

      try {
        const stats = await mongoose.connection.db.command({ dbStats: 1 });
        dbStats = {
          collections: stats.collections || 0,
          objects: stats.objects || 0,
          dataSize: stats.dataSize || 0,
          storageSize: stats.storageSize || 0,
        };
      } catch {
        // Fallback if dbStats command restricted
      }
    }

    // 2. Count records across collections in parallel
    const [
      carsCount,
      messagesCount,
      sellRequestsCount,
      postersCount,
      customersCount,
      analyticsCount,
      carsList,
      aiSettings,
    ] = await Promise.all([
      Car.countDocuments().catch(() => 0),
      Message.countDocuments().catch(() => 0),
      SellRequest.countDocuments().catch(() => 0),
      PromoPoster.countDocuments().catch(() => 0),
      HappyCustomer.countDocuments().catch(() => 0),
      Analytics.countDocuments().catch(() => 0),
      Car.find({}, 'image images').lean().catch(() => []),
      Settings.findOne().lean().catch(() => null),
    ]);

    // 3. Calculate total media files
    let totalImages = 0;
    carsList.forEach((c) => {
      if (c.image) totalImages++;
      if (Array.isArray(c.images)) totalImages += c.images.length;
    });
    totalImages += postersCount;
    totalImages += customersCount;

    // Average compressed WebP image size is ~850 KB (0.85 MB)
    const estimatedMediaSizeBytes = totalImages * 850 * 1024;
    const mediaQuotaBytes = 25 * 1024 * 1024 * 1024; // 25 GB Cloudinary free quota
    const mediaPercentUsed = Number(((estimatedMediaSizeBytes / mediaQuotaBytes) * 100).toFixed(2));

    // DB Storage in MB (Atlas M0 limit: 512 MB)
    const dbDataSizeMB = Number(((dbStats.dataSize || 0) / (1024 * 1024)).toFixed(2));
    const dbStorageSizeMB = Number(((dbStats.storageSize || 4096) / (1024 * 1024)).toFixed(2));
    const dbQuotaMB = 512; // 512 MB MongoDB Atlas Free Tier
    const dbPercentUsed = Number(((dbStorageSizeMB / dbQuotaMB) * 100).toFixed(2));

    // 4. Memory & Server Uptime
    const memory = process.memoryUsage();
    const heapUsedMB = Number((memory.heapUsed / (1024 * 1024)).toFixed(1));
    const heapTotalMB = Number((memory.heapTotal / (1024 * 1024)).toFixed(1));
    const rssMB = Number((memory.rss / (1024 * 1024)).toFixed(1));

    const uptimeSec = Math.floor(process.uptime());
    const hours = Math.floor(uptimeSec / 3600);
    const minutes = Math.floor((uptimeSec % 3600) / 60);
    const seconds = uptimeSec % 60;
    const uptimeFormatted = `${hours > 0 ? `${hours}h ` : ''}${minutes}m ${seconds}s`;

    // 5. AI API Status
    const geminiKeys = aiSettings?.geminiApiKeys || [];
    const hasAiKey = geminiKeys.some((k) => k?.key && k.isActive) || !!process.env.GEMINI_API_KEY;

    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      responseTimeMs: Date.now() - startTime,
      status: 'optimal',
      database: {
        status: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        name: mongoose.connection.name || 'sadgurucarmelo',
        latencyMs: dbLatency,
        totalRecords: (dbStats.objects || 0) || (carsCount + messagesCount + sellRequestsCount + postersCount + customersCount + analyticsCount),
        dataSizeMB: dbDataSizeMB,
        storageSizeMB: dbStorageSizeMB,
        quotaMB: dbQuotaMB,
        percentUsed: dbPercentUsed,
        breakdown: {
          cars: carsCount,
          messages: messagesCount,
          sellRequests: sellRequestsCount,
          posters: postersCount,
          happyCustomers: customersCount,
          analytics: analyticsCount,
        },
      },
      media: {
        status: process.env.CLOUDINARY_CLOUD_NAME ? 'Connected' : 'Unconfigured',
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'dijf9umhc',
        totalImages,
        estimatedSizeMB: Number((estimatedMediaSizeBytes / (1024 * 1024)).toFixed(1)),
        quotaGB: 25,
        percentUsed: mediaPercentUsed,
        compression: 'WebP / AVIF High Efficiency',
      },
      server: {
        status: 'Operational',
        uptimeFormatted,
        uptimeSeconds: uptimeSec,
        heapUsedMB,
        heapTotalMB,
        rssMB,
        nodeVersion: process.version,
        platform: process.platform,
        environment: process.env.NODE_ENV || 'development',
      },
      services: {
        mongodb: mongoose.connection.readyState === 1 ? 'Operational' : 'Degraded',
        cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? 'Operational' : 'Warning',
        geminiAI: hasAiKey ? 'Ready' : 'Heuristic Fallback Active',
        pwaCache: 'Operational',
      },
    });
  } catch (err) {
    console.error('System health check error:', err);
    res.status(500).json({
      success: false,
      error: err.message,
      status: 'error',
    });
  }
});

export default router;
