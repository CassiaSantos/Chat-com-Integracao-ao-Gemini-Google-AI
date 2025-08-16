const mongoose = require('mongoose');
const User = require('../models/User');

async function requireAuth(req, res, next) {
  const userId = req.headers['x-user-id'];

  if (!userId) {
    return res.status(401).json({ error: 'Autenticação necessária (x-user-id header ausente)' });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'ID de usuário inválido' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }
    // Anexa o ID do usuário ao request para uso posterior
    req.userId = userId;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { requireAuth };