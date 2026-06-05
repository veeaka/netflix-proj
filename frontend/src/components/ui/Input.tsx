import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-white/70">{label}</label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={`w-full bg-white/5 border ${
              error ? 'border-red-500/60' : 'border-white/10'
            } rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm outline-none transition-all duration-200 focus:border-luminary-500/60 focus:bg-white/8 focus:ring-1 focus:ring-luminary-500/30 ${
              icon ? 'pl-10' : ''
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
