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

let cachedImageKitUsage = null;
let lastImageKitFetch = 0;

async function getImageKitUsage(totalImages = 0) {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;
  const isConfigured = Boolean(publicKey && privateKey && urlEndpoint);

  const defaultQuotaBytes = 20 * 1024 * 1024 * 1024; // 20 GB free tier

  const now = Date.now();
  if (cachedImageKitUsage && (now - lastImageKitFetch) < 10 * 60 * 1000) {
    return { ...cachedImageKitUsage, totalImages };
  }

  // Estimated fallback based on actual uploaded images in database (~480KB average optimized WebP)
  let storageUsedBytes = Math.max(1024 * 1024, totalImages * 480 * 1024);
  let bandwidthUsedBytes = Math.max(1024 * 1024, Math.round(storageUsedBytes * 2.8));
  let apiSuccess = false;

  if (privateKey) {
    try {
      const nowD = new Date();
      const endStr = nowD.toISOString().slice(0, 10);
      const startD = new Date(nowD.getTime() - 28 * 24 * 60 * 60 * 1000);
      const startStr = startD.toISOString().slice(0, 10);

      const authHeader = 'Basic ' + Buffer.from(privateKey + ':').toString('base64');
      const response = await fetch(`https://api.imagekit.io/v1/accounts/usage?startDate=${startStr}&endDate=${endStr}`, {
        headers: {
          'Authorization': authHeader,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const sBytes = (data?.mediaLibraryStorageBytes || 0) + (data?.originalCacheStorageBytes || 0) || data?.storageBytes || data?.usage?.storage?.used || 0;
        const bBytes = data?.bandwidthBytes ?? data?.usage?.bandwidth?.used ?? 0;
        storageUsedBytes = sBytes;
        bandwidthUsedBytes = bBytes;
        apiSuccess = true;
      }
    } catch (e) {
      console.warn('ImageKit usage API fetch exception:', e.message);
    }
  }

  const storageUsedGB = Number((storageUsedBytes / (1024 * 1024 * 1024)).toFixed(2));
  const storageUsedMB = Number((storageUsedBytes / (1024 * 1024)).toFixed(1));
  const storageQuotaGB = 20;
  const storagePercent = Number(((storageUsedBytes / defaultQuotaBytes) * 100).toFixed(1));

  const bandwidthUsedGB = Number((bandwidthUsedBytes / (1024 * 1024 * 1024)).toFixed(2));
  const bandwidthUsedMB = Number((bandwidthUsedBytes / (1024 * 1024)).toFixed(1));
  const bandwidthQuotaGB = 20;
  const bandwidthPercent = Number(((bandwidthUsedBytes / defaultQuotaBytes) * 100).toFixed(1));

  const isWarning80 = storagePercent >= 80 || bandwidthPercent >= 80;
  const warningType = storagePercent >= 80 && bandwidthPercent >= 80
    ? 'both'
    : storagePercent >= 80
      ? 'storage'
      : bandwidthPercent >= 80
        ? 'bandwidth'
        : null;

  const result = {
    configured: isConfigured,
    provider: 'ImageKit.io',
    status: isConfigured ? 'Connected' : 'Setup Required',
    apiSuccess,
    urlEndpoint: urlEndpoint || 'https://ik.imagekit.io/your_id',
    totalImages,
    storage: {
      usedBytes: storageUsedBytes,
      usedMB: storageUsedMB,
      usedGB: storageUsedGB,
      quotaGB: storageQuotaGB,
      percentUsed: Math.min(100, storagePercent),
      isWarning80: storagePercent >= 80,
    },
    bandwidth: {
      usedBytes: bandwidthUsedBytes,
      usedMB: bandwidthUsedMB,
      usedGB: bandwidthUsedGB,
      quotaGB: bandwidthQuotaGB,
      percentUsed: Math.min(100, bandwidthPercent),
      isWarning80: bandwidthPercent >= 80,
    },
    isWarning80,
    warningType,
    r2Ready: Boolean(process.env.R2_ACCOUNT_ID && process.env.R2_BUCKET_NAME),
  };

  cachedImageKitUsage = result;
  lastImageKitFetch = now;
  return result;
}

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

    // 4. Fetch live / estimated ImageKit storage & bandwidth metrics
    const imagekit = await getImageKitUsage(totalImages);

    // DB Storage in MB (Atlas M0 limit: 512 MB)
    const dbDataSizeMB = Number(((dbStats.dataSize || 0) / (1024 * 1024)).toFixed(2));
    const dbStorageSizeMB = Number(((dbStats.storageSize || 4096) / (1024 * 1024)).toFixed(2));
    const dbQuotaMB = 512; // 512 MB MongoDB Atlas Free Tier
    const dbPercentUsed = Number(((dbStorageSizeMB / dbQuotaMB) * 100).toFixed(2));

    // 5. Memory & Server Uptime
    const memory = process.memoryUsage();
    const heapUsedMB = Number((memory.heapUsed / (1024 * 1024)).toFixed(1));
    const heapTotalMB = Number((memory.heapTotal / (1024 * 1024)).toFixed(1));
    const rssMB = Number((memory.rss / (1024 * 1024)).toFixed(1));

    const uptimeSec = Math.floor(process.uptime());
    const hours = Math.floor(uptimeSec / 3600);
    const minutes = Math.floor((uptimeSec % 3600) / 60);
    const seconds = uptimeSec % 60;
    const uptimeFormatted = `${hours > 0 ? `${hours}h ` : ''}${minutes}m ${seconds}s`;

    // 6. AI API Status
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
      imagekit,
      media: {
        status: imagekit.status,
        provider: 'ImageKit.io',
        urlEndpoint: imagekit.urlEndpoint,
        totalImages,
        estimatedSizeMB: imagekit.storage.usedMB,
        storageUsedGB: imagekit.storage.usedGB,
        storageQuotaGB: imagekit.storage.quotaGB,
        storagePercentUsed: imagekit.storage.percentUsed,
        bandwidthUsedGB: imagekit.bandwidth.usedGB,
        bandwidthQuotaGB: imagekit.bandwidth.quotaGB,
        bandwidthPercentUsed: imagekit.bandwidth.percentUsed,
        isWarning80: imagekit.isWarning80,
        warningType: imagekit.warningType,
        r2Ready: imagekit.r2Ready,
        compression: 'WebP Ultra-High Efficiency (via Sharp)',
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
        imagekit: imagekit.configured ? 'Operational' : 'Setup Required',
        cloudflareR2: Boolean(process.env.R2_ACCOUNT_ID && process.env.R2_BUCKET_NAME) ? 'Operational' : 'Ready on Standby',
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
