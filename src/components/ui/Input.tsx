import React, { useId } from 'react';
import { cn } from '@/lib/cn';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> { label?: string; error?: string; hint?: string; prefix?: React.ReactNode; suffix?: React.ReactNode; }

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, label, error, hint, prefix, suffix, id, ...props }, ref) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const describedBy = [error ? errorId : undefined, hint ? hintId : undefined].filter(Boolean).join(' ') || undefined;
  return <div className="space-y-1.5">
    {label && <label htmlFor={inputId} className="block text-xs font-extrabold tracking-[0.01em] text-inherit sm:text-sm">{label}</label>}
    <div className="relative">
      {prefix && <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" aria-hidden="true">{prefix}</span>}
      <input ref={ref} id={inputId} aria-invalid={Boolean(error)} aria-describedby={describedBy} className={cn('min-h-11 w-full rounded-2xl border border-border bg-surface-raised px-4 py-2 text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-ink-soft focus:border-brand focus:bg-surface focus:shadow-[0_0_0_4px_rgba(47,158,145,0.2)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60', prefix && 'pl-11', suffix && 'pr-12', error && 'border-coral focus:border-coral focus:shadow-[0_0_0_4px_rgba(255,138,122,0.2)]', className)} {...props} />
      {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</span>}
    </div>
    {error && <p id={errorId} role="alert" aria-live="polite" className="text-sm font-medium text-coral">{error}</p>}{hint && <p id={hintId} className="text-xs font-medium text-ink-soft">{hint}</p>}
  </div>;
});
Input.displayName = 'Input';
