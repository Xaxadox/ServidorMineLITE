import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Dashboard from '../Dashboard';

// Mock do global fetch
global.fetch = vi.fn((url: string) => {
  if (url.includes('/backups')) {
    return Promise.resolve({
      json: () => Promise.resolve([])
    });
  }
  return Promise.resolve({
    json: () => Promise.resolve({ status: 'stopped' })
  });
}) as any;

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar o titulo corretamente', async () => {
    render(<Dashboard />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Status do Servidor')).toBeInTheDocument();
    expect(screen.getByText('Backup do Mundo')).toBeInTheDocument();

    // Aguarda resolucao assincrona
    await waitFor(() => {
      expect(screen.getByText('Offline')).toBeInTheDocument();
    });
  });
  
  it('deve renderizar todos os botoes de controle', async () => {
    render(<Dashboard />);
    
    // Usar waitFor para garantir que o componente montou completamente e os efeitos rodaram
    await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBe(4);
    });
  });
});
