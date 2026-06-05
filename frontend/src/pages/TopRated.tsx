import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { moviesApi } from '@/api/movies';
import { watchlistApi } from '@/api/watchlist';
import { QUERY_KEYS } from '@/utils/constants';
import { useAuthStore } from '@/store/auth.store';
import { MovieCard } from '@/components/movie/MovieCard';
import { MovieCardSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export default function TopRated() {
  const [page, setPage] = useState(1);
  const { isAuthenticated } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: [...QUERY_KEYS.topRated, page],
    queryFn: () => moviesApi.getTopRated(page),
    staleTime: 1000 * 60 * 30,
  });

  const { data: watchlistIds } = useQuery({
    queryKey: QUERY_KEYS.watchlistIds,
    queryFn: watchlistApi.getWatchlistIds,
    enabled: isAuthenticated,
  });

  return (
    <main className="min-h-screen bg-surface pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Trophy size={28} className="text-gold-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">Top Rated</h1>
            <p className="text-white/40 text-sm mt-0.5">The greatest movies ever made</p>
          </div>
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
            <Button variant="secondary" size="sm" icon={<ChevronLeft size={16} />} disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Prev
            </Button>
            <span className="text-sm text-white/40">Page {page} of {Math.min(data.total_pages, 500)}</span>
            <Button variant="secondary" size="sm" disabled={page >= Math.min(data.total_pages, 500)} onClick={() => setPage((p) => p + 1)}>
              Next <ChevronRight size={16} />
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
