import type { ComponentProps } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker, type ChevronProps } from 'react-day-picker';
import { es } from 'react-day-picker/locale';
import { cn } from '@/lib/cn';

export type CalendarProps = ComponentProps<typeof DayPicker>;

const navButton = 'grid size-9 place-items-center rounded-xl text-ink-dark/60 outline-none transition-colors hover:bg-ink-dark/10 hover:text-ink-dark focus-visible:ring-[3px] focus-visible:ring-brand/30 disabled:opacity-35';

const baseClassNames = {
  months: 'relative flex flex-col gap-4 sm:flex-row',
  month: 'w-full',
  month_caption: 'relative z-20 mx-10 mb-1 flex h-9 items-center justify-center',
  caption_label: 'text-sm font-extrabold uppercase tracking-[0.06em]',
  nav: 'absolute top-0 z-10 flex w-full justify-between',
  button_previous: navButton,
  button_next: navButton,
  month_grid: 'w-full border-collapse',
  weekday: 'size-9 p-0 text-[11px] font-bold uppercase tracking-wide text-ink-dark/50',
  day: 'group size-9 px-0 text-sm',
  day_button:
    'relative flex size-9 items-center justify-center rounded-xl p-0 font-semibold text-ink-dark outline-none transition-colors hover:bg-ink-dark/10 focus-visible:z-10 focus-visible:ring-[3px] focus-visible:ring-brand/35 group-data-[selected]:bg-ink-dark group-data-[selected]:text-warm group-data-[disabled]:pointer-events-none group-data-[disabled]:text-ink-dark/30 group-data-[disabled]:line-through group-data-[outside]:text-ink-dark/35 group-[.range-start:not(.range-end)]:rounded-e-none group-[.range-end:not(.range-start)]:rounded-s-none group-[.range-middle]:rounded-none group-data-[selected]:group-[.range-middle]:bg-ink-dark/12 group-data-[selected]:group-[.range-middle]:text-ink-dark',
  range_start: 'range-start',
  range_end: 'range-end',
  range_middle: 'range-middle',
  today:
    '*:after:pointer-events-none *:after:absolute *:after:bottom-1 *:after:start-1/2 *:after:size-[3px] *:after:-translate-x-1/2 *:after:rounded-full *:after:bg-brand [&[data-selected]>*]:after:bg-warm',
  outside: 'text-ink-dark/35',
  hidden: 'invisible',
  week_number: 'size-9 p-0 text-[11px] font-bold text-ink-dark/50',
};

function Chevron({ orientation, className }: ChevronProps) {
  const Icon = orientation === 'left' ? ChevronLeft : ChevronRight;
  return <Icon className={cn('h-4 w-4', className)} aria-hidden="true" />;
}

export function Calendar({ className, classNames, showOutsideDays = true, components, ...props }: CalendarProps) {
  return (
    <DayPicker
      locale={es}
      showOutsideDays={showOutsideDays}
      className={cn('w-fit select-none text-ink-dark', className)}
      classNames={{ ...baseClassNames, ...classNames }}
      components={{ Chevron, ...components }}
      {...props}
    />
  );
}
