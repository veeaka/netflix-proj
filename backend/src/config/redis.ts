import Redis from 'ioredis';
import { env } from './env';
import { logger } from '../utils/logger';

export const redis = env.REDIS_URL
  ? new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      retryStrategy: (times) => Math.min(times * 50, 2000),
    })
  : null;

if (redis) {
  redis.on('connect', () => logger.info('Redis connected'));
  redis.on('error', (err) => logger.error('Redis error', err));
}

export async function connectRedis(): Promise<void> {
  if (!redis) { logger.warn('Redis not configured — caching disabled'); return; }
  await redis.connect();
}
