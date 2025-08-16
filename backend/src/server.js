const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./db');

// Importa o novo middleware e as rotas
const { requireAuth } = require('./middleware/auth.middleware');
const { errorHandler } = require('./middleware/error');
const authRoutes = require('./routes/auth.routes');
const chatRoutes = require('./routes/chat.routes');
const conversationsRoutes = require('./routes/conversations.routes');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || '*',
  exposedHeaders: ['x-user-id'] // Expor o header se necessário
}));

// Rota pública de health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Rotas públicas de autenticação
app.use('/api/auth', authRoutes);

// Rotas protegidas que exigem autenticação
app.use('/api/chat', requireAuth, chatRoutes);
app.use('/api/conversations', requireAuth, conversationsRoutes);

// Middleware de tratamento de erros
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    app.listen(PORT, () => console.log(`🚀 Backend na porta ${PORT}`));
  } catch (error) {
    console.error('❌ Falha ao iniciar o servidor:', error);
    process.exit(1);
  }
})();