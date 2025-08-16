const User = require('../models/User');

async function login(req, res, next) {
  try {
    const { username } = req.body;
    if (!username || !username.trim()) {
      return res.status(400).json({ error: 'Nome de usuário é obrigatório' });
    }

    // Procura por um usuário ou cria um novo (upsert)
    const user = await User.findOneAndUpdate(
      { username: username.trim() },
      { $setOnInsert: { username: username.trim() } },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

module.exports = { login };