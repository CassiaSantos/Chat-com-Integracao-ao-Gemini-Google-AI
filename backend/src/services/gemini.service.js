const axios = require('axios');

const GEMINI_BASE = 'https://generativelanguage.googleapis.com';

async function callGemini({ apiKey, model, messages }) {
  // Convertemos o histórico para o formato "contents" da Gemini API
  // Cada turno vira um objeto { role?, parts: [{ text }] }
  // A API não exige o campo role explicitamente, mas manteremos a ordem e texto
  const contents = messages.map(m => ({ parts: [{ text: m.text }] }));

  const url = `${GEMINI_BASE}/v1beta/models/${model}:generateContent`;
  const body = { contents };

  const { data } = await axios.post(url, body, {
    headers: { 'Content-Type': 'application/json' },
    params: { key: apiKey }
  });

  const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  return reply || 'Sem resposta.';
}

module.exports = { callGemini };