// src/routes/simpleProductRoutes.ts

import express from 'express';
import { criarProdutoConfiguravel, obterProdutosConfiguraveis, deletarProdutoConfiguravelPorId } from '../modules/produto-configuravel/produtosConfiguraveisController';

const router = express.Router();

router.post('/criarProdutoConfiguravel', criarProdutoConfiguravel);

router.delete('/deletarProdutoConfiguravel/:id', deletarProdutoConfiguravelPorId)

router.get('/listarProdutoConfiguraveis', obterProdutosConfiguraveis);

export default router;
