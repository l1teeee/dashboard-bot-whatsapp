import { useId, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { Popover } from 'radix-ui';
import { Calendar } from './Calendar';
import { parseLocalDateBoundary } from '@/lib/dateBoundary';
import { cn } from '@/lib/cn';

interface DatePickerProps {
  label?: string;
  /** Fecha en formato yyyy-mm-dd, o cadena vacia cuando no hay filtro. */
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const display = new Intl.DateTimeFormat('es-SV', { day: '2-digit', month: 'short', year: 'numeric' });

function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function DatePicker({ label, value, onChange, placeholder = 'Elegir fecha', className }: DatePickerProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const selected = parseLocalDateBoundary(value) ?? undefined;
  const commit = (next: string) => {
    onChange(next);
    setOpen(false);
  };

  return (
    <div className="space-y-1.5">
      {label && <span id={`${id}-label`} className="block text-xs font-extrabold tracking-[0.01em] text-inherit sm:text-sm">{label}</span>}
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger
          type="button"
          aria-labelledby={label ? `${id}-label ${id}-value` : undefined}
          className={cn(
            'flex min-h-11 w-full items-center gap-2.5 rounded-2xl border border-ink-dark/12 bg-warm px-4 text-sm font-semibold text-ink-dark shadow-sm shadow-ink-dark/5 outline-none transition-[border-color,box-shadow] duration-200 hover:border-ink-dark/25 focus-visible:border-brand focus-visible:shadow-[0_0_0_3px_rgba(47,158,145,0.25)] data-[state=open]:border-brand data-[state=open]:shadow-[0_0_0_3px_rgba(47,158,145,0.25)]',
            className,
          )}
        >
          <CalendarDays className="h-4 w-4 shrink-0 text-ink-dark/50" aria-hidden="true" />
          <span id={`${id}-value`} className={cn('flex-1 truncate text-left', !selected && 'font-medium text-ink-dark/45')}>
            {selected ? display.format(selected) : placeholder}
          </span>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={8}
            className="dropdown-content z-[70] rounded-2xl border border-ink-dark/12 bg-warm p-3 text-ink-dark shadow-[0_18px_40px_rgba(16,40,43,.22)]"
          >
            <Calendar mode="single" selected={selected} defaultMonth={selected} onSelect={(date) => commit(date ? toIsoDate(date) : '')} />
            <div className="mt-2 flex items-center justify-between gap-2 border-t border-ink-dark/10 pt-2">
              <button
                type="button"
                onClick={() => commit('')}
                className="rounded-xl px-3 py-1.5 text-xs font-bold text-ink-dark/65 transition-colors hover:bg-ink-dark/10 hover:text-ink-dark focus-ring"
              >
                Limpiar
              </button>
              <button
                type="button"
                onClick={() => commit(toIsoDate(new Date()))}
                className="rounded-xl bg-ink-dark px-3 py-1.5 text-xs font-bold text-warm transition-opacity hover:opacity-85 focus-ring"
              >
                Hoy
              </button>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
