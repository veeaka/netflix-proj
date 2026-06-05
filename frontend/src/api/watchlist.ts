import { apiClient } from './client';
import { MovieDetail } from '@/types';

export const watchlistApi = {
  getWatchlist: () =>
    apiClient.get<{ success: boolean; data: MovieDetail[] }>('/watchlist').then((r) => r.data.data!),

  getWatchlistIds: () =>
    apiClient.get<{ success: boolean; data: number[] }>('/watchlist/ids').then((r) => r.data.data!),

  add: (movieId: number, mediaType = 'movie') =>
    apiClient.post('/watchlist', { movieId, mediaType }).then((r) => r.data),

  remove: (movieId: number, mediaType = 'movie') =>
    apiClient.delete(`/watchlist/${movieId}`, { params: { mediaType } }).then((r) => r.data),
};
