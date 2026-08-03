import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { LandingPage } from './LandingPage';

describe('LandingPage', () => {
  it('presents the complete product story and auth entry points', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { level: 1, name: /pedidos claros.*cocina en movimiento/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /del chat a la cocina/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /la operación completa/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /todo lo importante/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /lo esencial, bien explicado/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /entrar al panel/i })).toHaveAttribute('href', '/login');
    expect(screen.getByRole('link', { name: /comenzar ahora/i })).toHaveAttribute('href', '/register');
  });

  it('uses a full-width page shell without a capped container', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );

    const shell = screen.getByTestId('landing-page');
    expect(shell).toHaveClass('w-full');
    expect(shell.className).not.toMatch(/max-w-|mx-auto|\bp-[0-9]/);
  });
});
