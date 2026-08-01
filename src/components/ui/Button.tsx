import React from 'react';
import { cn } from '@/lib/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, fullWidth, disabled, ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-10 px-4 text-base',
      lg: 'h-11 px-5 text-lg',
    };

    const variantClasses = {
      primary: 'bg-brand text-surface hover:bg-brand/90',
      secondary: 'bg-surface border border-border text-ink hover:bg-canvas',
      ghost: 'text-ink hover:bg-canvas',
      danger: 'bg-cancelled text-surface hover:bg-cancelled/90',
      success: 'bg-completed text-surface hover:bg-completed/90',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex shrink-0 items-center justify-center gap-2 rounded-lg font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          sizeClasses[size],
          variantClasses[variant],
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      >
        {isLoading && <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
        {props.children}
      </button>
    );
  },
);

Button.displayName = 'Button';
