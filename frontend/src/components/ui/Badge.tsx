interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'purple' | 'gold' | 'red';
}

const variants = {
  default: 'bg-white/10 text-white/70',
  purple: 'bg-luminary-600/20 text-luminary-300 border border-luminary-500/20',
  gold: 'bg-gold-500/20 text-gold-400 border border-gold-500/20',
  red: 'bg-red-500/20 text-red-300 border border-red-500/20',
};

export function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}
