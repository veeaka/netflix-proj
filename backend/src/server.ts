import { PrismaClient } from '@prisma/client';
import { createApp } from './app';
import { connectRedis } from './config/redis';
import { env } from './config/env';
import { logger } from './utils/logger';

const prisma = new PrismaClient({
  log: env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
});

async function bootstrap() {
  await connectRedis();
  await prisma.$connect();
  logger.info('Database connected');

  const app = createApp(prisma);
  const server = app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} [${env.NODE_ENV}]`);
  });

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received, shutting down`);
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((err) => {
  logger.error('Bootstrap failed', err);
  process.exit(1);
});
