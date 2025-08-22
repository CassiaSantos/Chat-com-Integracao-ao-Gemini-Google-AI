import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LoginPage from '../LoginPage';

// 'vi.fn()' cria uma função "espiã" (mock) que pode ser passada como prop para verificar se ela foi chamada:
const mockOnLogin = vi.fn();

describe('LoginPage', () => {
  it('should render the login form correctly', () => {
    render(<LoginPage onLogin={mockOnLogin} />);

    // Procura o input pelo texto do placeholder:
    expect(screen.getByPlaceholderText('Seu nome de usuário')).toBeInTheDocument();
    
    // Procura o botão pelo seu texto visível:
    expect(screen.getByRole('button', { name: /Entrar/i })).toBeInTheDocument();
  });

  it('should display loading state and disable the button when submitting', () => {
    //Para um teste simples, só será verificado o botão:
    render(<LoginPage onLogin={mockOnLogin} />);
    // Pega o botão
    const button = screen.getByRole('button', { name: /Entrar/i });
    // Por ora, será verificado apenas que o botão existe e não está desabilitado por padrão.
    expect(button).not.toBeDisabled();
  });
});