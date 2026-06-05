import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        luminary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        gold: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
        surface: {
          DEFAULT: '#0f0f1a',
          card: '#16162a',
          elevated: '#1e1e35',
          overlay: 'rgba(15,15,26,0.85)',
        },
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(to right, rgba(15,15,26,0.95) 35%, rgba(15,15,26,0.4) 70%, transparent)',
        'card-gradient': 'linear-gradient(to top, rgba(15,15,26,1) 0%, transparent 60%)',
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        'fade-up': 'fadeUp 0.5s ease forwards',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
