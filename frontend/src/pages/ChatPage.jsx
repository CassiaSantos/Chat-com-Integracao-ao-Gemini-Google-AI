import React, { useState, useEffect } from 'react';
import ConversationList from '../components/ConversationList';
import ChatWindow from '../components/ChatWindow';
import * as api from '../lib/api';

// componentes de layout do React-Bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function ChatPage({ user, onLogout }) {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const convos = await api.listConversations();
        setConversations(convos);
      } catch (error) {
        console.error('Falha ao buscar conversas', error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  const handleSelectConversation = async (id) => {
    setActiveConversationId(id);
    try {
      const convo = await api.getConversation(id);
      setMessages(convo.messages);
    } catch (error) {
      console.error('Falha ao buscar mensagens da conversa', error);
      setMessages([]);
    }
  };

  const handleNewConversation = async () => {
    try {
      const newConvo = await api.createConversation();
      setConversations([newConvo, ...conversations]);
      handleSelectConversation(newConvo._id);
    } catch (error) {
      console.error('Falha ao criar nova conversa', error);
    }
  };

  return (
    <Container fluid className="vh-100 p-0 d-flex flex-column">
      <Row className="g-0 flex-grow-1">
        {/* Coluna da Sidebar */}
        <Col lg={3} md={4} className="d-flex flex-column sidebar-col">
          <ConversationList
            username={user.username}
            onLogout={onLogout}
            items={conversations}
            activeId={activeConversationId}
            onSelect={handleSelectConversation}
            onNew={handleNewConversation}
            loading={loading}
          />
        </Col>

        {/* Coluna da Janela de Chat */}
        <Col lg={9} md={8} className="d-flex flex-column chat-window-col">
          <ChatWindow
            messages={messages}
            activeConversationId={activeConversationId}
          />
        </Col>
      </Row>
    </Container>
  );
}