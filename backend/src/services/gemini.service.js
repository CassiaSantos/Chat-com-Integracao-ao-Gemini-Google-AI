const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Função que chama a API Gemini em modo de streaming usando o SDK oficial.
 * @param {object[]} messages - O histórico de mensagens da conversa.
 * @returns {AsyncGenerator<string>} Um gerador assíncrono que produz pedaços de texto (chunks).
 */
async function* streamCallGemini(messages) {
  // Neste ponto, temos certeza de que o dotenv.config() do server.js já foi executado.
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-1.5-flash' });

  // Converte nosso histórico de 'assistant' para 'model', como o SDK espera
  const history = messages.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.text }],
  }));

  // O SDK exige que a mensagem mais recente do usuário seja removida do histórico e enviada separadamente.
  const userMessage = history.pop().parts[0].text;

  const chat = model.startChat({ history });
  const result = await chat.sendMessageStream(userMessage);

  // Itera sobre o stream de resposta e envia cada pedaço de texto de volta
  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    yield chunkText; // 'yield' envia o pedaço para quem chamou a função
  }
}

module.exports = { streamCallGemini };