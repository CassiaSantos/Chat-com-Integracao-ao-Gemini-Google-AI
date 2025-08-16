import React from 'react';
export default function MessageBubble({ role, text }) {
  const isUser = role === 'user';
  return (
    <div className={`message-bubble ${isUser ? 'user' : 'assistant'}`}>
      <div className="role">{isUser ? 'Você' : 'Gemini'}</div>
      <div className="text">{text}</div>
    </div>
  );
}