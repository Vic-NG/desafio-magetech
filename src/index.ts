// src/index.ts

import express from 'express';
import produtosSimplesRoute from './routes/produtoSimplesRoute';
import produtosDigitaisRoute from './routes/produtosDigitaisRoute';
import produtosConfiguraveisRoute from './routes/produtosConfiguraveisRoute';

const app = express();
app.use(express.json());

app.use('/api/v1', [produtosSimplesRoute, produtosDigitaisRoute, produtosConfiguraveisRoute]);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Servidor rodando em: ', `http://localhost:${PORT}`);
});