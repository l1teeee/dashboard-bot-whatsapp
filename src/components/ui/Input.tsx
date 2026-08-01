import React from 'react';
import { cn } from '@/lib/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  prefix?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, prefix, ...props }, ref) => (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-ink">{label}</label>}
      <div className="relative">
        {prefix && <span className="absolute left-3 top-2.5 text-ink-soft">{prefix}</span>}
        <input
          ref={ref}
          className={cn(
            'w-full px-3 py-2 border border-border rounded-card bg-surface text-ink placeholder:text-ink-soft focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
            prefix && 'pl-8',
            error && 'border-cancelled',
            className,
          )}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-cancelled">{error}</p>}
      {hint && <p className="text-sm text-ink-soft">{hint}</p>}
    </div>
  ),
);

Input.displayName = 'Input';
