import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { ChartNoAxesCombined, History, LayoutDashboard, UtensilsCrossed } from 'lucide-react';
import { SidebarNav } from './SidebarNav';

const items = [
  { id: 'live', title: 'En vivo', icon: LayoutDashboard, to: '/', end: true, badge: 2 },
  { id: 'orders', title: 'Historial', icon: History, to: '/orders' },
  { id: 'analytics', title: 'Analíticas', icon: ChartNoAxesCombined, to: '/analytics' },
  { id: 'menu', title: 'Menú', icon: UtensilsCrossed, to: '/menu' },
];

function LocationProbe() {
  return <output data-testid="location">{useLocation().pathname}</output>;
}

describe('SidebarNav', () => {
  it('uses the themed scrollbar for the scrollable navigation region', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <SidebarNav groups={[{ heading: 'Control', items }]} header={<span>Logo</span>} />
      </MemoryRouter>,
    );

    const scrollRegion = screen.getByText('Control').parentElement?.parentElement;
    expect(scrollRegion).toHaveClass('scrollbar-subtle', 'overflow-y-auto');
  });

  it('keeps every route icon accessible and navigable while collapsed', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <SidebarNav isCollapsed groups={[{ heading: 'Control', items }]} header={<span>Logo</span>} />
        <Routes><Route path="*" element={<LocationProbe />} /></Routes>
      </MemoryRouter>,
    );

    for (const item of items) {
      const link = screen.getByRole('link', { name: item.title });
      expect(link).toBeVisible();
      expect(link).toHaveClass('group', 'flex', 'min-h-11', 'text-ink');
      expect(link.querySelector('span[aria-hidden="true"]')).toHaveClass('h-5', 'w-5', 'shrink-0');
      expect(link.querySelector('svg')).toHaveClass('h-5', 'w-5');
    }
    expect(screen.getByRole('link', { name: 'En vivo' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Menú' })).toHaveAttribute('href', '/menu');

    fireEvent.click(screen.getByRole('link', { name: 'Historial' }));
    expect(screen.getByTestId('location')).toHaveTextContent('/orders');
  });
});
