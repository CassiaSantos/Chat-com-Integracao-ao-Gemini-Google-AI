const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./db');
const http = require('http'); 
const { Server } = require("socket.io"); // Importa o Server do socket.io
const mongoose = require('mongoose'); // para validar o ID
const { streamCallGemini } = require('./services/gemini.service'); // Importa a nova função de stream

// serviços e models necessários
const { callGemini } = require('./services/gemini.service');
const Conversation = require('./models/Conversation');

// Rotas existentes
const authRoutes = require('./routes/auth.routes');
const conversationsRoutes = require('./routes/conversations.routes');
const { requireAuth } = require('./middleware/auth.middleware');
const { errorHandler } = require('./middleware/error');

dotenv.config();
dotenv.config();

// LINHA PARA DEPURAÇÃO de Chave da API
//console.log('--- Verificando Chave da API ---');
//console.log('Chave carregada:', process.env.GEMINI_API_KEY ? 'Sim, existe uma chave' : 'NÃO, A CHAVE ESTÁ UNDEFINED!');

const app = express();
const server = http.createServer(app); // Cria um servidor HTTP a partir do app Express
const io = new Server(server, { // Anexa o socket.io ao servidor HTTP
  cors: {
    origin: process.env.CLIENT_ORIGIN || '*',
  }
});

app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));

// Rotas REST API
app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/conversations', requireAuth, conversationsRoutes);


// LÓGICA DO WEBSOCKET
io.on('connection', (socket) => {
  //Depuração:
  //console.log('✅ Cliente conectado via WebSocket:', socket.id);

  socket.on('sendMessage', async ({ conversationId, message, userId }) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(conversationId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return socket.emit('chatError', { error: 'ID de conversa ou usuário inválido.' });
    }
    
    const convo = await Conversation.findOne({ _id: conversationId, userId });
    if (!convo) {
      return socket.emit('chatError', { error: 'Conversa não encontrada' });
    }

    let newTitle = null;
    // Verifica se a conversa não tem mensagens. Se for o caso, esta é a primeira mensagem.
    if (message.length > 35) {
        // Se a mensagem for maior que 35 caracteres, trunca e adiciona "..."
        newTitle = message.slice(0, 30) + '...';
      } else {
        // Senão, usa a mensagem inteira como título
        newTitle = message;
      }

    convo.messages.push({ role: 'user', text: message });
    const history = convo.messages.slice(-20);
    
    let fullReply = '';
    
    //console.log('... Iniciando stream com a API do Gemini ...');
    for await (const chunk of streamCallGemini(history)) {
      fullReply += chunk;
      socket.emit('receiveReplyChunk', { chunk });
    }
    //console.log('✅ Stream da Gemini finalizado.');

    convo.messages.push({ role: 'assistant', text: fullReply });
    // O .save() agora salva tanto as novas mensagens quanto o novo título (se houver).
    await convo.save();
    //console.log('✅ Conversa salva no banco de dados.');

    // Notifica o frontend que a transmissão terminou, enviando o novo título se ele foi alterado.
    socket.emit('streamEnd', { newTitle }); // Passa o novo título para o frontend

  } catch (err) {
    console.error('❌ ERRO GERAL NO WEBSOCKET:', err);
    socket.emit('chatError', { error: 'Erro interno do servidor ao processar a mensagem.' });
  }
});

  socket.on('disconnect', () => {
    console.log('🔌 Cliente desconectado:', socket.id);
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB(process.env.MONGODB_URI);
  server.listen(PORT, () => console.log(`🚀 Backend (com WebSocket) na porta ${PORT}`));
})();