import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from './App';
import { useAuthStore } from '@/store/auth';

describe('public and protected routes', () => {
  beforeEach(() => {
    useAuthStore.getState().clearSession();
    window.history.replaceState({}, '', '/');
  });

  it('sends anonymous visitors from the root route to the login', async () => {
    render(<App />);
    expect(await screen.findByRole('heading', { name: /acceso operativo/i })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/login');
  });

  it('keeps the operational dashboard protected', async () => {
    window.history.replaceState({}, '', '/dashboard');
    render(<App />);
    expect(await screen.findByRole('heading', { name: /acceso operativo/i })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/login');
  });
});
