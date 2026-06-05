import axios, { AxiosInstance } from 'axios';
import { env } from '../config/env';
import { withCache } from '../utils/cache';
import {
  TMDBMovie,
  TMDBMovieDetail,
  TMDBGenre,
  PaginatedResponse,
} from '../types';

export class TMDBService {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: env.TMDB_BASE_URL,
      params: { api_key: env.TMDB_API_KEY },
      timeout: 10000,
    });
  }

  async getTrending(timeWindow: 'day' | 'week' = 'week', page = 1): Promise<PaginatedResponse<TMDBMovie>> {
    return withCache(`trending:${timeWindow}:${page}`, () =>
      this.client.get(`/trending/movie/${timeWindow}`, { params: { page } }).then((r) => r.data)
    );
  }

  async getPopular(page = 1): Promise<PaginatedResponse<TMDBMovie>> {
    return withCache(`popular:${page}`, () =>
      this.client.get('/movie/popular', { params: { page } }).then((r) => r.data)
    );
  }

  async getTopRated(page = 1): Promise<PaginatedResponse<TMDBMovie>> {
    return withCache(`top_rated:${page}`, () =>
      this.client.get('/movie/top_rated', { params: { page } }).then((r) => r.data)
    );
  }

  async getUpcoming(page = 1): Promise<PaginatedResponse<TMDBMovie>> {
    return withCache(`upcoming:${page}`, () =>
      this.client.get('/movie/upcoming', { params: { page } }).then((r) => r.data)
    );
  }

  async getNowPlaying(page = 1): Promise<PaginatedResponse<TMDBMovie>> {
    return withCache(`now_playing:${page}`, () =>
      this.client.get('/movie/now_playing', { params: { page } }).then((r) => r.data)
    );
  }

  async getMovieDetail(movieId: number): Promise<TMDBMovieDetail> {
    return withCache(
      `movie:${movieId}`,
      () =>
        this.client
          .get(`/movie/${movieId}`, {
            params: { append_to_response: 'credits,videos,similar,recommendations' },
          })
          .then((r) => r.data),
      1800
    );
  }

  async searchMovies(query: string, page = 1): Promise<PaginatedResponse<TMDBMovie>> {
    return this.client
      .get('/search/movie', { params: { query, page, include_adult: false } })
      .then((r) => r.data);
  }

  async getGenres(): Promise<{ genres: TMDBGenre[] }> {
    return withCache('genres', () =>
      this.client.get('/genre/movie/list').then((r) => r.data)
    );
  }

  async getByGenre(genreId: number, page = 1): Promise<PaginatedResponse<TMDBMovie>> {
    return withCache(`genre:${genreId}:${page}`, () =>
      this.client
        .get('/discover/movie', { params: { with_genres: genreId, page, sort_by: 'popularity.desc' } })
        .then((r) => r.data)
    );
  }

  async getMultipleMovies(ids: number[]): Promise<TMDBMovieDetail[]> {
    const results = await Promise.allSettled(ids.map((id) => this.getMovieDetail(id)));
    return results
      .filter((r): r is PromiseFulfilledResult<TMDBMovieDetail> => r.status === 'fulfilled')
      .map((r) => r.value);
  }
}
