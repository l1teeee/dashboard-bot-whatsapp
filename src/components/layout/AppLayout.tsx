import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Sidebar } from './Sidebar'; import { ConnectionBanner } from './ConnectionBanner'; import { Header } from './Header'; import { CommandPalette } from './CommandPalette';
export function AppLayout() {
  const location = useLocation();
  const reducedMotion = useReducedMotion();
  const transition = reducedMotion ? { duration: 0 } : { duration: 0.18, ease: [0.22, 1, 0.36, 1] as const };
  const initial = reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 };
  const exit = reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -5 };

  return <div className="min-h-dvh bg-canvas p-0 lg:p-5"><div className="flex min-h-dvh w-full overflow-hidden bg-shell lg:min-h-[calc(100dvh-40px)] lg:rounded-[38px] lg:border lg:border-ink-dark lg:neo-shadow"><Sidebar/><div className="min-w-0 flex-1"><CommandPalette/><Header/><ConnectionBanner/><main className="min-h-full w-full p-4 pb-28 sm:p-6 lg:p-8 lg:pb-8"><AnimatePresence initial={false} mode="wait"><motion.div key={location.pathname} data-testid="route-transition" initial={initial} animate={{ opacity: 1, y: 0 }} exit={exit} transition={transition}><Outlet/></motion.div></AnimatePresence></main></div></div></div>;
}
