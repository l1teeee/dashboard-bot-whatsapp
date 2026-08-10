import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RouteFallback } from './RouteFallback';

describe('RouteFallback', () => {
  it('renders a complete dashboard shell while an authenticated session is restored', () => {
    render(<RouteFallback variant="shell" />);

    expect(screen.getByRole('status', { name: /restaurando panel/i })).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByTestId('route-fallback-shell')).toBeInTheDocument();
    expect(screen.getByTestId('route-fallback-content')).toBeInTheDocument();
    expect(screen.queryByTestId('route-fallback-public')).not.toBeInTheDocument();
  });

  it('renders only the dashboard content placeholder for lazy private routes', () => {
    render(<RouteFallback />);

    expect(screen.getByRole('status', { name: /cargando sección/i })).toBeInTheDocument();
    expect(screen.getByTestId('route-fallback-content')).toBeInTheDocument();
    expect(screen.queryByTestId('route-fallback-shell')).not.toBeInTheDocument();
  });

  it('keeps public-route loading independent from the protected dashboard shell', () => {
    render(<RouteFallback variant="public" />);

    expect(screen.getByTestId('route-fallback-public')).toBeInTheDocument();
    expect(screen.queryByTestId('route-fallback-shell')).not.toBeInTheDocument();
  });
});
