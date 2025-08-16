import React, { useState } from 'react';
import { loginUser } from '../lib/api';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Por favor, insira um nome de usuário.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const userData = await loginUser(username);
      onLogin(userData); // Chama a função do App.jsx para atualizar o estado
    } catch (err) {
      setError('Falha ao fazer login. Tente novamente.');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>Bem-vindo ao Chat Gemini</h1>
        <p>Para começar, digite seu nome de usuário abaixo.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Seu nome de usuário"
            disabled={isLoading}
            autoFocus
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
}