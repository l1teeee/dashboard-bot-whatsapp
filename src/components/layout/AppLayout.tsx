import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { ConnectionBanner } from './ConnectionBanner';
import { Header } from './Header';
import { CommandPalette } from './CommandPalette';
import { useSidebarStore } from '@/store/sidebar';
import { cn } from '@/lib/cn';

export function AppLayout() {
  const isCollapsed = useSidebarStore((s) => s.isCollapsed);

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar />
      <CommandPalette />

      <div
        className={cn(
          'flex flex-col min-h-screen transition-[margin] duration-300 ease-in-out',
          isCollapsed ? 'lg:ml-16' : 'lg:ml-60'
        )}
      >
        <ConnectionBanner />
        <Header />

        <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
