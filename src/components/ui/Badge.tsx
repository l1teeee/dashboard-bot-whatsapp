import React from 'react'; import { cn } from '@/lib/cn';
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> { tone?: 'neutral' | 'pending' | 'processing' | 'completed' | 'cancelled'; size?: 'sm' | 'md'; }
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(({ className, tone = 'neutral', size = 'md', ...props }, ref) => {
  const tones = { neutral: 'bg-surface-raised border-border text-ink', pending: 'bg-yellow border-ink-dark text-ink-dark', processing: 'bg-lilac border-ink-dark text-ink-dark', completed: 'bg-mint border-ink-dark text-ink-dark', cancelled: 'bg-coral border-ink-dark text-ink-dark' };
  return <span ref={ref} className={cn('inline-flex shrink-0 whitespace-nowrap items-center gap-1.5 rounded-full border font-extrabold uppercase tracking-wide', tones[tone], size === 'sm' ? 'px-2 py-1 text-[10px]' : 'px-3 py-1.5 text-xs', className)} {...props} />;
}); Badge.displayName = 'Badge';
