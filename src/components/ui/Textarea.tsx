import React from 'react';
import { cn } from '@/lib/cn';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  rows?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, rows = 3, ...props }, ref) => (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-ink">{label}</label>}
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          'w-full px-3 py-2 border border-border rounded-card bg-surface text-ink placeholder:text-ink-soft focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
          error && 'border-cancelled',
          className,
        )}
        {...props}
      />
      {error && <p className="text-sm text-cancelled">{error}</p>}
    </div>
  ),
);

Textarea.displayName = 'Textarea';
