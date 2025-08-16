const Conversation = require('../models/Conversation');

async function listConversations(req, res, next) {
  try {
    // Lista apenas as conversas do usuário logado
    const items = await Conversation.find({ userId: req.userId }, { messages: { $slice: -1 } })
      .sort({ updatedAt: -1 })
      .lean();
    res.json(items);
  } catch (err) {
    next(err);
  }
}

async function getConversationMessages(req, res, next) {
  try {
    const { id } = req.params;
    // Busca a conversa pelo ID E pelo ID do usuário
    const convo = await Conversation.findOne({ _id: id, userId: req.userId }).lean();
    if (!convo) return res.status(404).json({ error: 'Conversa não encontrada ou não pertence a você' });
    res.json(convo);
  } catch (err) {
    next(err);
  }
}

async function createConversation(req, res, next) {
  try {
    const { title } = req.body;
    // Cria a conversa associando ao usuário logado
    const convo = await Conversation.create({
      title: title || 'Nova conversa',
      userId: req.userId
    });
    res.status(201).json(convo);
  } catch (err) {
    next(err);
  }
}

async function deleteConversation(req, res, next) {
  try {
    const { id } = req.params;
    // Deleta a conversa apenas se ela pertencer ao usuário logado
    const result = await Conversation.deleteOne({ _id: id, userId: req.userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Conversa não encontrada ou não pertence a você' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { listConversations, getConversationMessages, createConversation, deleteConversation };