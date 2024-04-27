import { Request, Response } from 'express';
import { Database } from 'sqlite3';
import { ConfigurableProduct } from '../../models/produto-configuravel.model';
import * as path from 'path'

const dbPath = path.resolve(__dirname, '../../database/database.db');
const db = new Database(dbPath);

export const criarProdutoConfiguravel = async (req: Request, res: Response) => {
  const novoProduto: ConfigurableProduct = req.body;
  try {
    if (!novoProduto.color || !novoProduto.type) {
      return res.status(400).json({ error: 'Cor e tipo são campos obrigatórios' });
    }

    db.get('SELECT * FROM produtos_configuraveis WHERE color = ? AND type = ?', [novoProduto.color, novoProduto.type], (err, produtoExistente: ConfigurableProduct) => {
      if (err) {
        console.error('Erro ao verificar se o produto já existe:', err);
        return res.status(500).json({ error: 'Erro ao verificar produto no banco de dados' });
      }

      if (produtoExistente) {
        return res.status(400).json({ error: 'Um produto com o mesmo nome, cor e tipo já existe, insira características diferentes' });
      }

      db.run('INSERT INTO produtos_configuraveis (name, description, saleValue, color, type, sizes) VALUES (?, ?, ?, ?, ?, ?)', [novoProduto.name, novoProduto.description, novoProduto.saleValue, novoProduto.color, novoProduto.type, JSON.stringify(novoProduto.sizes)], function (err) {
        if (err) {
          console.error('Erro ao inserir produto configurável:', err);
          return res.status(500).json({ error: 'Erro ao inserir produto configurável no banco de dados' });
        }
        console.log(`Produto configurável inserido com sucesso. ID do produto: ${this.lastID}`);
        return res.status(201).json(novoProduto);
      });
    });
  } catch (error) {
    console.error('Erro ao inserir produto:', error);
    return res.status(500).json({ error: 'Erro ao inserir produto no banco de dados' });
  }
};

export const deletarProdutoConfiguravelPorId = async (req: Request, res: Response) => {
  const { id } = req.params; 

  try {
    db.get('SELECT * FROM produtos_configuraveis WHERE id = ?', [id], (err, produto) => {
      if (err) {
        console.error('Erro ao verificar produto:', err);
        return res.status(500).json({ error: 'Erro ao verificar produto no banco de dados' });
      }

      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      db.run('DELETE FROM produtos_configuraveis WHERE id = ?', [id], function (err) {
        if (err) {
          console.error('Erro ao deletar produto:', err);
          return res.status(500).json({ error: 'Erro ao deletar produto do banco de dados' });
        }
        console.log(`Produto configurável deletado com sucesso. ID do produto: ${id}`);
        return res.status(204).send(); 
      });
    });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    return res.status(500).json({ error: 'Erro ao deletar produto do banco de dados' });
  }
};

export const obterProdutosConfiguraveis = async (req: Request, res: Response) => {
  try {
    db.all('SELECT * FROM produtos_configuraveis', [], (err, produtos) => {
      if (err) {
        console.error('Erro ao obter produtos:', err);
        return res.status(500).json({ error: 'Erro ao obter produtos do banco de dados' });
      }

      if (!produtos || produtos.length === 0) {
        return res.status(404).json({ error: 'Nenhum produto configurável registrado' });
      }

      return res.status(200).json(produtos);
    });
  } catch (error) {
    console.error('Erro ao obter produtos:', error);
    return res.status(500).json({ error: 'Erro ao obter produtos do banco de dados' });
  }
};

  