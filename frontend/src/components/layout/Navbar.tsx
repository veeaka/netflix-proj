import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, User, LogOut, BookmarkCheck, Menu, X } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { authApi } from '@/api/auth';
import { IMG } from '@/utils/constants';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchOpen(false);
      setSearchValue('');
    }
  };

  const handleLogout = async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    logout();
    navigate('/');
  };

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Movies', to: '/movies' },
    { label: 'Top Rated', to: '/top-rated' },
    { label: 'Watchlist', to: '/watchlist' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled ? 'bg-surface/95 backdrop-blur-md shadow-lg shadow-black/20 border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-luminary-600 flex items-center justify-center shadow-lg shadow-luminary-900/50">
                <span className="text-white font-black text-sm">L</span>
              </div>
              <span className="text-white font-bold text-xl tracking-tight">Luminary</span>
            </Link>
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === link.to
                      ? 'text-white bg-white/10'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <AnimatePresence mode="wait">
              {searchOpen ? (
                <motion.form
                  key="search-form"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 220, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSearch}
                  className="overflow-hidden"
                >
                  <input
                    ref={searchRef}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search movies..."
                    className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-luminary-500/60"
                    onBlur={() => { if (!searchValue) setSearchOpen(false); }}
                  />
                </motion.form>
              ) : null}
            </AnimatePresence>

            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
            >
              <Search size={18} />
            </button>

            {isAuthenticated && user ? (
              <>
                <button className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all hidden sm:flex">
                  <Bell size={18} />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen((v) => !v)}
                    className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/5 transition-all"
                  >
                    {user.avatar ? (
                      <img src={IMG.poster(user.avatar, 'w185')} alt={user.name} className="w-8 h-8 rounded-lg object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-luminary-700 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{user.name[0].toUpperCase()}</span>
                      </div>
                    )}
                  </button>
                  <AnimatePresence>
                    {profileOpen && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={() => setProfileOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-52 bg-surface-elevated border border-white/10 rounded-xl shadow-xl z-40 overflow-hidden"
                        >
                          <div className="px-4 py-3 border-b border-white/5">
                            <p className="text-sm font-semibold text-white">{user.name}</p>
                            <p className="text-xs text-white/40 truncate">{user.email}</p>
                          </div>
                          <div className="p-1">
                            <Link
                              to="/profile"
                              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
                            >
                              <User size={15} /> Profile
                            </Link>
                            <Link
                              to="/watchlist"
                              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
                            >
                              <BookmarkCheck size={15} /> My Watchlist
                            </Link>
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                            >
                              <LogOut size={15} /> Sign out
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium bg-luminary-600 hover:bg-luminary-500 text-white rounded-xl transition-all"
                >
                  Get started
                </Link>
              </div>
            )}

            <button
              className="lg:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden bg-surface/98 backdrop-blur-lg border-t border-white/5"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all"
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="flex gap-2 mt-2 pt-2 border-t border-white/5">
                  <Link to="/login" className="flex-1 text-center px-4 py-2 text-sm font-medium text-white/70 hover:text-white border border-white/10 rounded-xl transition-all">
                    Sign in
                  </Link>
                  <Link to="/register" className="flex-1 text-center px-4 py-2 text-sm font-medium bg-luminary-600 text-white rounded-xl transition-all">
                    Get started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
