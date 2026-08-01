import { useMemo } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { LayoutDashboard, History, UtensilsCrossed, LogOut, ChefHat } from 'lucide-react';
import { SidebarNav } from '@/components/ui/SidebarNav';
import { useSidebarStore } from '@/store/sidebar';
import { useOrders } from '@/hooks/useOrders';
import { useAuthStore } from '@/store/auth';
import { useConnectionStore } from '@/store/connection';
import { queryClient } from '@/api/queryClient';
import { cn } from '@/lib/cn';

export function Sidebar() {
  const navigate = useNavigate();
  const isCollapsed = useSidebarStore((s) => s.isCollapsed);
  const clearApiKey = useAuthStore((s) => s.clearApiKey);
  const isOffline = useConnectionStore((s) => s.isOffline);
  const { orders } = useOrders();

  const pendingCount = useMemo(
    () => orders.filter((o) => o.status === 'pending').length,
    [orders]
  );

  function handleLogout() {
    clearApiKey();
    queryClient.clear();
    navigate('/login', { replace: true });
  }

  const groups = [
    {
      items: [
        {
          id: 'dashboard',
          title: 'Pedidos',
          icon: LayoutDashboard,
          to: '/',
          end: true,
          badge: pendingCount > 0 ? pendingCount : undefined,
        },
        {
          id: 'orders',
          title: 'Historial',
          icon: History,
          to: '/orders',
        },
        {
          id: 'menu',
          title: 'Menu',
          icon: UtensilsCrossed,
          to: '/menu',
        },
      ],
    },
  ];

  const bottomItems = [
    {
      id: 'logout',
      title: 'Cerrar sesion',
      icon: LogOut,
      onSelect: handleLogout,
    },
  ];

  const header = (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-brand text-surface flex items-center justify-center">
        <ChefHat className="w-5 h-5" strokeWidth={1.75} />
      </div>
      <div>
        <div className="text-sm font-semibold text-ink">Panel de pedidos</div>
        <div className={cn('text-[11px]', isOffline ? 'text-cancelled' : 'text-ink-soft')}>
          {isOffline ? 'Sin conexion' : 'Conectado'}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block fixed left-0 top-0 h-screen z-30">
        <SidebarNav
          groups={groups}
          bottomItems={bottomItems}
          header={header}
          isCollapsed={isCollapsed}
        />
      </aside>

      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-surface border-t border-border z-30">
        <div className="flex items-center justify-around">
          {groups[0].items.map((item) => (
            <NavLink
              key={item.id}
              to={item.to!}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center gap-1 min-h-16 flex-1 transition-colors relative',
                  isActive
                    ? 'bg-brand-soft text-brand'
                    : 'text-ink-soft hover:bg-canvas',
                )
              }
            >
              {item.badge ? (
                <>
                  <div className="relative">
                    {item.icon && <item.icon className="w-6 h-6" strokeWidth={1.75} />}
                    <span className="absolute -top-1 -right-2 min-w-5 h-5 px-1 rounded-full bg-brand text-surface text-[11px] font-semibold flex items-center justify-center">
                      {item.badge}
                    </span>
                  </div>
                </>
              ) : (
                item.icon && <item.icon className="w-6 h-6" strokeWidth={1.75} />
              )}
              <span className="text-xs font-medium">{item.title}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
