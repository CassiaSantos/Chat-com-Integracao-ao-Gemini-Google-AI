function errorHandler(err, req, res, next) {
    console.error('❌ Erro:', err?.response?.data || err.message || err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
  
  module.exports = { errorHandler };