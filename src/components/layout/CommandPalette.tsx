import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SearchX, LayoutDashboard, History, UtensilsCrossed } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useOrders } from '@/hooks/useOrders';
import { STATUS_META } from '@/lib/orderStatus';
import { formatCurrency, formatPhone } from '@/lib/format';

interface NavigationItem {
  id: string;
  type: 'nav';
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface OrderItem {
  id: string;
  type: 'order';
  orderId: number;
  phone: string;
  status: string;
  statusLabel: string;
  statusDot: string;
  total: number;
}

type CommandItem = NavigationItem | OrderItem;

const NAV_ITEMS: NavigationItem[] = [
  {
    id: 'nav-dashboard',
    type: 'nav',
    label: 'Pedidos',
    path: '/',
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  {
    id: 'nav-orders',
    type: 'nav',
    label: 'Historial',
    path: '/orders',
    icon: <History className="w-4 h-4" />,
  },
  {
    id: 'nav-menu',
    type: 'nav',
    label: 'Menu',
    path: '/menu',
    icon: <UtensilsCrossed className="w-4 h-4" />,
  },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { orders, isLoading } = useOrders();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const items = useMemo(() => {
    const allItems: CommandItem[] = [];

    if (!search) {
      allItems.push(...NAV_ITEMS);
    } else {
      const filteredNav = NAV_ITEMS.filter((item) =>
        item.label.toLowerCase().includes(search.toLowerCase())
      );
      allItems.push(...filteredNav);
    }

    const orderItems: OrderItem[] = orders
      .filter((order) => {
        const matchesId = String(order.id).includes(search);
        const matchesPhone = order.phone_number.includes(search);
        return matchesId || matchesPhone;
      })
      .slice(0, 6)
      .map((order) => ({
        id: `order-${order.id}`,
        type: 'order' as const,
        orderId: order.id,
        phone: order.phone_number,
        status: order.status,
        statusLabel: STATUS_META[order.status].label,
        statusDot: STATUS_META[order.status].dot,
        total: order.total,
      }));

    allItems.push(...orderItems);
    return allItems;
  }, [search, orders]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      switch (e.key) {
        case 'Escape':
          setOpen(false);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < items.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (items[selectedIndex]) {
            const item = items[selectedIndex];
            if (item.type === 'nav') {
              navigate(item.path);
            } else {
              navigate(`/orders?order=${item.orderId}`);
            }
            setOpen(false);
          }
          break;
      }
    };

    if (open) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, items, selectedIndex, navigate]);

  useEffect(() => {
    const selectedElement = document.querySelector('[data-selected="true"]');
    if (selectedElement) {
      selectedElement.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    const item = items[index];
    if (item.type === 'nav') {
      navigate(item.path);
    } else {
      navigate(`/orders?order=${item.orderId}`);
    }
    setOpen(false);
  };

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/40 backdrop-blur-sm px-4"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl bg-surface border border-border rounded-card shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center gap-3 border-b border-border px-3 py-3">
          <Search className="w-5 h-5 text-ink-soft flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar pedido por numero o telefono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-ink placeholder:text-ink-soft"
          />
          <kbd
            onClick={() => setOpen(false)}
            className="text-xs text-ink-soft px-2 py-1 rounded border border-border cursor-pointer hover:bg-canvas"
          >
            ESC
          </kbd>
        </div>

        <div className="max-h-[320px] overflow-y-auto">
          {isLoading && !items.length ? (
            <div className="px-3 py-8 text-center text-sm text-ink-soft">
              Cargando pedidos...
            </div>
          ) : items.length === 0 ? (
            <div className="px-3 py-8 text-center flex flex-col items-center gap-2">
              <SearchX className="w-5 h-5 text-ink-soft" />
              <span className="text-sm text-ink-soft">Sin resultados para esa busqueda</span>
            </div>
          ) : (
            <>
              {NAV_ITEMS.some((item) =>
                items.find((i) => i.type === 'nav' && i.id === item.id)
              ) && (
                <>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft/60 px-3 py-2">
                    Navegacion
                  </div>
                  {items
                    .filter((item) => item.type === 'nav')
                    .map((item) => {
                      const itemIndex = items.indexOf(item);
                      return (
                        <div
                          key={item.id}
                          data-selected={itemIndex === selectedIndex}
                          className={cn(
                            'min-h-11 px-3 rounded-lg cursor-pointer flex items-center gap-3 mx-2 transition-colors',
                            itemIndex === selectedIndex
                              ? 'bg-brand-soft text-brand'
                              : 'text-ink hover:bg-canvas'
                          )}
                          onClick={() => handleSelect(itemIndex)}
                        >
                          {(item as NavigationItem).icon}
                          <span className="text-sm font-medium">
                            {(item as NavigationItem).label}
                          </span>
                        </div>
                      );
                    })}
                </>
              )}

              {items.some((item) => item.type === 'order') && (
                <>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft/60 px-3 py-2">
                    Pedidos
                  </div>
                  {items
                    .filter((item) => item.type === 'order')
                    .map((item) => {
                      const itemIndex = items.indexOf(item);
                      const orderItem = item as OrderItem;
                      return (
                        <div
                          key={item.id}
                          data-selected={itemIndex === selectedIndex}
                          className={cn(
                            'min-h-11 px-3 rounded-lg cursor-pointer flex items-center gap-3 mx-2 transition-colors',
                            itemIndex === selectedIndex
                              ? 'bg-brand-soft text-brand'
                              : 'text-ink hover:bg-canvas'
                          )}
                          onClick={() => handleSelect(itemIndex)}
                        >
                          <span className="font-semibold">#{orderItem.orderId}</span>
                          <span className="text-sm truncate">{formatPhone(orderItem.phone)}</span>
                          <div className="flex items-center gap-1.5 ml-auto shrink-0">
                            <div
                              className={cn('w-2 h-2 rounded-full', orderItem.statusDot)}
                            />
                            <span className="text-xs">{orderItem.statusLabel}</span>
                          </div>
                          <span className="text-sm font-medium shrink-0 w-16 text-right">
                            {formatCurrency(orderItem.total)}
                          </span>
                        </div>
                      );
                    })}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
