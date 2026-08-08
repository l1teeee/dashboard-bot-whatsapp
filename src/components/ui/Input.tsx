import React, { useId } from 'react';
import { cn } from '@/lib/cn';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> { label?: string; error?: string; hint?: string; prefix?: React.ReactNode; suffix?: React.ReactNode; tone?: 'dark' | 'light'; }

/** "light" viste el campo para tarjetas claras (mint/coral): sin borde negro, foco con anillo brand. */
const tones = {
  dark: 'border-border bg-surface-raised text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] placeholder:text-ink-soft focus:border-brand focus:bg-surface focus:shadow-[0_0_0_4px_rgba(47,158,145,0.2)]',
  light: 'border-ink-dark/12 bg-warm text-ink-dark shadow-sm shadow-ink-dark/5 placeholder:text-ink-dark/45 hover:border-ink-dark/25 focus:border-brand focus:shadow-[0_0_0_3px_rgba(47,158,145,0.25)]',
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, label, error, hint, prefix, suffix, id, tone = 'dark', ...props }, ref) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const describedBy = [error ? errorId : undefined, hint ? hintId : undefined].filter(Boolean).join(' ') || undefined;
  return <div className="space-y-1.5">
    {label && <label htmlFor={inputId} className="block text-xs font-extrabold tracking-[0.01em] text-inherit sm:text-sm">{label}</label>}
    <div className="relative">
      {prefix && <span className={cn('pointer-events-none absolute left-4 top-1/2 -translate-y-1/2', tone === 'light' ? 'text-ink-dark/50' : 'text-ink-soft')} aria-hidden="true">{prefix}</span>}
      <input ref={ref} id={inputId} aria-invalid={Boolean(error)} aria-describedby={describedBy} className={cn('min-h-11 w-full rounded-2xl border px-4 py-2 transition-[border-color,box-shadow,background-color] duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60', tones[tone], prefix && 'pl-11', suffix && 'pr-12', error && 'border-coral focus:border-coral focus:shadow-[0_0_0_4px_rgba(255,138,122,0.2)]', className)} {...props} />
      {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</span>}
    </div>
    {error && <p id={errorId} role="alert" aria-live="polite" className="text-sm font-medium text-coral">{error}</p>}{hint && <p id={hintId} className={cn('text-xs font-medium', tone === 'light' ? 'text-ink-dark/60' : 'text-ink-soft')}>{hint}</p>}
  </div>;
});
Input.displayName = 'Input';
