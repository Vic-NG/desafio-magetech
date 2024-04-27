import { Request, Response } from 'express';
import { Database } from 'sqlite3';
import { DigitalProduct } from '../../models/produto-digital.model';
import * as path from 'path'

const dbPath = path.resolve(__dirname, '../../database/database.db');
const db = new Database(dbPath);

export const criarProdutoDigital = async (req: Request, res: Response) => {
  const novoProduto: DigitalProduct = req.body;
  try {
    db.get('SELECT * FROM produtos_digitais WHERE name = ?', [novoProduto.name], (err, produtoExistente: DigitalProduct) => {
      if (err) {
        console.error('Erro ao verificar se o produto já existe:', err);
        return res.status(500).json({ error: 'Erro ao verificar produto no banco de dados' });
      }

      if (produtoExistente) {
        return res.status(400).json({ error: 'Um produto com o mesmo nome já existe' });
      }

      if (!novoProduto.linkDownload || novoProduto.linkDownload === null) {
        return res.status(400).send({ error: 'O parâmetro linkDownload é obrigatório.'});
      }

      db.run('INSERT INTO produtos_digitais (name, description, saleValue, linkDownload) VALUES (?, ?, ?, ?)', [novoProduto.name, novoProduto.description, novoProduto.saleValue, novoProduto.linkDownload], function (err) {
        if (err) {
          console.error('Erro ao inserir produto:', err);
          return res.status(500).json({ error: 'Erro ao inserir produto no banco de dados' });
        }
        console.log(`Produto digital inserido com sucesso. ID do produto: ${this.lastID}`);
        return res.status(201).json(novoProduto);
      });

    });
  } catch (error) {
    console.error('Erro ao inserir produto:', error);
    return res.status(500).json({ error: 'Erro ao inserir produto no banco de dados' });
  }
};

export const deletarProdutoDigitalPorId = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    db.get('SELECT * FROM produtos_digitais WHERE id = ?', [id], (err, produto) => {
      if (err) {
        console.error('Erro ao verificar produto:', err);
        return res.status(500).json({ error: 'Erro ao verificar produto no banco de dados' });
      }

      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      db.run('DELETE FROM produtos_digitais WHERE id = ?', [id], function (err) {
        if (err) {
          console.error('Erro ao deletar produto:', err);
          return res.status(500).json({ error: 'Erro ao deletar produto do banco de dados' });
        }
        console.log(`Produto digital deletado com sucesso. ID do produto: ${id}`);
        return res.status(204).send();
      });
    });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    return res.status(500).json({ error: 'Erro ao deletar produto do banco de dados' });
  }
};


export const obterProdutosDigitais = async (req: Request, res: Response) => {
  try {
    db.all('SELECT * FROM produtos_digitais', [], (err, produtos) => {
      if (err) {
        console.error('Erro ao obter produtos:', err);
        return res.status(500).json({ error: 'Erro ao obter produtos do banco de dados' });
      }

      if (!produtos || produtos.length === 0) {
        return res.status(404).json({ error: 'Nenhum  digital produto registrado' });
      }

      return res.status(200).json(produtos);
    });
  } catch (error) {
    console.error('Erro ao obter produtos:', error);
    return res.status(500).json({ error: 'Erro ao obter produtos do banco de dados' });
  }
};
