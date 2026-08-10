import { lazy, Suspense, useEffect } from 'react';
import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { RequireAuth } from '@/components/layout/RequireAuth';
import { PublicOnly } from '@/components/layout/PublicOnly';
import { RouteFallback } from '@/components/layout/RouteFallback';
import { RouteErrorBoundary } from '@/components/layout/RouteErrorBoundary';
import { useAuthStore } from '@/store/auth';
import { refresh } from '@/api/auth';
import { isDefinitiveSessionRejection } from '@/api/client';

const LoginPage = lazy(() => import('@/pages/LoginPage').then(({ LoginPage }) => ({ default: LoginPage })));
const LandingPage = lazy(() => import('@/pages/LandingPage').then(({ LandingPage }) => ({ default: LandingPage })));
const RegisterPage = lazy(() => import('@/pages/RegisterPage').then(({ RegisterPage }) => ({ default: RegisterPage })));
const AcceptInvitePage = lazy(() => import('@/pages/AcceptInvitePage').then(({ AcceptInvitePage }) => ({ default: AcceptInvitePage })));
const DashboardPage = lazy(() => import('@/pages/DashboardPage').then(({ DashboardPage }) => ({ default: DashboardPage })));
const OrdersPage = lazy(() => import('@/pages/OrdersPage').then(({ OrdersPage }) => ({ default: OrdersPage })));
const ReservationsPage = lazy(() => import('@/pages/ReservationsPage').then(({ ReservationsPage }) => ({ default: ReservationsPage })));
const AnalyticsPage = lazy(() => import('@/pages/AnalyticsPage').then(({ AnalyticsPage }) => ({ default: AnalyticsPage })));
const MenuPage = lazy(() => import('@/pages/MenuPage').then(({ MenuPage }) => ({ default: MenuPage })));
const SettingsPage = lazy(() => import('@/pages/SettingsPage').then(({ SettingsPage }) => ({ default: SettingsPage })));

function LazyRoute({ children, fallback = 'content' }: { children: ReactNode; fallback?: 'content' | 'public' }) {
  const location = useLocation();

  return (
    <RouteErrorBoundary resetKey={location.pathname}>
      <Suspense fallback={<RouteFallback variant={fallback} />}>{children}</Suspense>
    </RouteErrorBoundary>
  );
}

// Una ruta desconocida no debe expulsar de la sesion: con sesion activa
// devuelve al panel, sin sesion a la landing.
function NotFoundRedirect() {
  const { status } = useAuthStore();

  if (status === 'idle' || status === 'loading') {
    return <RouteFallback variant="shell" />;
  }

  return <Navigate to={status === 'authenticated' ? '/dashboard' : '/'} replace />;
}

function AppWithRehydration() {
  const { status, setStatus, setSession } = useAuthStore();

  useEffect(() => {
    if (status === 'idle') {
      setStatus('loading');
      refresh()
        .then((sessionData) => {
          setSession(sessionData);
        })
        .catch((error) => {
          setStatus(
            isDefinitiveSessionRejection(error) ? 'anonymous' : 'unavailable',
          );
        });
    }
  }, [status, setStatus, setSession]);

  return (
    <Routes>
      <Route path="/" element={<LazyRoute fallback="public"><LandingPage /></LazyRoute>} />
      <Route
        path="/login"
        element={<PublicOnly><LazyRoute fallback="public"><LoginPage /></LazyRoute></PublicOnly>}
      />
      <Route
        path="/register"
        element={<PublicOnly><LazyRoute fallback="public"><RegisterPage /></LazyRoute></PublicOnly>}
      />
      <Route
        path="/accept-invite"
        element={<PublicOnly><LazyRoute fallback="public"><AcceptInvitePage /></LazyRoute></PublicOnly>}
      />
      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route path="dashboard" element={<LazyRoute><DashboardPage /></LazyRoute>} />
        <Route path="orders" element={<LazyRoute><OrdersPage /></LazyRoute>} />
        <Route path="reservations" element={<LazyRoute><ReservationsPage /></LazyRoute>} />
        <Route path="analytics" element={<LazyRoute><AnalyticsPage /></LazyRoute>} />
        <Route path="menu" element={<LazyRoute><MenuPage /></LazyRoute>} />
        <Route path="settings" element={<LazyRoute><SettingsPage /></LazyRoute>} />
      </Route>
      <Route path="*" element={<NotFoundRedirect />} />
    </Routes>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppWithRehydration />
    </BrowserRouter>
  );
}
