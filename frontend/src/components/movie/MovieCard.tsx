import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Plus, Check, Play } from 'lucide-react';
import { Movie } from '@/types';
import { IMG, QUERY_KEYS } from '@/utils/constants';
import { formatYear, formatRating } from '@/utils/format';
import { watchlistApi } from '@/api/watchlist';
import { useAuthStore } from '@/store/auth.store';
import { useQueryClient, useMutation } from '@tanstack/react-query';

interface MovieCardProps {
  movie: Movie;
  watchlistIds?: number[];
}

export function MovieCard({ movie, watchlistIds = [] }: MovieCardProps) {
  const [imgError, setImgError] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const inWatchlist = watchlistIds.includes(movie.id);

  const toggleMutation = useMutation({
    mutationFn: () =>
      inWatchlist ? watchlistApi.remove(movie.id) : watchlistApi.add(movie.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.watchlistIds });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.watchlist });
    },
  });

  return (
    <motion.div
      className="group relative"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/movie/${movie.id}`} className="block">
        <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-surface-elevated">
          {!imgError ? (
            <img
              src={IMG.poster(movie.poster_path)}
              alt={movie.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-surface-elevated">
              <span className="text-white/20 text-xs text-center px-2">{movie.title}</span>
            </div>
          )}

          <div className="absolute inset-0 bg-card-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-lg px-2.5 py-1.5">
                <Play size={12} className="text-luminary-400 fill-luminary-400" />
                <span className="text-xs font-medium text-white/90">Details</span>
              </div>
              {isAuthenticated && (
                <button
                  onClick={(e) => { e.preventDefault(); toggleMutation.mutate(); }}
                  disabled={toggleMutation.isPending}
                  className={`p-1.5 rounded-lg backdrop-blur-sm transition-all ${
                    inWatchlist
                      ? 'bg-luminary-600/80 text-white'
                      : 'bg-black/60 text-white/70 hover:text-white hover:bg-luminary-600/60'
                  }`}
                >
                  {inWatchlist ? <Check size={14} /> : <Plus size={14} />}
                </button>
              )}
            </div>
          </div>

          {movie.vote_average > 0 && (
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1">
              <Star size={10} className="text-gold-400 fill-gold-400" />
              <span className="text-xs font-semibold text-white">{formatRating(movie.vote_average)}</span>
            </div>
          )}
        </div>
      </Link>
      <div className="mt-2.5 px-0.5">
        <p className="text-sm font-medium text-white/90 truncate leading-tight">{movie.title}</p>
        <p className="text-xs text-white/40 mt-0.5">{formatYear(movie.release_date)}</p>
      </div>
    </motion.div>
  );
}
