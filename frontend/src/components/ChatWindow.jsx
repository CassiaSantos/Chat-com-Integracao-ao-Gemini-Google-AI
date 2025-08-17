import React from 'react';
import MessageBubble from './MessageBubble';

// componentes do React-Bootstrap
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';

export default function ChatWindow({ messages, activeConversationId }) {
  const isChatActive = activeConversationId !== null;

  return (
    <main className="chat-window">
      <div className="chat-messages">
        {!isChatActive ? (
          <div className="initial-message">
            <h2>Selecione uma conversa ou inicie uma nova para começar.</h2>
          </div>
        ) : messages.length === 0 ? (
          <div className="initial-message">
            <h2>Envie uma mensagem para iniciar a conversa.</h2>
          </div>
        ) : (
          messages.map(msg => (
            <MessageBubble key={msg._id || Math.random()} role={msg.role} text={msg.text} />
          ))
        )}
      </div>

      <div className="chat-input-area">
        <InputGroup>
          <Form.Control
            placeholder={isChatActive ? 'Digite sua mensagem aqui...' : 'Selecione uma conversa'}
            disabled={!isChatActive}
            size="lg"
          />
          <Button variant="primary" disabled={!isChatActive}>
            Enviar
          </Button>
        </InputGroup>
      </div>
    </main>
  );
}