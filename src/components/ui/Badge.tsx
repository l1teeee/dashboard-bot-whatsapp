import React from 'react';
import { cn } from '@/lib/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone: 'neutral' | 'pending' | 'processing' | 'completed' | 'cancelled';
  size?: 'sm' | 'md';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, tone = 'neutral', size = 'md', ...props }, ref) => {
    const toneClasses = {
      neutral: 'bg-surface border border-border text-ink',
      pending: 'bg-pending-soft text-pending',
      processing: 'bg-processing-soft text-processing',
      completed: 'bg-completed-soft text-completed',
      cancelled: 'bg-cancelled-soft text-cancelled',
    };

    const sizeClasses = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1.5 text-sm',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium rounded-full',
          toneClasses[tone],
          sizeClasses[size],
          className,
        )}
        {...props}
      />
    );
  },
);

Badge.displayName = 'Badge';
