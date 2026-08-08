import { useId } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Select as SelectPrimitive } from 'radix-ui';
import { cn } from '@/lib/cn';
interface SelectOption { value: string; label: string; }
interface SelectProps { label?: string; error?: string; options: SelectOption[]; value: string; onValueChange: (value: string) => void; placeholder?: string; disabled?: boolean; className?: string; tone?: 'dark' | 'light'; }

/** "light" comparte estilo con Input/DatePicker tone="light" para tarjetas claras. */
const tones = {
  dark: {
    trigger: 'border-border bg-surface-raised text-ink focus-ring data-[placeholder]:text-ink-soft',
    content: 'border-border bg-surface-raised text-ink neo-shadow',
    item: 'data-[highlighted]:bg-mint data-[highlighted]:text-ink-dark',
  },
  light: {
    trigger: 'border-ink-dark/12 bg-warm text-sm font-semibold text-ink-dark shadow-sm shadow-ink-dark/5 outline-none transition-[border-color,box-shadow] duration-200 hover:border-ink-dark/25 focus-visible:border-brand focus-visible:shadow-[0_0_0_3px_rgba(47,158,145,0.25)] data-[placeholder]:font-medium data-[placeholder]:text-ink-dark/45 data-[state=open]:border-brand data-[state=open]:shadow-[0_0_0_3px_rgba(47,158,145,0.25)]',
    content: 'border-ink-dark/12 bg-warm text-ink-dark shadow-[0_18px_40px_rgba(16,40,43,.22)]',
    item: 'data-[highlighted]:bg-ink-dark data-[highlighted]:text-warm data-[state=checked]:bg-ink-dark/10',
  },
};

export function Select({ className, label, error, options, value, onValueChange, placeholder = 'Seleccionar', disabled, tone = 'dark' }: SelectProps) {
  const id = useId();
  const styles = tones[tone];
  return <div className="space-y-1.5">{label && <label className={cn('block text-inherit', tone === 'light' ? 'text-xs font-extrabold tracking-[0.01em] sm:text-sm' : 'text-sm font-bold')}>{label}</label>}<SelectPrimitive.Root value={value} onValueChange={onValueChange} disabled={disabled}><SelectPrimitive.Trigger aria-label={label || placeholder} className={cn('flex min-h-11 w-full items-center justify-between gap-2 rounded-2xl border px-4 text-left', styles.trigger, error && 'border-coral', className)}><SelectPrimitive.Value placeholder={placeholder}/><SelectPrimitive.Icon><ChevronDown className="h-4 w-4 opacity-70"/></SelectPrimitive.Icon></SelectPrimitive.Trigger><SelectPrimitive.Portal><SelectPrimitive.Content position="popper" sideOffset={6} className={cn('dropdown-content z-[70] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-2xl border p-1', styles.content)}><SelectPrimitive.Viewport>{options.map((option) => <SelectPrimitive.Item key={option.value} value={option.value} className={cn('relative flex min-h-10 cursor-default select-none items-center rounded-xl py-2 pl-8 pr-3 text-sm font-bold outline-none', styles.item)}><SelectPrimitive.ItemIndicator className="absolute left-2"><Check className="h-4 w-4"/></SelectPrimitive.ItemIndicator><SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText></SelectPrimitive.Item>)}</SelectPrimitive.Viewport></SelectPrimitive.Content></SelectPrimitive.Portal></SelectPrimitive.Root>{error && <p id={`${id}-error`} className="text-sm text-coral">{error}</p>}</div>;
}
