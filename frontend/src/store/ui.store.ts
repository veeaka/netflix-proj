import { create } from 'zustand';

interface UIState {
  trailerKey: string | null;
  isTrailerOpen: boolean;
  openTrailer: (key: string) => void;
  closeTrailer: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  trailerKey: null,
  isTrailerOpen: false,
  openTrailer: (key) => set({ trailerKey: key, isTrailerOpen: true }),
  closeTrailer: () => set({ isTrailerOpen: false, trailerKey: null }),
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
}));
