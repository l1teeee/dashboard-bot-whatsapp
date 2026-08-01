import { lazy, Suspense } from 'react';
import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { RequireAuth } from '@/components/layout/RequireAuth';
import { RouteFallback } from '@/components/layout/RouteFallback';

const LoginPage = lazy(() => import('@/pages/LoginPage').then(({ LoginPage }) => ({ default: LoginPage })));
const DashboardPage = lazy(() => import('@/pages/DashboardPage').then(({ DashboardPage }) => ({ default: DashboardPage })));
const OrdersPage = lazy(() => import('@/pages/OrdersPage').then(({ OrdersPage }) => ({ default: OrdersPage })));
const AnalyticsPage = lazy(() => import('@/pages/AnalyticsPage').then(({ AnalyticsPage }) => ({ default: AnalyticsPage })));
const MenuPage = lazy(() => import('@/pages/MenuPage').then(({ MenuPage }) => ({ default: MenuPage })));

function LazyRoute({ children }: { children: ReactNode }) {
  return <Suspense fallback={<RouteFallback />}>{children}</Suspense>;
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LazyRoute><LoginPage /></LazyRoute>} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route index element={<LazyRoute><DashboardPage /></LazyRoute>} />
          <Route path="orders" element={<LazyRoute><OrdersPage /></LazyRoute>} />
          <Route path="analytics" element={<LazyRoute><AnalyticsPage /></LazyRoute>} />
          <Route path="menu" element={<LazyRoute><MenuPage /></LazyRoute>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
