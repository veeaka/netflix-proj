import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, BookmarkCheck, LogOut } from 'lucide-react';
import { authApi } from '@/api/auth';
import { watchlistApi } from '@/api/watchlist';
import { QUERY_KEYS } from '@/utils/constants';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';

export default function Profile() {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user: storeUser } = useAuthStore();

  const { data: profile, isLoading } = useQuery({
    queryKey: QUERY_KEYS.profile,
    queryFn: authApi.getMe,
    enabled: isAuthenticated,
    initialData: storeUser ?? undefined,
  });

  const { data: watchlistIds } = useQuery({
    queryKey: QUERY_KEYS.watchlistIds,
    queryFn: watchlistApi.getWatchlistIds,
    enabled: isAuthenticated,
  });

  const handleLogout = async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    logout();
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-white/40 mb-4">Sign in to view your profile</p>
          <Link to="/login"><Button>Sign in</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-surface pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          <div className="bg-surface-card border border-white/5 rounded-2xl p-8">
            <div className="flex items-start gap-5">
              <div className="w-20 h-20 rounded-2xl bg-luminary-700 flex items-center justify-center text-3xl font-black text-white shrink-0">
                {isLoading ? (
                  <Skeleton className="w-full h-full rounded-2xl" />
                ) : (
                  profile?.name?.[0]?.toUpperCase() ?? <User size={32} />
                )}
              </div>
              <div className="flex-1">
                {isLoading ? (
                  <>
                    <Skeleton className="h-7 w-40 mb-2" />
                    <Skeleton className="h-4 w-56" />
                  </>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold text-white">{profile?.name}</h1>
                    <p className="text-white/40 text-sm mt-0.5">Member since {new Date(profile?.createdAt ?? '').getFullYear()}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="bg-surface-card border border-white/5 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Account Info</h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <User size={14} className="text-white/40" />
                </div>
                <div>
                  <p className="text-xs text-white/30">Name</p>
                  {isLoading ? <Skeleton className="h-4 w-32 mt-1" /> : <p className="text-sm text-white/80">{profile?.name}</p>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <Mail size={14} className="text-white/40" />
                </div>
                <div>
                  <p className="text-xs text-white/30">Email</p>
                  {isLoading ? <Skeleton className="h-4 w-48 mt-1" /> : <p className="text-sm text-white/80">{profile?.email}</p>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <Calendar size={14} className="text-white/40" />
                </div>
                <div>
                  <p className="text-xs text-white/30">Member since</p>
                  <p className="text-sm text-white/80">{new Date(profile?.createdAt ?? '').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
            </div>
          </div>

          <Link to="/watchlist" className="block">
            <div className="bg-surface-card border border-white/5 hover:border-luminary-500/30 rounded-2xl p-5 flex items-center justify-between transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-luminary-600/20 flex items-center justify-center">
                  <BookmarkCheck size={18} className="text-luminary-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/90">My Watchlist</p>
                  <p className="text-xs text-white/30">{watchlistIds?.length ?? 0} titles saved</p>
                </div>
              </div>
              <span className="text-white/30 group-hover:text-white/60 transition-colors">→</span>
            </div>
          </Link>

          <Button
            variant="danger"
            size="lg"
            icon={<LogOut size={16} />}
            onClick={handleLogout}
            className="self-start"
          >
            Sign out
          </Button>
        </motion.div>
      </div>
    </main>
  );
}
