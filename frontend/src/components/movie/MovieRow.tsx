import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '@/types';
import { MovieCard } from './MovieCard';
import { MovieCardSkeleton } from '../ui/Skeleton';

interface MovieRowProps {
  title: string;
  movies?: Movie[];
  isLoading?: boolean;
  watchlistIds?: number[];
}

export function MovieRow({ title, movies, isLoading, watchlistIds }: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -480 : 480, behavior: 'smooth' });
  };

  return (
    <section className="relative group/row">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-lg font-semibold text-white/90">{title}</h2>
        <div className="flex gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity">
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="shrink-0 w-36 sm:w-40 lg:w-44">
                <MovieCardSkeleton />
              </div>
            ))
          : movies?.map((movie) => (
              <motion.div
                key={movie.id}
                className="shrink-0 w-36 sm:w-40 lg:w-44"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <MovieCard movie={movie} watchlistIds={watchlistIds} />
              </motion.div>
            ))}
      </div>
    </section>
  );
}
