import React from 'react';

export default function ChatWindow() {
  return (
    <main className="chat-window">
      <div className="chat-messages">
        <div className="initial-message">
          <h2>Selecione uma conversa ou inicie uma nova para começar.</h2>
        </div>
      </div>
      <div className="chat-input-area">
        <input
          type="text"
          placeholder="Digite sua mensagem aqui..."
          disabled
        />
        <button disabled>Enviar</button>
      </div>
    </main>
  );
}