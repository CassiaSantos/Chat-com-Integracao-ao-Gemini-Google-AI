import React from 'react';

export default function ConversationList({ onLogout, username }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Conversas</h2>
        <button className="new-chat-btn">+ Nova Conversa</button>
      </div>
      <div className="conversation-items">
        {/* A lista de conversas será carregada aqui */}
        <p style={{ padding: '0 1rem', color: '#ccc' }}>Carregando...</p>
      </div>
      <div className="sidebar-footer">
        <div className="username-display">Logado como: <strong>{username}</strong></div>
        <button onClick={onLogout} className="logout-btn">Sair</button>
      </div>
    </aside>
  );
}