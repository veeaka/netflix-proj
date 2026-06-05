import { Router, RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import { WatchlistController } from '../controllers/watchlist.controller';
import { WatchlistService } from '../services/watchlist.service';
import { WatchlistRepository } from '../repositories/watchlist.repository';
import { TMDBService } from '../services/tmdb.service';
import { authenticate } from '../middlewares/auth.middleware';

export function createWatchlistRouter(prisma: PrismaClient): Router {
  const router = Router();
  const watchlistRepo = new WatchlistRepository(prisma);
  const tmdbService = new TMDBService();
  const watchlistService = new WatchlistService(watchlistRepo, tmdbService);
  const controller = new WatchlistController(watchlistService);

  router.use(authenticate as RequestHandler);
  router.get('/', controller.getWatchlist as RequestHandler);
  router.get('/ids', controller.getWatchlistIds as RequestHandler);
  router.post('/', controller.addToWatchlist as RequestHandler);
  router.delete('/:movieId', controller.removeFromWatchlist as RequestHandler);

  return router;
}
