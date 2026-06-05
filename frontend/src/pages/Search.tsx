import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search as SearchIcon, X } from 'lucide-react';
import { moviesApi } from '@/api/movies';
import { watchlistApi } from '@/api/watchlist';
import { QUERY_KEYS } from '@/utils/constants';
import { useAuthStore } from '@/store/auth.store';
import { MovieCard } from '@/components/movie/MovieCard';
import { MovieCardSkeleton } from '@/components/ui/Skeleton';

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(initialQ);
  const debouncedQuery = useDebounce(query, 400);
  const { isAuthenticated } = useAuthStore();

  const syncParams = useCallback((q: string) => {
    if (q) setSearchParams({ q });
    else setSearchParams({});
  }, [setSearchParams]);

  useEffect(() => { syncParams(debouncedQuery); }, [debouncedQuery, syncParams]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: QUERY_KEYS.search(debouncedQuery),
    queryFn: () => moviesApi.search(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 1000 * 60 * 5,
  });

  const { data: watchlistIds } = useQuery({
    queryKey: QUERY_KEYS.watchlistIds,
    queryFn: watchlistApi.getWatchlistIds,
    enabled: isAuthenticated,
  });

  const loading = isLoading || isFetching;

  return (
    <main className="min-h-screen bg-surface pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl mx-auto">
        <motion.div
          className="max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <h1 className="text-3xl font-bold text-white mb-6 text-center">Search Movies</h1>
          <div className="relative">
            <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for movies..."
              autoFocus
              className="w-full bg-surface-card border border-white/10 rounded-2xl px-4 py-4 pl-12 pr-12 text-white placeholder:text-white/30 outline-none focus:border-luminary-500/50 focus:ring-1 focus:ring-luminary-500/20 text-base transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </motion.div>

        {!debouncedQuery && (
          <p className="text-center text-white/30 text-sm">Type to search for movies...</p>
        )}

        {debouncedQuery && debouncedQuery.length < 2 && (
          <p className="text-center text-white/30 text-sm">Type at least 2 characters</p>
        )}

        {debouncedQuery.length >= 2 && (
          <>
            {!loading && data && (
              <p className="text-sm text-white/30 mb-6">
                {data.total_results.toLocaleString()} results for "<span className="text-white/60">{debouncedQuery}</span>"
              </p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {loading
                ? Array.from({ length: 12 }).map((_, i) => <MovieCardSkeleton key={i} />)
                : data?.results.map((movie) => (
                    <motion.div
                      key={movie.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <MovieCard movie={movie} watchlistIds={watchlistIds} />
                    </motion.div>
                  ))}
            </div>

            {!loading && data?.results.length === 0 && (
              <div className="text-center py-20">
                <p className="text-white/30 text-lg">No results for "{debouncedQuery}"</p>
                <p className="text-white/20 text-sm mt-2">Try a different search term</p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
