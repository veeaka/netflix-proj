import { redis } from '../config/redis';
import { logger } from './logger';

const DEFAULT_TTL = 3600; // 1 hour

export async function getCached<T>(key: string): Promise<T | null> {
  if (!redis) return null;
  try {
    const data = await redis.get(key);
    return data ? (JSON.parse(data) as T) : null;
  } catch {
    logger.warn(`Cache get failed for key: ${key}`);
    return null;
  }
}

export async function setCached(key: string, value: unknown, ttl = DEFAULT_TTL): Promise<void> {
  if (!redis) return;
  try {
    await redis.setex(key, ttl, JSON.stringify(value));
  } catch {
    logger.warn(`Cache set failed for key: ${key}`);
  }
}

export async function deleteCached(key: string): Promise<void> {
  if (!redis) return;
  try {
    await redis.del(key);
  } catch {
    logger.warn(`Cache delete failed for key: ${key}`);
  }
}

export async function withCache<T>(key: string, fn: () => Promise<T>, ttl = DEFAULT_TTL): Promise<T> {
  const cached = await getCached<T>(key);
  if (cached !== null) return cached;
  const fresh = await fn();
  await setCached(key, fresh, ttl);
  return fresh;
}
