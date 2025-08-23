import React, { useState, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import { BsArrowLeft } from 'react-icons/bs'; // Importa um ícone de seta
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Spinner from 'react-bootstrap/Spinner';

export default function ChatWindow({
  messages, 
  activeConversationId, 
  onSendMessage, 
  isSending, 
  onShowListView, //prop para o handler de "voltar"
}) {

  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const isChatActive = activeConversationId !== null;

  useEffect(() => {
    // Limpa o campo de input toda vez que a conversa ativa muda.
    setNewMessage('');

    // Foca o input apenas se a conversa for nova e vazia.
    if (isChatActive && messages.length === 0) {
      inputRef.current?.focus();
    }
  }, [activeConversationId, messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const getPlaceholderText = () => {
    if (!isChatActive) {
      return 'Selecione uma conversa';
    }
    if (messages.length === 0) {
      return 'Digite seu prompt aqui...';
    }
    return 'Digite sua mensagem aqui...';
  };

  return (
    <main className="chat-window">
    {/* HEADER DO CHAT */}
      <div className="chat-header">
        {/* Botão "Voltar" que só aparece em telas pequenas (d-md-none) */}
        <Button
          variant="link"
          className="d-md-none back-button"
          onClick={onShowListView}
        >
          <BsArrowLeft size={20} />
        </Button>
        <h5 className="mb-0 text-truncate">
          {}
        </h5>
      </div>
      {/* FIM DO HEADER */}
      
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
        {isSending && (
          <MessageBubble role="assistant" text={
            <Spinner animation="border" size="sm" as="span" role="status" aria-hidden="true" />
          } />
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Form.Control
              ref={inputRef}
              placeholder={getPlaceholderText()}
              disabled={!isChatActive || isSending}
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