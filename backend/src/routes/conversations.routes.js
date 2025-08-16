const express = require('express');
const router = express.Router();
const {
  listConversations,
  getConversationMessages,
  createConversation,
  deleteConversation
} = require('../controllers/conversations.controller');

router.get('/', listConversations);
router.post('/', createConversation);
router.get('/:id', getConversationMessages);
router.delete('/:id', deleteConversation);

module.exports = router;