import { useLocation, useNavigate } from 'react-router-dom';
import { PanelLeftClose, PanelLeftOpen, Search } from 'lucide-react';
import { useConnectionStore } from '@/store/connection';
import { useAuthStore } from '@/store/auth';
import { useSidebarStore } from '@/store/sidebar';
import { queryClient } from '@/api/queryClient';
import { Button } from '@/components/ui';
import { cn } from '@/lib/cn';

const SECTION_TITLES: Record<string, string> = {
  '/': 'Pedidos en curso',
  '/orders': 'Todos los pedidos',
  '/menu': 'Menu',
};

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isOffline = useConnectionStore((s) => s.isOffline);
  const clearApiKey = useAuthStore((s) => s.clearApiKey);
  const isCollapsed = useSidebarStore((s) => s.isCollapsed);
  const toggle = useSidebarStore((s) => s.toggle);

  const sectionTitle = SECTION_TITLES[location.pathname] || 'Panel de pedidos';

  function handleLogout() {
    clearApiKey();
    queryClient.clear();
    navigate('/login', { replace: true });
  }

  function openCommandPalette() {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
  }

  return (
    <header className="sticky top-0 z-40 bg-surface border-b border-border">
      <div className="px-4 lg:px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={toggle}
            className="hidden lg:inline-flex p-2 rounded-lg text-ink-soft hover:bg-canvas hover:text-ink transition-colors"
            aria-label={isCollapsed ? 'Expandir menu' : 'Colapsar menu'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-5 h-5" strokeWidth={1.75} />
            ) : (
              <PanelLeftClose className="w-5 h-5" strokeWidth={1.75} />
            )}
          </button>
          <h1 className="text-lg font-semibold text-ink truncate">{sectionTitle}</h1>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          <button
            onClick={openCommandPalette}
            className="hidden md:flex items-center gap-2 h-9 px-3 rounded-lg border border-border bg-canvas text-ink-soft hover:bg-surface transition-colors"
            aria-label="Buscar pedido"
          >
            <Search className="w-4 h-4" strokeWidth={1.75} />
            <span className="text-sm">Buscar pedido...</span>
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-border bg-surface">
              Ctrl K
            </kbd>
          </button>

          <div className="flex items-center gap-2">
            <div
              className={cn(
                'w-2 h-2 rounded-full',
                isOffline ? 'bg-cancelled' : 'bg-completed'
              )}
            />
            <span className="text-sm text-ink-soft">
              {isOffline ? 'Sin conexion' : 'Conectado'}
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
          >
            Cerrar sesion
          </Button>
        </div>
      </div>
    </header>
  );
}
