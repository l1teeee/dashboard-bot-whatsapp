import { useMemo } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { ChartNoAxesCombined, ChefHat, History, LayoutDashboard, LogOut, UtensilsCrossed } from 'lucide-react';
import { SidebarNav } from '@/components/ui';
import { useSidebarStore } from '@/store/sidebar';
import { useOrders } from '@/hooks/useOrders';
import { useAuthStore } from '@/store/auth';
import { useMenuOverlayStore } from '@/store/menuOverlay';
import { queryClient } from '@/api/queryClient';
import { cn } from '@/lib/cn';

export function Sidebar() {
  const navigate = useNavigate();
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);
  const clearApiKey = useAuthStore((state) => state.clearApiKey);
  const resetMenuOverlay = useMenuOverlayStore((state) => state.reset);
  const { orders } = useOrders();
  const pendingCount = useMemo(() => orders.filter((order) => order.status === 'pending').length, [orders]);
  const logout = () => { clearApiKey(); resetMenuOverlay(); queryClient.clear(); navigate('/login', { replace: true }); };
  const items = [
    { id: 'dashboard', title: 'En vivo', icon: LayoutDashboard, to: '/', end: true, badge: pendingCount || undefined },
    { id: 'orders', title: 'Historial', icon: History, to: '/orders' },
    { id: 'analytics', title: 'Analíticas', icon: ChartNoAxesCombined, to: '/analytics' },
    { id: 'menu', title: 'Menú', icon: UtensilsCrossed, to: '/menu' },
  ];
  return <><aside className={cn('hidden shrink-0 overflow-hidden border-r border-border bg-shell transition-[width] duration-300 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none lg:block', isCollapsed ? 'w-[76px]' : 'w-[248px]')}><SidebarNav groups={[{ heading: 'Control', items }]} bottomItems={[{ id: 'logout', title: 'Cerrar sesión', icon: LogOut, onSelect: logout }]} isCollapsed={isCollapsed} header={<div className="flex items-center gap-3"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ink-dark bg-coral text-ink-dark neo-shadow"><ChefHat className="h-5 w-5"/></div><div><p className="font-display text-xl font-bold uppercase leading-none">Panel de pedidos</p><p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-ink-soft">WhatsApp Ops</p></div></div>}/></aside><nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-shell pb-[env(safe-area-inset-bottom)] lg:hidden"><div className="flex">{items.map((item) => { const Icon = item.icon; return <NavLink key={item.id} to={item.to} end={item.end} className={({ isActive }) => cn('relative flex min-h-16 flex-1 flex-col items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wide', isActive ? 'bg-mint text-ink-dark' : 'text-ink-soft')}><Icon className="h-5 w-5"/><span>{item.title}</span>{item.badge && <span className="absolute right-[27%] top-2 grid min-w-5 place-items-center rounded-full bg-coral px-1 text-[10px] text-ink-dark">{item.badge}</span>}</NavLink>; })}</div></nav></>;
}
