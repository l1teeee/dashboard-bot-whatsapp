import React from 'react';
import { cn } from '@/lib/cn';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  options: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-ink">{label}</label>}
      <select
        ref={ref}
        className={cn(
          'w-full px-3 py-2 border border-border rounded-card bg-surface text-ink focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
          error && 'border-cancelled',
          className,
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-cancelled">{error}</p>}
    </div>
  ),
);

Select.displayName = 'Select';
