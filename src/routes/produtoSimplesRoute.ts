// src/routes/simpleProductRoutes.ts

import express from 'express';
import { 
    criarProdutoSimples, 
    deletarProdutoPorId, 
    obterProdutosSimples, 
    editarProdutoSimples, 
    marcarProdutoComoVisualizado,
    definirValorPromocional
} from '../modules/produto-simples/produtosSimplesController';

const router = express.Router();

router.post('/criarProdutoSimples', criarProdutoSimples);

router.get('/obterUnicoProdutoSimples/:id', marcarProdutoComoVisualizado);

router.put('/editarProdutoSimples/:id', editarProdutoSimples);

router.put('/definirValorPromocional/:id', definirValorPromocional)

router.delete('/deletarProdutoSimples/:id', deletarProdutoPorId);

router.get('/listarProdutosSimples', obterProdutosSimples);

export default router;
