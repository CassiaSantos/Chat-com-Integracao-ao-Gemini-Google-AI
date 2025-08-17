import React, { useState, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Spinner from 'react-bootstrap/Spinner';

export default function ChatWindow({ messages, activeConversationId, onSendMessage, isSending }) {
  const [newMessage, setNewMessage] = useState('');
  const isChatActive = activeConversationId !== null;
  const messagesEndRef = useRef(null); // Ref para o final da lista de mensagens

  // Efeito para rolar para a mensagem mais recente
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(scrollToBottom, [messages]);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage(''); // Limpa o input após o envio
    }
  };

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
        {/* Feedback visual de carregamento */}
        {isSending && (
          <MessageBubble role="assistant" text={
            <Spinner animation="border" size="sm" as="span" role="status" aria-hidden="true" />
          } />
        )}
        <div ref={messagesEndRef} /> {/* Elemento invisível para o scroll */}
      </div>

      <div className="chat-input-area">
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Form.Control
              placeholder={isChatActive ? 'Digite sua mensagem aqui...' : 'Selecione uma conversa'}
              disabled={!isChatActive || isSending} // Desabilita durante o envio
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              size="lg"
              autoComplete="off"
            />
            <Button variant="primary" type="submit" disabled={!isChatActive || isSending}>
              {isSending ? 'Enviando...' : 'Enviar'}
            </Button>
          </InputGroup>
        </Form>
      </div>
    </main>
  );
}