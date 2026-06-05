import { useQuery } from '@tanstack/react-query';
import { HeroSection } from '@/components/movie/HeroSection';
import { MovieRow } from '@/components/movie/MovieRow';
import { moviesApi } from '@/api/movies';
import { watchlistApi } from '@/api/watchlist';
import { QUERY_KEYS } from '@/utils/constants';
import { useAuthStore } from '@/store/auth.store';

export default function Home() {
  const { isAuthenticated } = useAuthStore();

  const { data: trending, isLoading: trendingLoading } = useQuery({
    queryKey: QUERY_KEYS.trending('week'),
    queryFn: () => moviesApi.getTrending('week'),
    staleTime: 1000 * 60 * 10,
  });

  const { data: popular, isLoading: popularLoading } = useQuery({
    queryKey: QUERY_KEYS.popular,
    queryFn: () => moviesApi.getPopular(),
    staleTime: 1000 * 60 * 10,
  });

  const { data: topRated, isLoading: topRatedLoading } = useQuery({
    queryKey: QUERY_KEYS.topRated,
    queryFn: () => moviesApi.getTopRated(),
    staleTime: 1000 * 60 * 30,
  });

  const { data: upcoming, isLoading: upcomingLoading } = useQuery({
    queryKey: QUERY_KEYS.upcoming,
    queryFn: () => moviesApi.getUpcoming(),
    staleTime: 1000 * 60 * 30,
  });

  const { data: nowPlaying, isLoading: nowPlayingLoading } = useQuery({
    queryKey: QUERY_KEYS.nowPlaying,
    queryFn: () => moviesApi.getNowPlaying(),
    staleTime: 1000 * 60 * 10,
  });

  const { data: watchlistIds } = useQuery({
    queryKey: QUERY_KEYS.watchlistIds,
    queryFn: watchlistApi.getWatchlistIds,
    enabled: isAuthenticated,
  });

  return (
    <main className="min-h-screen bg-surface">
      <HeroSection
        movies={trending?.results}
        isLoading={trendingLoading}
        watchlistIds={watchlistIds}
      />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-10">
        <MovieRow
          title="Trending This Week"
          movies={trending?.results}
          isLoading={trendingLoading}
          watchlistIds={watchlistIds}
        />
        <MovieRow
          title="Now Playing"
          movies={nowPlaying?.results}
          isLoading={nowPlayingLoading}
          watchlistIds={watchlistIds}
        />
        <MovieRow
          title="Popular Movies"
          movies={popular?.results}
          isLoading={popularLoading}
          watchlistIds={watchlistIds}
        />
        <MovieRow
          title="Top Rated"
          movies={topRated?.results}
          isLoading={topRatedLoading}
          watchlistIds={watchlistIds}
        />
        <MovieRow
          title="Coming Soon"
          movies={upcoming?.results}
          isLoading={upcomingLoading}
          watchlistIds={watchlistIds}
        />
      </div>
    </main>
  );
}
