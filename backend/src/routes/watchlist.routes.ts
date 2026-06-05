import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { WatchlistController } from '../controllers/watchlist.controller';
import { WatchlistService } from '../services/watchlist.service';
import { WatchlistRepository } from '../repositories/watchlist.repository';
import { TMDBService } from '../services/tmdb.service';
import { authenticate } from '../middlewares/auth.middleware';
import { AuthenticatedRequest } from '../types';

export function createWatchlistRouter(prisma: PrismaClient): Router {
  const router = Router();
  const watchlistRepo = new WatchlistRepository(prisma);
  const tmdbService = new TMDBService();
  const watchlistService = new WatchlistService(watchlistRepo, tmdbService);
  const controller = new WatchlistController(watchlistService);

  const auth = authenticate as never;
  const wrap = (fn: (req: AuthenticatedRequest, res: never, next: never) => Promise<void>) =>
    (req: never, res: never, next: never) => fn(req, res, next);

  router.use(auth);
  router.get('/', wrap(controller.getWatchlist));
  router.get('/ids', wrap(controller.getWatchlistIds));
  router.post('/', wrap(controller.addToWatchlist));
  router.delete('/:movieId', wrap(controller.removeFromWatchlist));

  return router;
}
