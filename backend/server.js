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
import connectDB from './config/db.js';

// Route imports
import authRoutes from './routes/auth.routes.js';
import carRoutes from './routes/car.routes.js';
import leadRoutes from './routes/lead.routes.js';

// ── Load env variables ──
// (done automatically via 'dotenv/config' at top)

// ── Connect to MongoDB ──
connectDB();

// ── Initialize Express ──
const app = express();

// ── Core Middleware ──
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://sadgurucarmelo.com'
    : ['http://localhost:5173', 'http://localhost:3000'],
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

// ── 404 Handler ──
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global Error Handler ──
app.use((err, _req, res, _next) => {
  console.error('❌ Server Error:', err);

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
