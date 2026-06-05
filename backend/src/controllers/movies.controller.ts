import { Request, Response, NextFunction } from 'express';
import { TMDBService } from '../services/tmdb.service';

export class MoviesController {
  constructor(private readonly tmdbService: TMDBService) {}

  getTrending = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { window = 'week', page = '1' } = req.query;
      const data = await this.tmdbService.getTrending(window as 'day' | 'week', Number(page));
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  getPopular = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page = '1' } = req.query;
      const data = await this.tmdbService.getPopular(Number(page));
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  getTopRated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page = '1' } = req.query;
      const data = await this.tmdbService.getTopRated(Number(page));
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  getUpcoming = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page = '1' } = req.query;
      const data = await this.tmdbService.getUpcoming(Number(page));
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  getNowPlaying = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page = '1' } = req.query;
      const data = await this.tmdbService.getNowPlaying(Number(page));
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  getMovieDetail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const data = await this.tmdbService.getMovieDetail(Number(id));
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  search = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { q, page = '1' } = req.query;
      if (!q || typeof q !== 'string') {
        res.status(400).json({ success: false, error: 'Query required' });
        return;
      }
      const data = await this.tmdbService.searchMovies(q, Number(page));
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  getGenres = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.tmdbService.getGenres();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  getByGenre = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { page = '1' } = req.query;
      const data = await this.tmdbService.getByGenre(Number(id), Number(page));
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };
}
