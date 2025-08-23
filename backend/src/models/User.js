const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    theme: {
      type: String,
      enum: ['light', 'dark'], // Apenas 'light' ou 'dark' são permitidos
      default: 'dark',        // Novos usuários começarão com o tema escuro
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);