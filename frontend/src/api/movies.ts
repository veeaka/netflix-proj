import { apiClient } from './client';
import { Movie, MovieDetail, Genre, PaginatedResponse } from '@/types';

export const moviesApi = {
  getTrending: (window: 'day' | 'week' = 'week', page = 1) =>
    apiClient.get<{ success: boolean; data: PaginatedResponse<Movie> }>(`/movies/trending`, { params: { window, page } }).then((r) => r.data.data!),

  getPopular: (page = 1) =>
    apiClient.get<{ success: boolean; data: PaginatedResponse<Movie> }>('/movies/popular', { params: { page } }).then((r) => r.data.data!),

  getTopRated: (page = 1) =>
    apiClient.get<{ success: boolean; data: PaginatedResponse<Movie> }>('/movies/top-rated', { params: { page } }).then((r) => r.data.data!),

  getUpcoming: (page = 1) =>
    apiClient.get<{ success: boolean; data: PaginatedResponse<Movie> }>('/movies/upcoming', { params: { page } }).then((r) => r.data.data!),

  getNowPlaying: (page = 1) =>
    apiClient.get<{ success: boolean; data: PaginatedResponse<Movie> }>('/movies/now-playing', { params: { page } }).then((r) => r.data.data!),

  getDetail: (id: number) =>
    apiClient.get<{ success: boolean; data: MovieDetail }>(`/movies/${id}`).then((r) => r.data.data!),

  search: (q: string, page = 1) =>
    apiClient.get<{ success: boolean; data: PaginatedResponse<Movie> }>('/movies/search', { params: { q, page } }).then((r) => r.data.data!),

  getGenres: () =>
    apiClient.get<{ success: boolean; data: { genres: Genre[] } }>('/movies/genres').then((r) => r.data.data!),

  getByGenre: (genreId: number, page = 1) =>
    apiClient.get<{ success: boolean; data: PaginatedResponse<Movie> }>(`/movies/genre/${genreId}`, { params: { page } }).then((r) => r.data.data!),
};
