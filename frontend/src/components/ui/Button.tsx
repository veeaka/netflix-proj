import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

const variants = {
  primary: 'bg-luminary-600 hover:bg-luminary-500 text-white shadow-lg shadow-luminary-900/30',
  secondary: 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/10',
  ghost: 'bg-transparent hover:bg-white/10 text-white/80 hover:text-white',
  danger: 'bg-red-600/90 hover:bg-red-500 text-white',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-7 py-3.5 text-base gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, icon, children, className = '', disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        className={`inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-luminary-500/50 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
        {...(props as object)}
      >
        {loading ? (
          <Loader2 className="animate-spin" size={size === 'sm' ? 14 : 16} />
        ) : (
          icon && <span className="shrink-0">{icon}</span>
        )}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
