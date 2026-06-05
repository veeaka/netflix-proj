import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Play, Plus, Check, Star, Clock, Calendar, ArrowLeft } from 'lucide-react';
import { moviesApi } from '@/api/movies';
import { watchlistApi } from '@/api/watchlist';
import { QUERY_KEYS, IMG } from '@/utils/constants';
import { formatRuntime, formatYear, formatRating, formatVoteCount } from '@/utils/format';
import { useAuthStore } from '@/store/auth.store';
import { useUIStore } from '@/store/ui.store';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MovieRow } from '@/components/movie/MovieRow';
import { Skeleton } from '@/components/ui/Skeleton';

export default function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  const movieId = Number(id);
  const { isAuthenticated } = useAuthStore();
  const { openTrailer } = useUIStore();
  const queryClient = useQueryClient();

  const { data: movie, isLoading } = useQuery({
    queryKey: QUERY_KEYS.movie(movieId),
    queryFn: () => moviesApi.getDetail(movieId),
    enabled: !!movieId,
  });

  const { data: watchlistIds } = useQuery({
    queryKey: QUERY_KEYS.watchlistIds,
    queryFn: watchlistApi.getWatchlistIds,
    enabled: isAuthenticated,
  });

  const inWatchlist = watchlistIds?.includes(movieId) ?? false;

  const toggleMutation = useMutation({
    mutationFn: () => inWatchlist ? watchlistApi.remove(movieId) : watchlistApi.add(movieId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.watchlistIds }),
  });

  const handleTrailer = () => {
    const trailer = movie?.videos?.results.find((v) => v.type === 'Trailer' && v.site === 'YouTube')
      ?? movie?.videos?.results.find((v) => v.site === 'YouTube');
    if (trailer) openTrailer(trailer.key);
  };

  const director = movie?.credits?.crew.find((c) => c.job === 'Director');
  const cast = movie?.credits?.cast.slice(0, 8) ?? [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface pt-16">
        <Skeleton className="h-[60vh] w-full rounded-none" />
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-4">
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!movie) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <p className="text-white/40">Movie not found</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-surface">
      <div className="relative h-[60vh] min-h-[400px]">
        <img
          src={IMG.backdrop(movie.backdrop_path, 'original')}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-surface/30" />

        <Link
          to="/"
          className="absolute top-20 left-4 sm:left-8 lg:left-16 flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </Link>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <motion.div
          className="flex flex-col lg:flex-row gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="shrink-0 hidden md:block">
            <img
              src={IMG.poster(movie.poster_path, 'w342')}
              alt={movie.title}
              className="w-48 lg:w-56 rounded-2xl shadow-2xl border border-white/5"
            />
          </div>

          <div className="flex-1">
            {movie.tagline && (
              <p className="text-luminary-400 text-sm font-medium mb-2 italic">{movie.tagline}</p>
            )}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-3">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              {movie.vote_average > 0 && (
                <div className="flex items-center gap-1.5 bg-gold-500/10 rounded-lg px-2.5 py-1">
                  <Star size={13} className="text-gold-400 fill-gold-400" />
                  <span className="text-sm font-semibold text-gold-400">{formatRating(movie.vote_average)}</span>
                  <span className="text-xs text-white/30">({formatVoteCount(movie.vote_count)})</span>
                </div>
              )}
              {movie.runtime > 0 && (
                <div className="flex items-center gap-1.5 text-white/50 text-sm">
                  <Clock size={13} />
                  {formatRuntime(movie.runtime)}
                </div>
              )}
              {movie.release_date && (
                <div className="flex items-center gap-1.5 text-white/50 text-sm">
                  <Calendar size={13} />
                  {formatYear(movie.release_date)}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres.map((g) => (
                <Badge key={g.id} variant="purple">{g.name}</Badge>
              ))}
            </div>

            <p className="text-white/60 leading-relaxed mb-7 max-w-2xl">{movie.overview}</p>

            <div className="flex flex-wrap gap-3 mb-8">
              {movie.videos?.results.some((v) => v.site === 'YouTube') && (
                <Button size="lg" icon={<Play size={18} className="fill-white" />} onClick={handleTrailer}>
                  Watch Trailer
                </Button>
              )}
              {isAuthenticated && (
                <Button
                  size="lg"
                  variant="secondary"
                  icon={inWatchlist ? <Check size={18} /> : <Plus size={18} />}
                  loading={toggleMutation.isPending}
                  onClick={() => toggleMutation.mutate()}
                  className={inWatchlist ? 'border-luminary-500/40' : ''}
                >
                  {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                </Button>
              )}
            </div>

            {(director || movie.production_companies.length > 0) && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm border-t border-white/5 pt-6">
                {director && (
                  <div>
                    <p className="text-white/30 text-xs uppercase tracking-wider mb-1">Director</p>
                    <p className="text-white/80 font-medium">{director.name}</p>
                  </div>
                )}
                {movie.status && (
                  <div>
                    <p className="text-white/30 text-xs uppercase tracking-wider mb-1">Status</p>
                    <p className="text-white/80 font-medium">{movie.status}</p>
                  </div>
                )}
                {movie.original_language && (
                  <div>
                    <p className="text-white/30 text-xs uppercase tracking-wider mb-1">Language</p>
                    <p className="text-white/80 font-medium uppercase">{movie.original_language}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {cast.length > 0 && (
          <section className="mt-14">
            <h2 className="text-lg font-semibold text-white/90 mb-5">Cast</h2>
            <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              {cast.map((member) => (
                <div key={member.id} className="shrink-0 w-24 text-center">
                  <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-surface-elevated mb-2">
                    {member.profile_path ? (
                      <img
                        src={IMG.profile(member.profile_path) ?? ''}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20 text-2xl font-bold">
                        {member.name[0]}
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-medium text-white/80 leading-tight">{member.name}</p>
                  <p className="text-xs text-white/30 mt-0.5 leading-tight">{member.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {(movie.similar?.results.length ?? 0) > 0 && (
          <div className="mt-14">
            <MovieRow title="Similar Movies" movies={movie.similar?.results} watchlistIds={watchlistIds} />
          </div>
        )}

        {(movie.recommendations?.results.length ?? 0) > 0 && (
          <div className="mt-10 mb-10">
            <MovieRow title="Recommended" movies={movie.recommendations?.results} watchlistIds={watchlistIds} />
          </div>
        )}
      </div>
    </main>
  );
}
