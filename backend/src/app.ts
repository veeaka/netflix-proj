import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import { env } from './config/env';
import { errorHandler } from './middlewares/error.middleware';
import { createAuthRouter } from './routes/auth.routes';
import { createMoviesRouter } from './routes/movies.routes';
import { createWatchlistRouter } from './routes/watchlist.routes';
import { createUserRouter } from './routes/user.routes';
import { logger } from './utils/logger';

export function createApp(prisma: PrismaClient) {
  const app = express();

  const allowedOrigins = env.FRONTEND_URL.split(',').map((o) => o.trim());
  app.use(helmet());
  app.use(cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.some((o) => origin.startsWith(o))) cb(null, true);
      else cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
  }));
  app.use(compression());
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('combined', { stream: { write: (msg) => logger.http(msg.trim()) } }));

  const limiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: 'Too many requests' },
  });
  app.use('/api', limiter);

  app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

  app.use('/api/auth', createAuthRouter(prisma));
  app.use('/api/movies', createMoviesRouter());
  app.use('/api/watchlist', createWatchlistRouter(prisma));
  app.use('/api/user', createUserRouter(prisma));

  app.use(errorHandler);

  return app;
}
