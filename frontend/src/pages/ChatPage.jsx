import React from 'react';
import ConversationList from '../components/ConversationList';
import ChatWindow from '../components/ChatWindow';

export default function ChatPage({ user, onLogout }) {
  return (
    <div className="chat-container">
      <ConversationList onLogout={onLogout} username={user.username} />
      <ChatWindow />
    </div>
  );
}