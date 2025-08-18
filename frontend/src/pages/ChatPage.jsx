import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import ConversationList from '../components/ConversationList';
import ChatWindow from '../components/ChatWindow';
import * as api from '../lib/api';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const socket = io(import.meta.env.VITE_WS_URL || 'http://localhost:5000');

export default function ChatPage({ user, onLogout }) {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [isSending, setIsSending] = useState(false);

  // Efeito para buscar as conversas via REST
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

  // Efeito para gerenciar os eventos de WebSocket (Refatorado para Streaming)
  useEffect(() => {
    const handleReceiveReplyChunk = ({ chunk }) => {
      setMessages(prevMessages => {
        const lastMessage = prevMessages[prevMessages.length - 1];
        // Garante que estamos atualizando a mensagem correta: do assistente
        if (lastMessage && lastMessage.role === 'assistant') {
          const updatedLastMessage = { ...lastMessage, text: lastMessage.text + chunk };
          return [...prevMessages.slice(0, -1), updatedLastMessage];
        }
        // Fallback caso algo inesperado aconteça
        return [...prevMessages, { role: 'assistant', text: chunk, _id: Date.now() }];
      });
    };
    
    const handleStreamEnd = () => {
      setIsSending(false); // Reabilita o input
    };
    
    const handleChatError = ({ error }) => {
      console.error('Erro recebido via WebSocket:', error);
      setIsSending(false); // Também para o 'sending' em caso de erro
      const errorMessage = { 
        role: 'assistant', 
        text: 'Desculpe, ocorreu um erro.', 
        _id: Date.now() + 1 
      };
      setMessages(prev => [...prev, errorMessage]);
    };

    socket.on('receiveReplyChunk', handleReceiveReplyChunk);
    socket.on('streamEnd', handleStreamEnd);
    socket.on('chatError', handleChatError);

    return () => {
      socket.off('receiveReplyChunk', handleReceiveReplyChunk);
      socket.off('streamEnd', handleStreamEnd);
      socket.off('chatError', handleChatError);
    };
  }, []); // Array de dependências vazio para rodar apenas uma vez

  // Handlers para gerenciar conversas via REST (sem mudanças)
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

  // Handler de envio de mensagem (Refatorado para Streaming)
  const handleSendMessage = (messageText) => {
    if (!activeConversationId || !messageText.trim() || isSending) return;

    const userMessage = { role: 'user', text: messageText, _id: Date.now() };
    const assistantPlaceholder = { role: 'assistant', text: '', _id: Date.now() + 1 };
    
    setMessages(prev => [...prev, userMessage, assistantPlaceholder]);
    setIsSending(true);

    socket.emit('sendMessage', {
      conversationId: activeConversationId,
      message: messageText,
      userId: user._id,
    });

    const currentConvo = conversations.find(c => c._id === activeConversationId);
    if (currentConvo && currentConvo.messages?.length === 0) {
        const updatedConversations = conversations.map(c =>
            c._id === activeConversationId ? { ...c, title: messageText.slice(0, 30) } : c
        );
        setConversations(updatedConversations);
    }
  };

  // Renderização
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
            isSending={isSending}
          />
        </Col>
      </Row>
    </Container>
  );
}