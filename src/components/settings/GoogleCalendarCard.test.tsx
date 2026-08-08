import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleCalendarCard } from './GoogleCalendarCard';
import * as useGoogleIntegrationModule from '@/hooks/useGoogleIntegration';
import * as authStore from '@/store/auth';

vi.mock('@/hooks/useGoogleIntegration');
vi.mock('@/store/auth');

const mockUseGoogleIntegrationStatus = vi.fn();
const mockUseGoogleConnect = vi.fn();
const mockUseGoogleDisconnect = vi.fn();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('GoogleCalendarCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();

    vi.spyOn(useGoogleIntegrationModule, 'useGoogleIntegrationStatus').mockImplementation(
      mockUseGoogleIntegrationStatus,
    );
    vi.spyOn(useGoogleIntegrationModule, 'useGoogleConnect').mockImplementation(
      mockUseGoogleConnect,
    );
    vi.spyOn(useGoogleIntegrationModule, 'useGoogleDisconnect').mockImplementation(
      mockUseGoogleDisconnect,
    );
    vi.spyOn(authStore, 'useAuthStore').mockImplementation(
      () =>
        ({
          account: { role: 'owner' },
          tenant: null,
        }) as any,
    );
  });

  // La tarjeta no puede desaparecer en silencio cuando no hay estado: con el
  // backend caido el usuario se quedaria sin ninguna pista de que existe.
  it('ofrece reintentar cuando no se pudo consultar el estado', () => {
    const refetch = vi.fn();
    mockUseGoogleIntegrationStatus.mockReturnValue({
      status: null,
      isLoading: false,
      isError: true,
      error: new Error('boom'),
      refetch,
    });

    render(<GoogleCalendarCard />, { wrapper });

    expect(screen.getByText(/no se pudo consultar el estado/i)).toBeInTheDocument();
    screen.getByRole('button', { name: /reintentar/i }).click();
    expect(refetch).toHaveBeenCalled();
  });

  it('muestra un esqueleto mientras carga', () => {
    mockUseGoogleIntegrationStatus.mockReturnValue({
      status: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<GoogleCalendarCard />, { wrapper });

    expect(screen.getByText('Google Calendar')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /conectar/i })).not.toBeInTheDocument();
  });

  it('shows not configured message when configured is false', () => {
    mockUseGoogleIntegrationStatus.mockReturnValue({
      status: {
        configured: false,
        connected: false,
        calendar_id: null,
        connected_at: null,
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<GoogleCalendarCard />, { wrapper });

    expect(
      screen.getByText(/El administrador aun no ha configurado las credenciales/i),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Conectar Google Calendar/i)).not.toBeInTheDocument();
  });

  it('shows connect button when configured but not connected and user is owner', () => {
    mockUseGoogleIntegrationStatus.mockReturnValue({
      status: {
        configured: true,
        connected: false,
        calendar_id: null,
        connected_at: null,
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });
    mockUseGoogleConnect.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
    mockUseGoogleDisconnect.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });

    render(<GoogleCalendarCard />, { wrapper });

    expect(screen.getByText(/Conectar Google Calendar/i)).toBeInTheDocument();
  });

  it('does not show connect button when user is not owner', () => {
    vi.spyOn(authStore, 'useAuthStore').mockReturnValue({
      account: { role: 'staff' },
      tenant: null,
      accessToken: null,
      status: 'authenticated',
      setSession: vi.fn(),
      clearSession: vi.fn(),
      setStatus: vi.fn(),
    } as any);

    mockUseGoogleIntegrationStatus.mockReturnValue({
      status: {
        configured: true,
        connected: false,
        calendar_id: null,
        connected_at: null,
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });
    mockUseGoogleConnect.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
    mockUseGoogleDisconnect.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });

    render(<GoogleCalendarCard />, { wrapper });

    expect(screen.queryByText(/Conectar Google Calendar/i)).not.toBeInTheDocument();
  });

  it('shows connected state with calendar info', () => {
    mockUseGoogleIntegrationStatus.mockReturnValue({
      status: {
        configured: true,
        connected: true,
        calendar_id: 'primary',
        connected_at: '2025-08-08T10:00:00Z',
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });
    mockUseGoogleConnect.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
    mockUseGoogleDisconnect.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });

    render(<GoogleCalendarCard />, { wrapper });

    expect(screen.getByText('Conectado')).toBeInTheDocument();
    expect(screen.getByText('primary')).toBeInTheDocument();
    expect(screen.getByText('Desconectar')).toBeInTheDocument();
  });

  it('opens disconnect confirmation dialog', async () => {
    const user = userEvent.setup();

    mockUseGoogleIntegrationStatus.mockReturnValue({
      status: {
        configured: true,
        connected: true,
        calendar_id: 'primary',
        connected_at: '2025-08-08T10:00:00Z',
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });
    mockUseGoogleDisconnect.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });

    render(<GoogleCalendarCard />, { wrapper });

    const disconnectBtn = screen.getByText(/Desconectar/);
    await user.click(disconnectBtn);

    expect(
      screen.getByText(/Si desconectas Google Calendar/i),
    ).toBeInTheDocument();
  });
});
