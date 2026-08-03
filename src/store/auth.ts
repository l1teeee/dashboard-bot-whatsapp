import { create } from 'zustand';
import type { Account, TenantSummary, SessionData } from '@/types/api';

interface AuthState {
  accessToken: string | null;
  account: Account | null;
  tenant: TenantSummary | null;
  status: 'idle' | 'loading' | 'authenticated' | 'anonymous';
  setSession: (data: SessionData) => void;
  clearSession: () => void;
  setStatus: (status: AuthState['status']) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  account: null,
  tenant: null,
  status: 'idle',
  setSession: (data: SessionData) =>
    set({
      accessToken: data.access_token,
      account: data.account,
      tenant: data.tenant,
      status: 'authenticated',
    }),
  clearSession: () =>
    set({
      accessToken: null,
      account: null,
      tenant: null,
      status: 'anonymous',
    }),
  setStatus: (status) => set({ status }),
}));
