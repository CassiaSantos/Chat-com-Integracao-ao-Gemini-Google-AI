const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./db');
const http = require('http'); 
const { Server } = require("socket.io"); // Importa o Server do socket.io
const mongoose = require('mongoose'); // para validar o ID
const { streamCallGemini } = require('./services/gemini.service'); // Importa a nova função de stream
const { truncateText } = require('./utils/textUtils');

// serviços e models necessários
const { callGemini } = require('./services/gemini.service');
const Conversation = require('./models/Conversation');

// Rotas existentes
const authRoutes = require('./routes/auth.routes');
const conversationsRoutes = require('./routes/conversations.routes');
const userRoutes = require('./routes/user.routes');
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
app.use('/api/user', requireAuth, userRoutes);


// LÓGICA DO WEBSOCKET
io.on('connection', (socket) => {
  //Depuração:
  //console.log('✅ Cliente conectado via WebSocket:', socket.id);

socket.on('sendMessage', async ({ conversationId, message, userId }) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(conversationId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return socket.emit('chatError', { error: 'ID de conversa ou usuário inválido.' });
    }
    
    // Busca a conversa inicial para verificar o estado
    const initialConvo = await Conversation.findOne({ _id: conversationId, userId });
    if (!initialConvo) {
      return socket.emit('chatError', { error: 'Conversa não encontrada' });
    }

    let newTitle = null;
    
    // Prepara o objeto de atualização para o banco de dados
    const updatePayload = {
      $push: { messages: { role: 'user', text: message } } // Adiciona a mensagem do usuário
    };

    if (initialConvo.messages.length === 0) {
      // Agora usamos a função de utilidade, passando o limite de 35
      newTitle = truncateText(message, 30);
      initialConvo.title = newTitle;

      // Adiciona a atualização do título ao payload
      updatePayload.$set = { title: newTitle };
      //console.log(`✅ Título da conversa ${conversationId} será atualizado para: "${newTitle}"`);
    }
    
    // Atualiza a conversa com a mensagem do usuário e o novo título (se houver)
    const updatedConvo = await Conversation.findByIdAndUpdate(
      conversationId,
      updatePayload,
      { new: true } // Retorna o documento atualizado
    );
    
    // O histórico para a API agora é baseado na conversa recém-atualizada
    const historyForAPI = updatedConvo.messages;
    let fullReply = '';
    
    for await (const chunk of streamCallGemini(historyForAPI)) {
      fullReply += chunk;
      socket.emit('receiveReplyChunk', { chunk });
    }
    
    // Salva a resposta do assistente na conversa
    await Conversation.findByIdAndUpdate(conversationId, {
      $push: { messages: { role: 'assistant', text: fullReply } }
    });
    
    //console.log('✅ Conversa salva no banco de dados.');
    socket.emit('streamEnd', { newTitle });

  } catch (err) {
    console.error('❌ ERRO GERAL NO WEBSOCKET:', err);
    socket.emit('chatError', { error: 'Erro interno do servidor ao processar a mensagem.' });
  }
});

  socket.on('disconnect', () => {
    //console.log('🔌 Cliente desconectado:', socket.id);
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB(process.env.MONGODB_URI);
  server.listen(PORT, () => console.log(`🚀 Backend (com WebSocket) na porta ${PORT}`));
})();