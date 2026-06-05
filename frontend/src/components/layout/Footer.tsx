import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-white/5 mt-20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-luminary-600 flex items-center justify-center">
                <span className="text-white font-black text-xs">L</span>
              </div>
              <span className="text-white font-bold text-lg">Luminary</span>
            </div>
            <p className="text-white/30 text-sm max-w-xs">
              Your premium streaming destination. Discover, watch, and curate your perfect collection.
            </p>
          </div>
          <div className="flex gap-12 text-sm text-white/40">
            <div className="flex flex-col gap-2">
              <p className="text-white/60 font-medium mb-1">Browse</p>
              <Link to="/" className="hover:text-white/80 transition-colors">Home</Link>
              <Link to="/movies" className="hover:text-white/80 transition-colors">Movies</Link>
              <Link to="/top-rated" className="hover:text-white/80 transition-colors">Top Rated</Link>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-white/60 font-medium mb-1">Account</p>
              <Link to="/login" className="hover:text-white/80 transition-colors">Sign in</Link>
              <Link to="/register" className="hover:text-white/80 transition-colors">Register</Link>
              <Link to="/watchlist" className="hover:text-white/80 transition-colors">Watchlist</Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between gap-3">
          <p className="text-xs text-white/20">© {new Date().getFullYear()} Luminary. Built with TMDB data.</p>
          <p className="text-xs text-white/20">This product uses the TMDB API but is not endorsed by TMDB.</p>
        </div>
      </div>
    </footer>
  );
}
