import React from 'react';
import { cn } from '@/lib/cn';

interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  disabled?: boolean;
}

export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, label, disabled, ...props }, ref) => (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        ref={ref}
        type="checkbox"
        disabled={disabled}
        className={cn(
          'w-5 h-5 rounded-sm border border-border accent-brand cursor-pointer',
          disabled && 'opacity-50 cursor-not-allowed',
          className,
        )}
        {...props}
      />
      {label && <span className="text-sm font-medium text-ink">{label}</span>}
    </label>
  ),
);

Toggle.displayName = 'Toggle';
