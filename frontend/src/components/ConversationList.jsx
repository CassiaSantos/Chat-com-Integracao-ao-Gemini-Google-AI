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
            className="text-truncate"
          >
            {convo.title}
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