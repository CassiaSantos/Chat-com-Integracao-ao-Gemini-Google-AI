const axios = require('axios');

const GEMINI_BASE = 'https://generativelanguage.googleapis.com';

async function callGemini({ apiKey, model, messages }) {
  // Mapeia 'role' interno ('assistant') para o que a API espera ('model').
  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.text }],
  }));

  const url = `${GEMINI_BASE}/v1beta/models/${model}:generateContent`;
  const body = { contents };

  try {
    const { data } = await axios.post(url, body, {
      headers: { 'Content-Type': 'application/json' },
      params: { key: apiKey },
    });

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    return reply || 'Não foi possível obter uma resposta. Tente novamente.';
  } catch (error) {
    // depuração no console do backend
    console.error('Erro na chamada da API Gemini:', error.response?.data || error.message);
    // Lança o erro para que o controller possa pegá-lo
    throw new Error('Falha ao comunicar com a IA.');
  }
}

module.exports = { callGemini };