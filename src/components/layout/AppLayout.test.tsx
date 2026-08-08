import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { AppLayout } from './AppLayout';

vi.mock('./Sidebar', () => ({ Sidebar: () => <aside data-testid="sidebar" /> }));
vi.mock('./Header', () => ({ Header: () => <header data-testid="header" /> }));
vi.mock('./ConnectionBanner', () => ({ ConnectionBanner: () => null }));
vi.mock('./CommandPalette', () => ({ CommandPalette: () => null }));

function renderAt(path: '/dashboard' | '/orders') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<div>Dashboard</div>} />
          <Route path="/orders" element={<div>Pedidos</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe('AppLayout viewport containment', () => {
  it('contains the live dashboard in the desktop viewport', () => {
    renderAt('/dashboard');

    const main = screen.getByRole('main');
    const contentColumn = main.parentElement;
    const shell = contentColumn?.parentElement;
    const viewport = shell?.parentElement;

    expect(viewport).toHaveClass('lg:h-dvh', 'lg:overflow-hidden');
    expect(shell).toHaveClass('lg:h-full', 'lg:min-h-0');
    expect(contentColumn).toHaveClass('lg:flex', 'lg:min-h-0', 'lg:flex-col', 'lg:overflow-hidden');
    expect(main).toHaveClass('lg:flex-1', 'lg:overflow-hidden');
    expect(screen.getByTestId('route-transition')).toHaveClass('lg:flex-1', 'lg:overflow-hidden');
  });

  it('keeps other dashboard pages scrollable inside the shell', () => {
    renderAt('/orders');

    const main = screen.getByRole('main');
    expect(main).toHaveClass('lg:flex-1', 'lg:overflow-y-auto', 'lg:scrollbar-subtle');
    expect(main).not.toHaveClass('lg:overflow-hidden');
  });
});
