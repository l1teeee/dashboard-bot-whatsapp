import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AnalyticsSectionNavigator } from './AnalyticsSectionNavigator';

describe('AnalyticsSectionNavigator', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('presents the five analytic sections instead of an unlabelled widget collection', () => {
    render(<AnalyticsSectionNavigator />);

    expect(screen.getByRole('navigation', { name: /secciones de analíticas/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(5);
    expect(screen.getByRole('button', { name: /ingresos completados/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /actividad reciente/i })).toBeInTheDocument();
  });

  it('takes the user to the corresponding widget in the editable canvas', () => {
    const scrollIntoView = vi.fn();
    const widget = document.createElement('div');
    widget.dataset.widgetId = 'status-mix';
    widget.tabIndex = -1;
    widget.scrollIntoView = scrollIntoView;
    document.body.appendChild(widget);

    render(<AnalyticsSectionNavigator />);
    fireEvent.click(screen.getByRole('button', { name: /estados del lote/i }));

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    expect(widget).toHaveFocus();
    expect(screen.getByRole('button', { name: /estados del lote/i })).toHaveAttribute('aria-pressed', 'true');
  });
});
