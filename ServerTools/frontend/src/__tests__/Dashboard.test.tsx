import { render, screen } from '@testing-library/react';
import Dashboard from '../Dashboard';

// Mock do global fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ status: 'stopped' })
  })
);

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar o titulo corretamente', () => {
    render(<Dashboard />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Status do Servidor')).toBeInTheDocument();
    expect(screen.getByText('Backup do Mundo')).toBeInTheDocument();
  });
  
  it('deve renderizar todos os botoes de controle', () => {
    render(<Dashboard />);
    const buttons = screen.getAllByRole('button');
    // Iniciar, Parar, Reiniciar, Criar Backup
    expect(buttons.length).toBe(4);
  });
});
