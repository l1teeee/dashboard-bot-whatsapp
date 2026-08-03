import { lazy, Suspense, useEffect } from 'react';
import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { RequireAuth } from '@/components/layout/RequireAuth';
import { RouteFallback } from '@/components/layout/RouteFallback';
import { useAuthStore } from '@/store/auth';
import { refresh } from '@/api/auth';

const LoginPage = lazy(() => import('@/pages/LoginPage').then(({ LoginPage }) => ({ default: LoginPage })));
const LandingPage = lazy(() => import('@/pages/LandingPage').then(({ LandingPage }) => ({ default: LandingPage })));
const RegisterPage = lazy(() => import('@/pages/RegisterPage').then(({ RegisterPage }) => ({ default: RegisterPage })));
const AcceptInvitePage = lazy(() => import('@/pages/AcceptInvitePage').then(({ AcceptInvitePage }) => ({ default: AcceptInvitePage })));
const DashboardPage = lazy(() => import('@/pages/DashboardPage').then(({ DashboardPage }) => ({ default: DashboardPage })));
const OrdersPage = lazy(() => import('@/pages/OrdersPage').then(({ OrdersPage }) => ({ default: OrdersPage })));
const AnalyticsPage = lazy(() => import('@/pages/AnalyticsPage').then(({ AnalyticsPage }) => ({ default: AnalyticsPage })));
const MenuPage = lazy(() => import('@/pages/MenuPage').then(({ MenuPage }) => ({ default: MenuPage })));
const SettingsPage = lazy(() => import('@/pages/SettingsPage').then(({ SettingsPage }) => ({ default: SettingsPage })));

function LazyRoute({ children }: { children: ReactNode }) {
  return <Suspense fallback={<RouteFallback />}>{children}</Suspense>;
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
        .catch(() => {
          setStatus('anonymous');
        });
    }
  }, [status, setStatus, setSession]);

  return (
    <Routes>
      <Route path="/" element={<LazyRoute><LandingPage /></LazyRoute>} />
      <Route path="/login" element={<LazyRoute><LoginPage /></LazyRoute>} />
      <Route path="/register" element={<LazyRoute><RegisterPage /></LazyRoute>} />
      <Route path="/accept-invite" element={<LazyRoute><AcceptInvitePage /></LazyRoute>} />
      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route path="dashboard" element={<LazyRoute><DashboardPage /></LazyRoute>} />
        <Route path="orders" element={<LazyRoute><OrdersPage /></LazyRoute>} />
        <Route path="analytics" element={<LazyRoute><AnalyticsPage /></LazyRoute>} />
        <Route path="menu" element={<LazyRoute><MenuPage /></LazyRoute>} />
        <Route path="settings" element={<LazyRoute><SettingsPage /></LazyRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
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
