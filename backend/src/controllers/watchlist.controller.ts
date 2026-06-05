import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { WatchlistService } from '../services/watchlist.service';
import { AuthenticatedRequest } from '../types';

const addSchema = z.object({
  movieId: z.number().int().positive(),
  mediaType: z.enum(['movie', 'tv']).default('movie'),
});

export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  getWatchlist = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.watchlistService.getWatchlist(req.user.userId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  addToWatchlist = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { movieId, mediaType } = addSchema.parse(req.body);
      const data = await this.watchlistService.addToWatchlist(req.user.userId, movieId, mediaType);
      res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  removeFromWatchlist = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const movieId = Number(req.params.movieId);
      const mediaType = (req.query.mediaType as string) || 'movie';
      await this.watchlistService.removeFromWatchlist(req.user.userId, movieId, mediaType);
      res.json({ success: true, message: 'Removed from watchlist' });
    } catch (err) {
      next(err);
    }
  };

  getWatchlistIds = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.watchlistService.getWatchlistIds(req.user.userId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };
}
