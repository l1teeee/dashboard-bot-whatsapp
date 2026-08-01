import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog } from 'radix-ui';
import { Search, SearchX, LayoutDashboard, History, UtensilsCrossed, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useOrders } from '@/hooks/useOrders';
import { STATUS_META } from '@/lib/orderStatus';
import { formatCurrency, formatPhone } from '@/lib/format';

type CommandItem = { id: string; type: 'nav' | 'order'; label?: string; path?: string; icon?: React.ReactNode; orderId?: number; phone?: string; status?: string; total?: number; };
const navigation: CommandItem[] = [
  { id: 'nav-dashboard', type: 'nav', label: 'En vivo', path: '/', icon: <LayoutDashboard className="h-4 w-4" /> },
  { id: 'nav-orders', type: 'nav', label: 'Historial', path: '/orders', icon: <History className="h-4 w-4" /> },
  { id: 'nav-analytics', type: 'nav', label: 'Analíticas', path: '/analytics', icon: <BarChart3 className="h-4 w-4" /> },
  { id: 'nav-menu', type: 'nav', label: 'Menú', path: '/menu', icon: <UtensilsCrossed className="h-4 w-4" /> },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(0);
  const { orders, isLoading } = useOrders();
  const navigate = useNavigate();
  const input = useRef<HTMLInputElement>(null);
  const items = useMemo<CommandItem[]>(() => {
    const query = search.toLowerCase();
    const nav = navigation.filter((item) => !query || item.label?.toLowerCase().includes(query));
    const matching = orders.filter((order) => String(order.id).includes(search) || order.phone_number.includes(search)).slice(0, 6).map((order) => ({ id: `order-${order.id}`, type: 'order' as const, orderId: order.id, phone: order.phone_number, status: order.status, total: order.total }));
    return [...nav, ...matching];
  }, [search, orders]);
  const choose = (item: CommandItem) => { if (item.type === 'nav') navigate(item.path!); else navigate(`/orders?order=${item.orderId}`); setOpen(false); };

  useEffect(() => {
    const key = (event: KeyboardEvent) => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setOpen(true); } };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, []);
  useEffect(() => { if (open) { setSelected(0); requestAnimationFrame(() => input.current?.focus()); } }, [open]);
  useEffect(() => { if (open) setSelected(0); }, [open, search]);
  useEffect(() => { if (open) document.querySelector<HTMLElement>('[data-command-selected="true"]')?.scrollIntoView({ block: 'nearest' }); }, [open, selected]);

  const keydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') { event.preventDefault(); setOpen(false); }
    if (event.key === 'ArrowDown') { event.preventDefault(); setSelected((current) => Math.min(current + 1, Math.max(items.length - 1, 0))); }
    if (event.key === 'ArrowUp') { event.preventDefault(); setSelected((current) => Math.max(current - 1, 0)); }
    if (event.key === 'Enter' && items[selected]) { event.preventDefault(); choose(items[selected]); }
  };

  return <Dialog.Root open={open} onOpenChange={setOpen}><Dialog.Portal><Dialog.Overlay className="command-overlay fixed inset-0 z-50 bg-black/70" /><Dialog.Content aria-describedby={undefined} className="command-content fixed left-1/2 top-4 z-[51] grid max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-[28px] border border-border bg-surface-raised text-ink neo-shadow outline-none sm:top-[15vh]"><Dialog.Title className="sr-only">Buscar en el panel</Dialog.Title><div className="flex min-w-0 items-center gap-3 border-b border-border px-4 py-4"><Search className="h-5 w-5 shrink-0 text-yellow" /><input ref={input} value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={keydown} placeholder="Buscar por número o teléfono..." className="min-h-9 min-w-0 flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-ink-soft" /><kbd className="shrink-0 rounded-lg border border-border px-2 py-1 text-[10px] text-ink-soft">ESC</kbd></div><div className="min-h-0 overflow-x-hidden overflow-y-auto p-2 scrollbar-subtle">{isLoading && !items.length ? <p className="p-8 text-center text-sm text-ink-soft">Cargando pedidos...</p> : !items.length ? <div className="flex flex-col items-center gap-2 p-8 text-center text-sm text-ink-soft"><SearchX className="h-5 w-5" />Sin resultados para esta búsqueda</div> : items.map((item, index) => <button key={item.id} data-command-selected={index === selected} onClick={() => choose(item)} className={cn('flex min-h-12 min-w-0 w-full items-center gap-3 rounded-2xl px-3 text-left text-sm font-bold outline-none', index === selected ? 'bg-mint text-ink-dark' : 'text-ink hover:bg-surface')}>{item.type === 'nav' ? <>{item.icon}<span className="min-w-0 truncate">{item.label}</span></> : <><span className="shrink-0 font-display text-xl">#{item.orderId}</span><span className="min-w-0 flex-1 truncate text-xs">{formatPhone(item.phone!)}</span><span className="hidden shrink-0 sm:inline"><span className={cn('mr-1.5 inline-block h-2 w-2 rounded-full', STATUS_META[item.status as keyof typeof STATUS_META].dot)} />{STATUS_META[item.status as keyof typeof STATUS_META].label}</span><span className="shrink-0">{formatCurrency(item.total!)}</span></>}</button>)}</div></Dialog.Content></Dialog.Portal></Dialog.Root>;
}
