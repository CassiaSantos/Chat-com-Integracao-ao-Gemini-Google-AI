const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['user', 'assistant'], required: true },
    text: { type: String, required: true }
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } }
);

const ConversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: { type: String, default: 'Nova conversa' },
    messages: { type: [MessageSchema], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Conversation', ConversationSchema);