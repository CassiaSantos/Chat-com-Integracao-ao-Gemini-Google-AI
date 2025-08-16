const Conversation = require('../models/Conversation');
const { callGemini } = require('../services/gemini.service');

async function postChat(req, res, next) {
  try {
    const { conversationId, message } = req.body;
    const userId = req.userId; // Obtido do middleware de autenticação

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Mensagem vazia' });
    }

    let convo;
    if (conversationId) {
      // Busca a conversa E verifica se pertence ao usuário logado
      convo = await Conversation.findOne({ _id: conversationId, userId });
      if (!convo) return res.status(404).json({ error: 'Conversa não encontrada ou não pertence a você' });
    } else {
      // Cria uma nova conversa associada ao usuário
      convo = await Conversation.create({
        title: message.slice(0, 40) || 'Nova conversa',
        userId
      });
    }

    convo.messages.push({ role: 'user', text: message });

    // Prepara o histórico para a API (limitando os últimos 20 turnos)
    const history = convo.messages.slice(-20);

    const reply = await callGemini({
      apiKey: process.env.GEMINI_API_KEY,
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
      messages: history
    });

    convo.messages.push({ role: 'assistant', text: reply });
    await convo.save();

    res.json({ conversationId: convo._id, reply });
  } catch (err) {
    next(err);
  }
}

module.exports = { postChat };