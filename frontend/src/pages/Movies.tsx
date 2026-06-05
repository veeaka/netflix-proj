import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { moviesApi } from '@/api/movies';
import { watchlistApi } from '@/api/watchlist';
import { QUERY_KEYS } from '@/utils/constants';
import { useAuthStore } from '@/store/auth.store';
import { MovieCard } from '@/components/movie/MovieCard';
import { MovieCardSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { ChevronRight, ChevronLeft } from 'lucide-react';

type Category = 'popular' | 'top-rated' | 'upcoming' | 'now-playing';

const categories: { key: Category; label: string }[] = [
  { key: 'popular', label: 'Popular' },
  { key: 'top-rated', label: 'Top Rated' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'now-playing', label: 'Now Playing' },
];

const fetchers: Record<Category, (page: number) => ReturnType<typeof moviesApi.getPopular>> = {
  'popular': (p) => moviesApi.getPopular(p),
  'top-rated': (p) => moviesApi.getTopRated(p),
  'upcoming': (p) => moviesApi.getUpcoming(p),
  'now-playing': (p) => moviesApi.getNowPlaying(p),
};

const queryKeys: Record<Category, readonly string[]> = {
  'popular': QUERY_KEYS.popular,
  'top-rated': QUERY_KEYS.topRated,
  'upcoming': QUERY_KEYS.upcoming,
  'now-playing': QUERY_KEYS.nowPlaying,
};

export default function Movies() {
  const [category, setCategory] = useState<Category>('popular');
  const [page, setPage] = useState(1);
  const { isAuthenticated } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: [...queryKeys[category], page],
    queryFn: () => fetchers[category](page),
    staleTime: 1000 * 60 * 10,
  });

  const { data: watchlistIds } = useQuery({
    queryKey: QUERY_KEYS.watchlistIds,
    queryFn: watchlistApi.getWatchlistIds,
    enabled: isAuthenticated,
  });

  const handleCategory = (cat: Category) => {
    setCategory(cat);
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-surface pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Browse Movies</h1>

        <div className="flex gap-2 mb-8 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => handleCategory(cat.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                category === cat.key
                  ? 'bg-luminary-600 text-white'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-10">
          {isLoading
            ? Array.from({ length: 18 }).map((_, i) => <MovieCardSkeleton key={i} />)
            : data?.results.map((movie, i) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                >
                  <MovieCard movie={movie} watchlistIds={watchlistIds} />
                </motion.div>
              ))}
        </div>

        {!isLoading && data && (
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="secondary"
              size="sm"
              icon={<ChevronLeft size={16} />}
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </Button>
            <span className="text-sm text-white/40">Page {page} of {Math.min(data.total_pages, 500)}</span>
            <Button
              variant="secondary"
              size="sm"
              disabled={page >= Math.min(data.total_pages, 500)}
              onClick={() => setPage((p) => p + 1)}
            >
              Next <ChevronRight size={16} />
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
