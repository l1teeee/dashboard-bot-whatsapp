import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { RouteFallback } from './RouteFallback';

interface RequireAuthProps {
  children: React.ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const { status } = useAuthStore();

  if (status === 'idle' || status === 'loading') {
    return <RouteFallback />;
  }

  if (status === 'anonymous') {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
