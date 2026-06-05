export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export const IMG = {
  poster: (path: string | null, size: 'w185' | 'w342' | 'w500' | 'original' = 'w342') =>
    path ? `${TMDB_IMAGE_BASE}/${size}${path}` : '/placeholder-poster.jpg',

  backdrop: (path: string | null, size: 'w780' | 'w1280' | 'original' = 'w1280') =>
    path ? `${TMDB_IMAGE_BASE}/${size}${path}` : '/placeholder-backdrop.jpg',

  profile: (path: string | null, size: 'w45' | 'w185' | 'h632' = 'w185') =>
    path ? `${TMDB_IMAGE_BASE}/${size}${path}` : null,
} as const;

export const QUERY_KEYS = {
  trending: (window: string) => ['movies', 'trending', window],
  popular: ['movies', 'popular'],
  topRated: ['movies', 'top-rated'],
  upcoming: ['movies', 'upcoming'],
  nowPlaying: ['movies', 'now-playing'],
  movie: (id: number) => ['movies', id],
  search: (q: string) => ['movies', 'search', q],
  genres: ['movies', 'genres'],
  watchlist: ['watchlist'],
  watchlistIds: ['watchlist', 'ids'],
  profile: ['user', 'profile'],
} as const;
