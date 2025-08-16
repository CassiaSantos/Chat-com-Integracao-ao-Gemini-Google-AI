const express = require('express');
const router = express.Router();
const { postChat } = require('../controllers/chat.controller');

router.post('/', postChat);

module.exports = router;