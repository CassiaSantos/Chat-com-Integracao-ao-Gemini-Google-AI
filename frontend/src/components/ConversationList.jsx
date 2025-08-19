import React from 'react';

// componentes do React-Bootstrap
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

export default function ConversationList({
  username,
  onLogout,
  items,
  activeId,
  onSelect,
  onNew,
  onDelete, // para o handler de exclusão
  loading,
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="h5 mb-0">Conversas</h2>
        <Button variant="outline-primary" size="sm" onClick={onNew}>
          + Nova
        </Button>
      </div>

      <ListGroup variant="flush" className="conversation-items">
        {loading && (
          <div className="p-3 text-center text-muted">
            <Spinner animation="border" size="sm" />
            <span className="ms-2">Carregando...</span>
          </div>
        )}
        {!loading && items.length === 0 && (
          <p className="p-3 text-center text-muted">Nenhuma conversa encontrada.</p>
        )}
        {items.map(convo => (
          <ListGroup.Item
            key={convo._id}
            action
            active={convo._id === activeId}
            onClick={() => onSelect(convo._id)}
            className="d-flex justify-content-between align-items-center text-truncate"
          >
            {convo.title}
            {/* BOTÃO DE EXCLUSÃO */}
            <Button
              variant="outline-danger"
              size="sm"
              className="delete-btn"
              onClick={(e) => {
                // Impede que o clique no botão também selecione a conversa
                e.stopPropagation(); 
                onDelete(convo._id);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
              </svg>
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>

      <div className="sidebar-footer">
        <div className="username-display">
          Logado como: <strong>{username}</strong>
        </div>
        <Button variant="secondary" size="sm" className="w-100" onClick={onLogout}>
          Sair
        </Button>
      </div>
    </aside>
  );
}