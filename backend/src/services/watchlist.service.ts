import { WatchlistRepository } from '../repositories/watchlist.repository';
import { TMDBService } from './tmdb.service';
import { AppError } from '../middlewares/error.middleware';

export class WatchlistService {
  constructor(
    private readonly watchlistRepo: WatchlistRepository,
    private readonly tmdbService: TMDBService
  ) {}

  async getWatchlist(userId: string) {
    const items = await this.watchlistRepo.findByUser(userId);
    if (items.length === 0) return [];

    const movies = await this.tmdbService.getMultipleMovies(items.map((i) => i.movieId));
    return movies;
  }

  async addToWatchlist(userId: string, movieId: number, mediaType: string) {
    const existing = await this.watchlistRepo.findOne(userId, movieId, mediaType);
    if (existing) throw new AppError('Already in watchlist', 409);

    return this.watchlistRepo.add(userId, movieId, mediaType);
  }

  async removeFromWatchlist(userId: string, movieId: number, mediaType: string) {
    const existing = await this.watchlistRepo.findOne(userId, movieId, mediaType);
    if (!existing) throw new AppError('Not in watchlist', 404);

    await this.watchlistRepo.remove(userId, movieId, mediaType);
  }

  async getWatchlistIds(userId: string): Promise<number[]> {
    return this.watchlistRepo.getMovieIds(userId);
  }
}
