import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, Plus, Check, Star } from 'lucide-react';
import { Movie } from '@/types';
import { IMG, QUERY_KEYS } from '@/utils/constants';
import { formatYear, formatRating } from '@/utils/format';
import { Button } from '../ui/Button';
import { watchlistApi } from '@/api/watchlist';
import { useAuthStore } from '@/store/auth.store';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { HeroSkeleton } from '../ui/Skeleton';

interface HeroSectionProps {
  movies?: Movie[];
  isLoading?: boolean;
  watchlistIds?: number[];
}

export function HeroSection({ movies, isLoading, watchlistIds = [] }: HeroSectionProps) {
  const [current, setCurrent] = useState(0);
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const featured = movies?.slice(0, 5) ?? [];
  const movie = featured[current];
  const inWatchlist = movie ? watchlistIds.includes(movie.id) : false;

  useEffect(() => {
    if (featured.length <= 1) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % featured.length), 8000);
    return () => clearInterval(timer);
  }, [featured.length]);

  const toggleMutation = useMutation({
    mutationFn: () =>
      inWatchlist ? watchlistApi.remove(movie!.id) : watchlistApi.add(movie!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.watchlistIds });
    },
  });

  if (isLoading) return <HeroSkeleton />;
  if (!movie) return null;

  return (
    <div className="relative h-[80vh] min-h-[500px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={movie.id}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.7 }}
        >
          <img
            src={IMG.backdrop(movie.backdrop_path, 'original')}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f1a] via-[#0f0f1a]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1a] via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative h-full flex items-center px-4 sm:px-8 lg:px-16 xl:px-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${movie.id}`}
            className="max-w-2xl"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              {movie.vote_average > 0 && (
                <div className="flex items-center gap-1.5 bg-gold-500/15 border border-gold-500/20 rounded-full px-3 py-1">
                  <Star size={12} className="text-gold-400 fill-gold-400" />
                  <span className="text-xs font-semibold text-gold-400">{formatRating(movie.vote_average)}</span>
                </div>
              )}
              <span className="text-xs text-white/50 font-medium">{formatYear(movie.release_date)}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight mb-4">
              {movie.title}
            </h1>

            <p className="text-white/60 text-sm sm:text-base leading-relaxed max-w-lg mb-8 line-clamp-3">
              {movie.overview}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link to={`/movie/${movie.id}`}>
                <Button size="lg" icon={<Play size={18} className="fill-white" />}>
                  Watch Now
                </Button>
              </Link>
              <Link to={`/movie/${movie.id}`}>
                <Button size="lg" variant="secondary" icon={<Info size={18} />}>
                  More Info
                </Button>
              </Link>
              {isAuthenticated && (
                <Button
                  size="lg"
                  variant="ghost"
                  icon={inWatchlist ? <Check size={18} /> : <Plus size={18} />}
                  loading={toggleMutation.isPending}
                  onClick={() => toggleMutation.mutate()}
                  className={inWatchlist ? 'text-luminary-400' : ''}
                >
                  {inWatchlist ? 'In List' : 'Add to List'}
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {featured.length > 1 && (
          <div className="absolute bottom-8 left-4 sm:left-8 lg:left-16 xl:left-24 flex gap-2">
            {featured.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === current ? 'w-8 bg-luminary-500' : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
