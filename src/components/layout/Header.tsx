import { useLocation, useNavigate } from 'react-router-dom';
import { PanelLeftClose, PanelLeftOpen, Search, MoreHorizontal, LogOut } from 'lucide-react';
import { useConnectionStore } from '@/store/connection';
import { useAuthStore } from '@/store/auth';
import { useSidebarStore } from '@/store/sidebar';
import { useMenuOverlayStore } from '@/store/menuOverlay';
import { queryClient } from '@/api/queryClient';
import { DropdownMenu, DropdownMenuItem, IconButton } from '@/components/ui';
import { cn } from '@/lib/cn';

const titles: Record<string, { crumb: string; title: string }> = {
  '/': { crumb: 'Pedidos', title: 'En vivo' },
  '/orders': { crumb: 'Registro', title: 'Historial' },
  '/analytics': { crumb: 'Analíticas', title: 'Resumen operativo' },
  '/menu': { crumb: 'Catálogo', title: 'Menú' },
};

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const offline = useConnectionStore((state) => state.isOffline);
  const collapsed = useSidebarStore((state) => state.isCollapsed);
  const toggle = useSidebarStore((state) => state.toggle);
  const clearApiKey = useAuthStore((state) => state.clearApiKey);
  const resetMenuOverlay = useMenuOverlayStore((state) => state.reset);
  const section = titles[location.pathname] || titles['/'];
  const logout = () => {
    clearApiKey();
    resetMenuOverlay();
    queryClient.clear();
    navigate('/login', { replace: true });
  };
  const openSearch = () => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
  return <header className="flex min-h-[76px] items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-6"><div className="flex min-w-0 items-center gap-3"><IconButton className="hidden lg:grid" onClick={toggle} aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}>{collapsed ? <PanelLeftOpen className="h-5 w-5"/> : <PanelLeftClose className="h-5 w-5"/>}</IconButton><div><p className="kicker text-ink-soft">{section.crumb}</p><h2 className="font-display text-2xl font-bold uppercase leading-none">{section.title}</h2></div></div><div className="flex items-center gap-2"><button onClick={openSearch} className="focus-ring flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface px-3 text-sm font-bold text-ink hover:bg-surface-raised"><Search className="h-4 w-4"/><span className="hidden md:inline">Buscar</span><kbd className="hidden rounded bg-shell px-1.5 py-0.5 text-[10px] text-ink-soft lg:inline">⌘K</kbd></button><div className={cn('hidden items-center gap-2 rounded-full border border-border px-3 py-2 text-xs font-bold sm:flex', offline ? 'text-coral' : 'text-mint')}><span className={cn('h-2 w-2 rounded-full', offline ? 'bg-coral' : 'bg-mint')}/>{offline ? 'Sin conexión' : 'En línea'}</div><DropdownMenu trigger={<IconButton aria-label="Opciones"><MoreHorizontal className="h-5 w-5"/></IconButton>}><DropdownMenuItem onSelect={logout}><LogOut className="mr-2 h-4 w-4"/>Cerrar sesión</DropdownMenuItem></DropdownMenu></div></header>;
}
