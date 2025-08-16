import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'
});

// Interceptor: Adiciona o header de autenticação em todas as requisições
api.interceptors.request.use(
  config => {
    // Pega os dados do usuário do localStorage
    const userString = localStorage.getItem('chat-user');
    if (userString) {
      const user = JSON.parse(userString);
      // Se o usuário existir e tiver um _id, anexa ao header
      if (user?._id) {
        config.headers['x-user-id'] = user._id;
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

/**
 * Função para fazer login ou registrar um usuário.
 * @param {string} username - O nome do usuário.
 * @returns {Promise<object>} Os dados do usuário.
 */
export async function loginUser(username) {
  const { data } = await api.post('/auth/login', { username });
  return data;
}

// --- Funções existentes (agora autenticadas automaticamente) ---

export async function listConversations() {
  const { data } = await api.get('/conversations');
  return data;
}

export async function getConversation(id) {
  const { data } = await api.get(`/conversations/${id}`);
  return data;
}

export async function createConversation(title) {
  const { data } = await api.post('/conversations', { title });
  return data;
}

export async function deleteConversation(id) {
  await api.delete(`/conversations/${id}`);
}

export async function sendMessage({ conversationId, message }) {
  const { data } = await api.post('/chat', { conversationId, message });
  return data;
}

export default api;