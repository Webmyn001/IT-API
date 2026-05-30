import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { errorHandler, notFoundHandler } from './api/middleware/errorHandler';
import { connectDB } from './models/connection';
import logger from './utils/logger';

import authRoutes from './api/routes/auth';
import companyRoutes from './api/routes/company';
import adminRoutes from './api/routes/admin';
import searchRoutes from './api/routes/search';

const app = express();

// Connect to MongoDB (safe to call multiple times — uses cached connection)
connectDB().catch((err) =>
  logger.error('MongoDB connection failed', { error: err.message })
);
const API_PREFIX = process.env.API_PREFIX || '/api/v1';

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(compression());
const allowedOrigins = (process.env.CORS_ORIGIN || 'https://internapi-oqxo.onrender.com,http://localhost:5173,http://localhost:4173').split(',');
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.some((o) => origin.startsWith(o.trim()))) return cb(null, true);
    cb(null, origin);
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', {
    stream: { write: (message) => logger.info(message.trim()) },
  }));
}

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later' },
});
app.use(limiter);

app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'InternshipAPI is running', timestamp: new Date().toISOString() });
});

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/companies`, companyRoutes);
app.use(`${API_PREFIX}/admin`, adminRoutes);
app.use(`${API_PREFIX}/search`, searchRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
