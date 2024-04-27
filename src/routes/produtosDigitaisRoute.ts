// src/routes/simpleProductRoutes.ts

import express from 'express';
import { criarProdutoDigital, deletarProdutoDigitalPorId, obterProdutosDigitais } from '../modules/produto-digital/produtosDigitaisController';

const router = express.Router();

router.post('/criarProdutoDigital', criarProdutoDigital);

router.delete('/deletarProdutoDigital/:id', deletarProdutoDigitalPorId)

router.get('/listarProdutoDigitais', obterProdutosDigitais);

export default router;
