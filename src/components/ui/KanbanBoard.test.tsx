import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { KanbanBoard } from './KanbanBoard';

interface TestItem {
  id: string;
  status: string;
  label: string;
}

const columns = [
  { id: 'pending', title: 'Pendiente' },
  { id: 'completed', title: 'Completado' },
];

const items: TestItem[] = [
  { id: '1', status: 'pending', label: 'Pedido uno' },
];

describe('KanbanBoard scroll containment', () => {
  it('uses one accessible vertical scroll region per constrained column', () => {
    render(
      <KanbanBoard<TestItem>
        className="lg:h-full lg:min-h-0"
        columns={columns}
        items={items}
        getItemId={(item) => item.id}
        getItemColumn={(item) => item.status}
        renderItem={(item) => <article>{item.label}</article>}
        onDrop={vi.fn()}
        renderEmpty={() => <p>Sin pedidos</p>}
      />,
    );

    const pendingRegion = screen.getByRole('region', { name: 'Pendiente: 1 pedido' });
    const completedRegion = screen.getByRole('region', { name: 'Completado: 0 pedidos' });
    const pendingColumn = pendingRegion.closest('[data-kanban-column]');
    const board = pendingColumn?.parentElement;

    expect(pendingRegion).toHaveAttribute('data-kanban-scroll-region', 'true');
    expect(pendingRegion).toHaveAttribute('tabindex', '0');
    expect(pendingRegion).toHaveClass('overflow-y-auto', 'overscroll-contain', 'lg:min-h-0');
    expect(completedRegion).toHaveClass('overflow-y-auto', 'lg:min-h-0');
    expect(pendingColumn).toHaveClass('lg:h-full', 'lg:min-h-0');
    expect(board).toHaveClass(
      'lg:h-full',
      'lg:min-h-0',
      'lg:grid-flow-col',
      'lg:overflow-y-hidden',
      '2xl:grid-cols-4',
    );
  });
});
