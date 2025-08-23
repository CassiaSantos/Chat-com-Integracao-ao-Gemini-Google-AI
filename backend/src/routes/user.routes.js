const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Rota para atualizar o tema do usuário logado
router.put('/theme', async (req, res, next) => {
  try {
    const { theme } = req.body;
    // Validação simples:
    if (!['light', 'dark'].includes(theme)) {
      return res.status(400).json({ error: 'Tema inválido.' });
    }

    await User.findByIdAndUpdate(req.userId, { $set: { theme } });

    res.status(200).json({ message: 'Tema atualizado com sucesso.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;