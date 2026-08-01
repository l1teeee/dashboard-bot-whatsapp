import React from 'react';
import { Slot } from 'radix-ui';
import { cn } from '@/lib/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'dark'; size?: 'sm' | 'md' | 'lg'; isLoading?: boolean; fullWidth?: boolean; asChild?: boolean;
}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = 'primary', size = 'md', isLoading, fullWidth, disabled, asChild, children, ...props }, ref) => {
  const Component = asChild ? Slot.Root : 'button';
  const sizes = { sm: 'min-h-10 px-3 text-xs', md: 'min-h-11 px-4 text-sm', lg: 'min-h-12 px-5 text-base' };
  const variants = { primary: 'bg-lilac text-ink-dark border border-ink-dark hover:-translate-y-0.5', secondary: 'bg-warm text-ink-dark border border-ink-dark hover:-translate-y-0.5', ghost: 'bg-transparent text-ink hover:bg-surface-raised', danger: 'bg-coral text-ink-dark border border-ink-dark hover:-translate-y-0.5', success: 'bg-mint text-ink-dark border border-ink-dark hover:-translate-y-0.5', dark: 'bg-shell text-ink border border-border hover:bg-surface-raised' };
  return <Component ref={ref} disabled={disabled || isLoading} className={cn('inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl font-bold transition-all focus-ring disabled:opacity-50 disabled:cursor-not-allowed', sizes[size], variants[variant], (variant !== 'ghost') && 'neo-shadow', fullWidth && 'w-full', className)} {...props}>{isLoading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}{children}</Component>;
});
Button.displayName = 'Button';
