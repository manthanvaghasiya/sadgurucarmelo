// ═══════════════════════════════════════════════════════
//  Sadguru Car Melo — Express API Entry Point
// ═══════════════════════════════════════════════════════
//
//  INSTALL DEPENDENCIES:
//  cd backend && npm install express mongoose dotenv cors bcryptjs jsonwebtoken
//  npm install -D nodemon
//
// ═══════════════════════════════════════════════════════

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import fs from 'fs';
import path from 'path';

// ── Custom Mongo Sanitizer (Express 5 compatible) ──
// express-mongo-sanitize v2 is incompatible with Express 5 (req.query is read-only).
// This lightweight replacement strips MongoDB operator keys ($) from req.body & req.params.
function sanitizeObject(obj) {
  if (obj && typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      if (key.startsWith('$')) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        sanitizeObject(obj[key]);
      }
    }
  }
  return obj;
}
function mongoSanitize() {
  return (req, _res, next) => {
    if (req.body) sanitizeObject(req.body);
    if (req.params) sanitizeObject(req.params);
    next();
  };
}

// Route imports
import authRoutes from './routes/auth.routes.js';
import carRoutes from './routes/car.routes.js';
import leadRoutes from './routes/lead.routes.js';
import messageRoutes from './routes/message.routes.js';
import promoPosterRoutes from './routes/promoPoster.routes.js';

// ── Load env variables ──
// (done automatically via 'dotenv/config' at top)

// ── Connect to MongoDB ──
connectDB();

// ── Initialize Express ──
const app = express();

// ── Security Middleware ──
app.use(helmet());
app.use(mongoSanitize());

// ── Rate Limiting ──
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many login attempts. Try again in 15 minutes.' },
});
app.use('/api', apiLimiter);
app.use('/api/auth/login', loginLimiter);

// ── Core Middleware ──
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? (process.env.FRONTEND_URL || 'https://sadgurucarmelo.com')
    : ['http://localhost:5173', 'http://localhost:5175', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Request Logger (Dev Only) ──
if (process.env.NODE_ENV === 'development') {
  app.use((req, _res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
  });
}

// ── Health Check ──
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Sadguru Car Melo API',
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ──
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/promo-posters', promoPosterRoutes);

// ── 404 Handler ──
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global Error Handler ──
app.use((err, _req, res, _next) => {
  console.error('❌ Server Error:', err);

  // Write to a local log file if in production
  if (process.env.NODE_ENV === 'production') {
    const logPath = path.join(process.cwd(), 'errors.log');
    const logLine = `[${new Date().toISOString()}] ${err.name}: ${err.message}\n${err.stack}\n\n`;
    fs.appendFile(logPath, logLine, (appendErr) => {
      if (appendErr) console.error('Failed to write to error log:', appendErr);
    });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ── Start Server ──
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚗 Sadguru Car Melo API running on port ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Health: http://localhost:${PORT}/api/health\n`);
});
