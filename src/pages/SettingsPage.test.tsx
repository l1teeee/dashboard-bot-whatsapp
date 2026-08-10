import { render, screen, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { SettingsPage } from './SettingsPage';

vi.mock('@/store/auth', () => ({
  useAuthStore: () => ({
    account: { id: 1, name: 'Julian', email: 'ops@example.com', role: 'owner' },
    tenant: { id: 1, name: 'Restaurante Costa' },
  }),
}));

vi.mock('@/api/auth', () => ({
  getSettings: vi.fn().mockResolvedValue({ name: 'Restaurante Costa' }),
  updateSettings: vi.fn().mockResolvedValue({}),
  changePassword: vi.fn().mockResolvedValue({}),
  getTeam: vi.fn().mockResolvedValue({ members: [], invitations: [] }),
  createInvitation: vi.fn().mockResolvedValue({}),
  revokeInvitation: vi.fn().mockResolvedValue({}),
  updateMemberStatus: vi.fn().mockResolvedValue({}),
}));

vi.mock('@/components/settings/GoogleCalendarCard', () => ({
  GoogleCalendarCard: () => <section>Google Calendar</section>,
}));

describe('SettingsPage', () => {
  it('presenta Configuración y Seguridad en la misma fila de escritorio', () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <SettingsPage />
        </QueryClientProvider>
      </MemoryRouter>,
    );

    const primaryGrid = screen.getByTestId('primary-settings-grid');
    expect(primaryGrid).toHaveClass('grid', 'items-start', 'xl:grid-cols-2');
    expect(within(primaryGrid).getByRole('heading', { name: 'Restaurante' })).toBeInTheDocument();
    expect(within(primaryGrid).getByRole('heading', { name: 'Cambiar contraseña' })).toBeInTheDocument();
  });
});
