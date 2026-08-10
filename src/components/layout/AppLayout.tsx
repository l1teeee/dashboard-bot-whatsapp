import { Outlet, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { Sidebar } from './Sidebar';
import { ConnectionBanner } from './ConnectionBanner';
import { Header } from './Header';
import { CommandPalette } from './CommandPalette';

export function AppLayout() {
  const location = useLocation();
  const reducedMotion = useReducedMotion();
  const isLiveDashboard = location.pathname === '/dashboard';
  const transition = reducedMotion ? { duration: 0 } : { duration: 0.18, ease: [0.22, 1, 0.36, 1] as const };
  const initial = reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 };

  return (
    <div className="min-h-dvh bg-canvas p-0 lg:h-dvh lg:min-h-0 lg:overflow-hidden lg:p-5">
      <div className="flex min-h-dvh w-full overflow-hidden bg-shell lg:h-full lg:min-h-0 lg:rounded-[38px] lg:border lg:border-ink-dark lg:neo-shadow">
        <Sidebar />
        <div className="min-w-0 flex-1 lg:flex lg:min-h-0 lg:flex-col lg:overflow-hidden">
          <CommandPalette />
          <Header />
          <ConnectionBanner />
          <main
            className={cn(
              'w-full p-4 pb-28 sm:p-6 lg:min-h-0 lg:flex-1 lg:overscroll-contain lg:p-8 lg:pb-8',
              isLiveDashboard
                ? 'lg:flex lg:flex-col lg:overflow-hidden'
                : 'lg:overflow-y-auto lg:scrollbar-subtle',
            )}
          >
            <motion.div
              key={location.pathname}
              data-testid="route-transition"
              initial={initial}
              animate={{ opacity: 1, y: 0 }}
              transition={transition}
              className={cn(
                'w-full',
                isLiveDashboard && 'lg:flex lg:min-h-0 lg:flex-1 lg:flex-col lg:overflow-hidden',
              )}
            >
              <Outlet />
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
