import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';

export default function App() {
  const [user, setUser] = useState(null);

  // Efeito para carregar o usuário do localStorage na inicialização
  useEffect(() => {
    const storedUser = localStorage.getItem('chat-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Função para lidar com o login bem-sucedido
  const handleLogin = (userData) => {
    localStorage.setItem('chat-user', JSON.stringify(userData));
    setUser(userData);
  };

  // Função para lidar com o logout
  const handleLogout = () => {
    localStorage.removeItem('chat-user');
    setUser(null);
  };

  return (
    <div className="app-container">
      {user ? (
        <ChatPage user={user} onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
}
