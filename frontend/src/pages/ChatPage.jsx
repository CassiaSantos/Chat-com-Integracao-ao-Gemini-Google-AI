import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import ConversationList from '../components/ConversationList';
import ChatWindow from '../components/ChatWindow';
import * as api from '../lib/api';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const socket = io(import.meta.env.VITE_WS_URL || 'http://localhost:5000');

export default function ChatPage({ user, onLogout }) {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState(null);
  const [mobileView, setMobileView] = useState('list');

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

  // Efeito para gerenciar os eventos de WebSocket, agora com a dependência correta.
  useEffect(() => {
    const handleReceiveReplyChunk = ({ chunk }) => {
      // Usamos a forma funcional de setState (prev => ...) para evitar dependências.
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.role === 'assistant') {
          const updatedLastMessage = { ...lastMessage, text: lastMessage.text + chunk };
          return [...prev.slice(0, -1), updatedLastMessage];
        }
        return prev;
      });
    };
    
    const handleStreamEnd = ({ newTitle }) => {
      setIsSending(false);
      if (newTitle && activeConversationId) {
        setConversations(prevConvos =>
          prevConvos.map(c =>
            c._id === activeConversationId ? { ...c, title: newTitle } : c
          )
        );
      }
    };
    
    const handleChatError = ({ error }) => {
      console.error('Erro recebido via WebSocket:', error);
      setIsSending(false);
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
    // O array de dependências vazio [] garante que os ouvintes sejam configurados
    // apenas uma vez, evitando o bug.
  }, [activeConversationId]); // Mantemos activeConversationId aqui para garantir que a lógica do newTitle funcione corretamente

  const handleSelectConversation = async (id) => {
    setActiveConversationId(id);
    try {
      const convo = await api.getConversation(id);
      setMessages(convo.messages);
      setMobileView('chat');
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
  
  const handleShowListView = () => {
    setMobileView('list');
  };

  const handleSendMessage = (messageText) => {
    if (!activeConversationId || !messageText.trim() || isSending) return;
    
    const currentConvo = conversations.find(c => c._id === activeConversationId);
    
    // ATUALIZAÇÃO OTIMISTA DO TÍTULO (COM TRUNCAMENTO)
    if (currentConvo && currentConvo.title === 'Nova conversa') {
      let newTitle;
      // Replica a mesma lógica de truncamento do backend
      if (messageText.length > 30) {
        newTitle = messageText.slice(0, 30) + '...';
      } else {
        newTitle = messageText;
      }
      
      setConversations(prevConvos =>
        prevConvos.map(c =>
          c._id === activeConversationId ? { ...c, title: newTitle } : c
        )
      );
    }

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
  
  const handleDeleteRequest = (id) => {
    setConversationToDelete(id);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setConversationToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!conversationToDelete) return;

    try {
      await api.deleteConversation(conversationToDelete);
      setConversations(prev => prev.filter(c => c._id !== conversationToDelete));
      if (activeConversationId === conversationToDelete) {
        setActiveConversationId(null);
        setMessages([]);
        setMobileView('list'); // Retorna para a lista se a conversa ativa for excluída
      }
    } catch (error) {
      console.error('Falha ao excluir conversa', error);
    } finally {
      handleCloseDeleteModal();
    }
  };

  return (
    <>
      <Container fluid className="vh-100 p-0 d-flex flex-column">
        <Row className={`g-0 flex-grow-1 ${mobileView === 'chat' ? 'show-chat-view' : ''}`}>
          <Col md={4} lg={3} className="d-flex flex-column sidebar-col">
            <ConversationList
              loading={loadingConversations}
              items={conversations}
              activeId={activeConversationId}
              onSelect={handleSelectConversation}
              onNew={handleNewConversation}
              onDelete={handleDeleteRequest}
              username={user.username}
              onLogout={onLogout}
            />
          </Col>
          <Col md={8} lg={9} className="d-flex flex-column chat-window-col">
            <ChatWindow
              messages={messages}
              activeConversationId={activeConversationId}
              onSendMessage={handleSendMessage}
              isSending={isSending}
              onShowListView={handleShowListView}
            />
          </Col>
        </Row>
      </Container>

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Você tem certeza que deseja excluir esta conversa? Esta ação não pode ser desfeita.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}