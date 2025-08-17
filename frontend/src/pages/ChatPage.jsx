import React, { useState, useEffect } from 'react';
import ConversationList from '../components/ConversationList';
import ChatWindow from '../components/ChatWindow';
import * as api from '../lib/api';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function ChatPage({ user, onLogout }) {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [isSending, setIsSending] = useState(false); // NOVO: Estado para feedback de carregamento

  // Efeito para buscar conversas (sem mudanças)
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const convos = await api.listConversations();
        setConversations(convos);
      } catch (error) {
        console.error('Falha ao buscar conversas', error);
      } finally {
        setLoadingConversations(false);
      }
    };
    fetchConversations();
  }, []);

  const handleSelectConversation = async (id) => {
    // ... (lógica existente, sem mudanças)
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
    // ... (lógica existente, sem mudanças)
    try {
      const newConvo = await api.createConversation();
      setConversations([newConvo, ...conversations]);
      handleSelectConversation(newConvo._id);
    } catch (error) {
      console.error('Falha ao criar nova conversa', error);
    }
  };

  // Função para lidar com o envio de mensagens
  const handleSendMessage = async (messageText) => {
    if (!activeConversationId || !messageText.trim()) return;

    // Atualização otimista: adiciona a mensagem do usuário à UI imediatamente
    const userMessage = { role: 'user', text: messageText, _id: Date.now() };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsSending(true);

    try {
      const { reply, conversationId } = await api.sendMessage({
        conversationId: activeConversationId,
        message: messageText,
      });

      // Adiciona a resposta da IA à UI
      const assistantMessage = { role: 'assistant', text: reply, _id: Date.now() + 1 };
      setMessages(prevMessages => [...prevMessages, assistantMessage]);

      // Atualiza o título da conversa na sidebar se for a primeira mensagem
      const updatedConversations = conversations.map(c =>
        c._id === conversationId ? { ...c, title: messageText.slice(0, 30) } : c
      );
      setConversations(updatedConversations);

    } catch (error) {
      console.error('Falha ao enviar mensagem:', error);
      // adicionamos uma mensagem de erro à conversa.
      const errorMessage = {
        role: 'assistant',
        text: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
        _id: Date.now() + 1
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);

    } finally {
      setIsSending(false);
    }
  };

  return (
    <Container fluid className="vh-100 p-0 d-flex flex-column">
      <Row className="g-0 flex-grow-1">
        <Col lg={3} md={4} className="d-flex flex-column sidebar-col">
          <ConversationList
            loading={loadingConversations}
            items={conversations}
            activeId={activeConversationId}
            onSelect={handleSelectConversation}
            onNew={handleNewConversation}
            username={user.username}
            onLogout={onLogout}
          />
        </Col>
        <Col lg={9} md={8} className="d-flex flex-column chat-window-col">
          <ChatWindow
            messages={messages}
            activeConversationId={activeConversationId}
            onSendMessage={handleSendMessage}
            isSending={isSending} // Passa o estado de carregamento
          />
        </Col>
      </Row>
    </Container>
  );
}