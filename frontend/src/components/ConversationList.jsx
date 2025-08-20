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
        <h2 className="h5 mb-3">Conversas 
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-chat-left-text" viewBox="0 0 16 16">
            <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
            <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>
          </svg>
        </h2>
        <Button variant="outline-primary" size="sm" onClick={onNew}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-plus-circle-fill m-1" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
          </svg> Nova Conversa
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
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
            <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
          </svg> Logado como: <strong>{username}</strong>
        </div>
        <Button variant="secondary" size="sm" className="w-100 mt-3" onClick={onLogout}>
          Sair
        </Button>
      </div>
    </aside>
  );
}