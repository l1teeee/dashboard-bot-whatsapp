import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Filter, Search, SlidersHorizontal, X } from 'lucide-react';
import { Input, Select, Button } from '@/components/ui';
import { STATUS_ORDER } from '@/lib/orderStatus';
import type { OrderStatus } from '@/types/order';

export interface FilterState { status: OrderStatus | 'all'; phone: string; from: string; to: string; }

const labels: Record<OrderStatus, string> = { pending: 'Pendiente', processing: 'En proceso', completed: 'Completado', cancelled: 'Cancelado' };

export function OrderFilters({ value, onChange, onReset }: { value: FilterState; onChange: (next: FilterState) => void; onReset: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const activeCount = [value.status !== 'all', Boolean(value.phone), Boolean(value.from), Boolean(value.to)].filter(Boolean).length;
  const options = [{ value: 'all', label: 'Todos los estados' }, ...STATUS_ORDER.map((status) => ({ value: status, label: labels[status] }))];
  const secondaryFilters = (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(10rem,1.1fr)_minmax(8.5rem,.85fr)_minmax(8.5rem,.85fr)]">
      <Select label="Estado" value={value.status} options={options} onValueChange={(status) => onChange({ ...value, status: status as FilterState['status'] })} className="border-ink-dark bg-warm text-ink-dark shadow-[inset_0_1px_0_rgba(255,255,255,.45)] focus:border-brand sm:col-span-2 lg:col-span-1" />
      <Input label="Desde" type="date" value={value.from} onChange={(event) => onChange({ ...value, from: event.target.value })} className="border-ink-dark bg-warm text-ink-dark shadow-[inset_0_1px_0_rgba(255,255,255,.45)]" />
      <Input label="Hasta" type="date" value={value.to} onChange={(event) => onChange({ ...value, to: event.target.value })} className="border-ink-dark bg-warm text-ink-dark shadow-[inset_0_1px_0_rgba(255,255,255,.45)]" />
    </div>
  );

  return <section aria-label="Filtros de pedidos" className="rounded-[28px] border border-ink-dark bg-mint p-4 text-ink-dark neo-shadow sm:p-5">
    <div className="flex items-center justify-between gap-3 md:hidden">
      <div className="flex items-center gap-2 font-display text-2xl font-bold uppercase"><Filter className="h-5 w-5" />Filtros {activeCount > 0 && <span className="rounded-full bg-ink-dark px-2 py-0.5 text-xs text-mint">{activeCount}</span>}</div>
      <Button type="button" variant="dark" size="sm" aria-expanded={expanded} aria-controls="secondary-order-filters" onClick={() => setExpanded((current) => !current)}><SlidersHorizontal className="h-4 w-4" />{expanded ? 'Cerrar' : 'Más filtros'}</Button>
    </div>
    <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(25rem,1fr)] lg:items-end">
      <div className="rounded-2xl border border-ink-dark/15 bg-ink-dark/[.045] p-3 sm:p-3.5">
        <Input label="Buscar pedido por teléfono" hint="Escribe cualquier parte del número; ignoramos espacios, guiones y el signo +." type="search" inputMode="tel" autoComplete="tel" placeholder="Ej.: +503 1234-5678" value={value.phone} onChange={(event) => onChange({ ...value, phone: event.target.value })} prefix={<Search className="h-5 w-5" />} suffix={value.phone ? <button type="button" aria-label="Borrar búsqueda" onClick={() => onChange({ ...value, phone: '' })} className="grid h-8 w-8 place-items-center rounded-full text-ink-dark/70 transition-colors hover:bg-ink-dark/10 hover:text-ink-dark focus-ring"><X className="h-4 w-4" /></button> : undefined} className="min-h-13 rounded-xl border-ink-dark bg-warm text-[15px] font-medium text-ink-dark placeholder:text-ink-dark/45" />
      </div>
      <div className="hidden rounded-2xl border border-ink-dark/15 bg-ink-dark/[.045] p-3.5 md:block">
        <div className="mb-3 flex items-center justify-between gap-3"><p className="kicker text-ink-dark/65">Estado y periodo</p>{activeCount > 0 && <Button type="button" variant="dark" size="sm" onClick={onReset}>Limpiar <span className="rounded-full bg-mint px-1.5 text-[10px] text-ink-dark">{activeCount}</span></Button>}</div>
        {secondaryFilters}
      </div>
    </div>
    <AnimatePresence initial={false}>
      {expanded && <motion.div id="secondary-order-filters" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden md:hidden"><div className="mt-4 rounded-2xl border border-ink-dark/15 bg-ink-dark/[.045] p-3">{secondaryFilters}{activeCount > 0 && <Button type="button" variant="dark" fullWidth className="mt-3" onClick={onReset}>Limpiar filtros ({activeCount})</Button>}</div></motion.div>}
    </AnimatePresence>
  </section>;
}
