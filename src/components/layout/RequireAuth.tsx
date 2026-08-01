import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';

interface RequireAuthProps {
  children: React.ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const apiKey = useAuthStore((s) => s.apiKey);

  if (!apiKey) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
