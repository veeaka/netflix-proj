import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BookmarkCheck, Film } from 'lucide-react';
import { watchlistApi } from '@/api/watchlist';
import { QUERY_KEYS } from '@/utils/constants';
import { useAuthStore } from '@/store/auth.store';
import { MovieCard } from '@/components/movie/MovieCard';
import { MovieCardSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';

export default function Watchlist() {
  const { isAuthenticated } = useAuthStore();

  const { data: movies, isLoading } = useQuery({
    queryKey: QUERY_KEYS.watchlist,
    queryFn: watchlistApi.getWatchlist,
    enabled: isAuthenticated,
  });

  const { data: watchlistIds } = useQuery({
    queryKey: QUERY_KEYS.watchlistIds,
    queryFn: watchlistApi.getWatchlistIds,
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <motion.div
          className="text-center max-w-md"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <BookmarkCheck size={48} className="text-luminary-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Sign in to see your watchlist</h2>
          <p className="text-white/40 mb-6">Save movies and keep track of what you want to watch</p>
          <div className="flex gap-3 justify-center">
            <Link to="/login"><Button variant="secondary">Sign in</Button></Link>
            <Link to="/register"><Button>Create account</Button></Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-surface pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl mx-auto">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-1">
            <BookmarkCheck size={24} className="text-luminary-400" />
            <h1 className="text-3xl font-bold text-white">My Watchlist</h1>
          </div>
          {!isLoading && (
            <p className="text-white/40 text-sm ml-9">
              {movies?.length ?? 0} {movies?.length === 1 ? 'title' : 'titles'} saved
            </p>
          )}
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <MovieCardSkeleton key={i} />)}
          </div>
        ) : movies?.length === 0 ? (
          <div className="text-center py-20">
            <Film size={48} className="text-white/10 mx-auto mb-4" />
            <p className="text-white/30 text-lg font-medium">Your watchlist is empty</p>
            <p className="text-white/20 text-sm mt-1 mb-6">Browse movies and add them to your list</p>
            <Link to="/"><Button variant="secondary">Browse Movies</Button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies?.map((movie, i) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <MovieCard movie={movie as never} watchlistIds={watchlistIds} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
