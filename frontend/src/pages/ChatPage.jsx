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

  // Efeito para buscar as conversas
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

  // Efeito para gerenciar os eventos de WebSocket
  useEffect(() => {
    const handleReceiveReplyChunk = ({ chunk }) => {
      setMessages(prevMessages => {
        const lastMessage = prevMessages[prevMessages.length - 1];
        if (lastMessage && lastMessage.role === 'assistant') {
          const updatedLastMessage = { ...lastMessage, text: lastMessage.text + chunk };
          return [...prevMessages.slice(0, -1), updatedLastMessage];
        }
        return prevMessages;
      });
    };
    
    // --- LÓGICA DE ATUALIZAÇÃO DO TÍTULO NO FRONTEND ---
    const handleStreamEnd = ({ newTitle }) => {
      setIsSending(false);
      // Se o backend enviou um novo título, usamos ele como a "fonte da verdade"
      // para garantir que o frontend e o backend estejam sincronizados.
      if (newTitle) {
        setConversations(prevConvos =>
          prevConvos.map(c =>
            c._id === activeConversationId ? { ...c, title: newTitle } : c
          )
        );
      }
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
  }, [activeConversationId]); // Adicionamos activeConversationId como dependência

  // Handlers para gerenciar conversas (sem mudanças)
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

  // Handler de envio de mensagem
  const handleSendMessage = (messageText) => {
    if (!activeConversationId || !messageText.trim() || isSending) return;

    // --- ATUALIZAÇÃO OTIMISTA DO TÍTULO ---
    const currentConvo = conversations.find(c => c._id === activeConversationId);
    // Verifica se a conversa atual é uma "Nova conversa" (ou seja, ainda não tem título)
    if (currentConvo && currentConvo.title === 'Nova conversa') {
      const newTitle = messageText.slice(0, 50);
      // Atualiza o estado local imediatamente para uma UI mais rápida
      setConversations(prevConvos =>
        prevConvos.map(c =>
          c._id === activeConversationId ? { ...c, title: newTitle } : c
        )
      );
    }
    // --- FIM DA ATUALIZAÇÃO OTIMISTA ---

    const userMessage = { role: 'user', text: messageText, _id: Date.now() };
    const assistantPlaceholder = { role: 'assistant', text: '', _id: Date.now() + 1 };
    
    setMessages(prev => [...prev, userMessage, assistantPlaceholder]);
    setIsSending(true);

    socket.emit('sendMessage', {
      conversationId: activeConversationId,
      message: messageText,
      userId: user._id,
    });
  };

  // Renderização (sem mudanças)
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