const express = require('express');
const router = express.Router();
const { login } = require('../controllers/auth.controller');

// Rota para login/registro
router.post('/login', login);

module.exports = router;