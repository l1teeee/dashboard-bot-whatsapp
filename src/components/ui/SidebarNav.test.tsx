import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { ChartNoAxesCombined, History, LayoutDashboard, UtensilsCrossed } from 'lucide-react';
import { SidebarNav } from './SidebarNav';

const items = [
  { id: 'live', title: 'En vivo', icon: LayoutDashboard, to: '/', end: true },
  { id: 'orders', title: 'Historial', icon: History, to: '/orders' },
  { id: 'analytics', title: 'Analíticas', icon: ChartNoAxesCombined, to: '/analytics' },
  { id: 'menu', title: 'Menú', icon: UtensilsCrossed, to: '/menu' },
];

function LocationProbe() {
  return <output data-testid="location">{useLocation().pathname}</output>;
}

describe('SidebarNav', () => {
  it('keeps every route icon accessible and navigable while collapsed', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <SidebarNav isCollapsed groups={[{ heading: 'Control', items }]} header={<span>Logo</span>} />
        <Routes><Route path="*" element={<LocationProbe />} /></Routes>
      </MemoryRouter>,
    );

    for (const item of items) expect(screen.getByRole('link', { name: item.title })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Menú' })).toHaveAttribute('href', '/menu');

    fireEvent.click(screen.getByRole('link', { name: 'Historial' }));
    expect(screen.getByTestId('location')).toHaveTextContent('/orders');
  });
});
