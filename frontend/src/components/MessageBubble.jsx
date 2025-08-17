import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MessageBubble({ role, text }) {
  const isUser = role === 'user';
  
  // Se o texto for um componente (como o Spinner), renderiza diretamente. Senão, passará para o ReactMarkdown.
  const content = typeof text === 'string'
    ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
    : text;

  return (
    <div className={`message-bubble ${isUser ? 'user' : 'assistant'}`}>
      <div className="role">{isUser ? 'Você' : 'Gemini'}</div>
      <div className="text-content">
        {content}
      </div>
    </div>
  );
}