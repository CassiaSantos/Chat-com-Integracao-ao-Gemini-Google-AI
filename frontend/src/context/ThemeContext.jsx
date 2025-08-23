import React, { createContext, useState, useContext, useEffect } from 'react';
import { updateUserTheme } from '../lib/api';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children, initialTheme }) => {
  const [theme, setTheme] = useState(initialTheme || 'dark');

  // Aplica o tema ao body sempre que o estado 'theme' muda.
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  // Sincroniza o estado interno com a prop que vem do App.jsx
  useEffect(() => {
    if (initialTheme) {
      setTheme(initialTheme);
    }
  }, [initialTheme]);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    // Atualiza a UI imediatamente (atualização otimista).
    setTheme(newTheme);

    try {
      // Atualiza o banco de dados.
      await updateUserTheme(newTheme);

      // Atualiza o localStorage para que ele não fique com dados antigos.
      const storedUser = localStorage.getItem('chat-user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        userData.theme = newTheme; // Atualiza a propriedade do tema
        localStorage.setItem('chat-user', JSON.stringify(userData)); // Salva o objeto de volta
      }

    } catch (error) {
      console.error("Falha ao salvar a preferência de tema.", error);
      // Se algo der errado, reverte a mudança na UI.
      setTheme(theme); 
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};