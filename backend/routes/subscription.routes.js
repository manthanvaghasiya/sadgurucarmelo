import express from 'express';
import webpush from 'web-push';
import Subscription from '../models/Subscription.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || 'BFKd4ejW7KnCHmvNK27-9aVFk1tpqMMrxgfoKLz-GSLmsXctlnoOBUFOy3L-RvBm14Rftm5HkQ0DZngAsAiePMg';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || 'xYIfSVaHQdID6aazFKnOTYayjtOEdCGFjXpn25u3Vs8';
const VAPID_MAILTO = process.env.VAPID_MAILTO || 'mailto:sadgurucarmelo@gmail.com';

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  try {
    webpush.setVapidDetails(VAPID_MAILTO, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  } catch (err) {
    console.error('⚠️ Failed to configure web-push VAPID details:', err.message);
  }
}

// ── GET /api/notifications/vapid-public-key ──
router.get('/vapid-public-key', (_req, res) => {
  res.json({
    success: true,
    publicKey: VAPID_PUBLIC_KEY,
  });
});

// ── POST /api/notifications/subscribe — Save or update subscription ──
router.post('/subscribe', async (req, res) => {
  try {
    const subscription = req.body;
    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return res.status(400).json({ success: false, message: 'Invalid subscription object' });
    }

    let existingSub = await Subscription.findOne({ endpoint: subscription.endpoint });

    if (existingSub) {
      existingSub.expirationTime = subscription.expirationTime || null;
      existingSub.keys = subscription.keys;
      await existingSub.save();
    } else {
      await Subscription.create({
        endpoint: subscription.endpoint,
        expirationTime: subscription.expirationTime || null,
        keys: subscription.keys,
      });
    }

    res.status(201).json({ success: true, message: 'Push subscription saved successfully' });
  } catch (error) {
    console.error('Error saving subscription:', error);
    res.status(500).json({ success: false, message: 'Failed to save subscription' });
  }
});

// ── POST /api/notifications/unsubscribe — Remove subscription ──
router.post('/unsubscribe', async (req, res) => {
  try {
    const { endpoint } = req.body;
    if (!endpoint) {
      return res.status(400).json({ success: false, message: 'Endpoint is required' });
    }
    await Subscription.deleteOne({ endpoint });
    res.json({ success: true, message: 'Unsubscribed successfully' });
  } catch (error) {
    console.error('Error unsubscribing:', error);
    res.status(500).json({ success: false, message: 'Failed to unsubscribe' });
  }
});

// ── POST /api/notifications/broadcast — Admin manual broadcast ──
router.post('/broadcast', protect, admin, async (req, res) => {
  try {
    const { title, body, url, icon } = req.body;
    if (!title || !body) {
      return res.status(400).json({ success: false, message: 'Title and body are required' });
    }

    const payload = JSON.stringify({
      title,
      body,
      url: url || '/',
      icon: icon || '/icon-192x192.png',
      badge: '/icon-192x192.png',
    });

    const subscriptions = await Subscription.find().lean();
    let sentCount = 0;
    let failureCount = 0;

    const promises = subscriptions.map((sub) =>
      webpush.sendNotification(sub, payload)
        .then(() => {
          sentCount++;
        })
        .catch((err) => {
          failureCount++;
          if (err.statusCode === 410 || err.statusCode === 404) {
            // Expired or invalid subscription
            return Subscription.deleteOne({ _id: sub._id });
          }
        })
    );

    await Promise.all(promises);

    res.json({
      success: true,
      message: `Broadcast complete. Sent: ${sentCount}, Failed/Cleaned: ${failureCount}`,
    });
  } catch (error) {
    console.error('Error broadcasting notification:', error);
    res.status(500).json({ success: false, message: 'Broadcast failed' });
  }
});

// ── Helper: Broadcast when a new car is created ──
export async function broadcastNewCar(car) {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) return;
  try {
    const subscriptions = await Subscription.find().lean();
    if (!subscriptions.length) return;

    const formattedPrice = car.price ? `₹${Number(car.price).toLocaleString('en-IN')}` : '';
    const payload = JSON.stringify({
      title: `🚗 નવી કાર આવી ગઈ! ${car.make} ${car.model}`,
      body: `${car.year} ${car.make} ${car.model} ${formattedPrice ? `(${formattedPrice})` : ''} હવે સદગુરુ કાર મેળોમાં ઉપલબ્ધ છે! હમણાં જ જુઓ.`,
      url: `/cars/${car._id}`,
      icon: car.image || '/icon-192x192.png',
      badge: '/icon-192x192.png',
    });

    const promises = subscriptions.map((sub) =>
      webpush.sendNotification(sub, payload).catch((err) => {
        if (err.statusCode === 410 || err.statusCode === 404) {
          return Subscription.deleteOne({ _id: sub._id });
        }
        console.error('Failed to send push to subscriber:', err.message);
      })
    );

    await Promise.all(promises);
  } catch (err) {
    console.error('Failed to broadcast new car push notification:', err.message);
  }
}

export default router;
