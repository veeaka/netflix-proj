import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { TrailerModal } from '@/components/movie/TrailerModal';
import { Skeleton } from '@/components/ui/Skeleton';

const Home = lazy(() => import('@/pages/Home'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const MovieDetail = lazy(() => import('@/pages/MovieDetail'));
const Search = lazy(() => import('@/pages/Search'));
const Watchlist = lazy(() => import('@/pages/Watchlist'));
const Profile = lazy(() => import('@/pages/Profile'));
const Movies = lazy(() => import('@/pages/Movies'));
const TopRated = lazy(() => import('@/pages/TopRated'));

function PageLoader() {
  return (
    <div className="min-h-screen bg-surface pt-16">
      <Skeleton className="h-[60vh] w-full rounded-none" />
    </div>
  );
}

export function AppRoutes() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/search" element={<Search />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/top-rated" element={<TopRated />} />
          <Route path="*" element={
            <div className="min-h-screen bg-surface flex items-center justify-center">
              <div className="text-center">
                <p className="text-6xl font-black text-white/10 mb-4">404</p>
                <p className="text-white/40">Page not found</p>
              </div>
            </div>
          } />
        </Routes>
      </Suspense>
      <Footer />
      <TrailerModal />
    </>
  );
}
