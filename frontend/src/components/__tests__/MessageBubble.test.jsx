// ferramentas necessárias:
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MessageBubble from '../MessageBubble'; // O componente a ser testado

describe('MessageBubble', () => {
  it('should render the "Você" role for the user', () => {
    // Renderiza o componente com as props necessárias para este caso de teste:
    render(<MessageBubble role="user" text="Hello" />);

    // 'screen' representa a tela virtual. 'getByText' procura por um elemento que contenha exatamente o texto "Você".
    const roleElement = screen.getByText('Você');

    // A asserção verifica se o elemento encontrado está presente no documento.
    expect(roleElement).toBeInTheDocument();
  });

  it('should render the "Gemini" role for the assistant', () => {
    render(<MessageBubble role="assistant" text="Hi there" />);
    const roleElement = screen.getByText('Gemini');
    expect(roleElement).toBeInTheDocument();
  });

  it('should display the message text correctly', () => {
    const message = 'This is a test message.';
    render(<MessageBubble role="user" text={message} />);
    
    // Verifica se o texto da mensagem em si está na tela.
    const textElement = screen.getByText(message);
    expect(textElement).toBeInTheDocument();
  });
});