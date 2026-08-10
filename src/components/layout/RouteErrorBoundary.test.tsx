import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RouteErrorBoundary } from './RouteErrorBoundary';

function RouteContent({ fails }: { fails: boolean }) {
  if (fails) throw new Error('lazy chunk unavailable');
  return <p>Sección disponible</p>;
}

describe('RouteErrorBoundary', () => {
  it('shows a recoverable fallback and clears it when navigation changes route', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const { rerender } = render(
      <RouteErrorBoundary resetKey="/analytics">
        <RouteContent fails />
      </RouteErrorBoundary>,
    );

    expect(screen.getByRole('heading', { name: /no pudimos abrir esta sección/i })).toBeInTheDocument();

    rerender(
      <RouteErrorBoundary resetKey="/orders">
        <RouteContent fails={false} />
      </RouteErrorBoundary>,
    );

    expect(screen.getByText('Sección disponible')).toBeInTheDocument();
    consoleError.mockRestore();
  });
});
