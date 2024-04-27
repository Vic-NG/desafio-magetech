import { Request, Response } from 'express';
import { Database } from 'sqlite3';
import { SimpleProduct } from '../../models/produto-simples.model';
import * as path from 'path'

const dbPath = path.resolve(__dirname, '../../database/database.db');
const db = new Database(dbPath);

export const criarProdutoSimples = async (req: Request, res: Response) => {
  const novoProduto: SimpleProduct = req.body;
  try {
    db.get('SELECT * FROM produtos_simples WHERE name = ?', [novoProduto.name], (err, produtoExistente: SimpleProduct) => {
      if (err) {
        console.error('Erro ao verificar se o produto já existe:', err);
        return res.status(500).json({ error: 'Erro ao verificar produto no banco de dados' });
      }

      if (produtoExistente) {
        return res.status(400).json({ error: 'Um produto com o mesmo nome já existe' });
      }

      db.run('INSERT INTO produtos_simples (name, description, saleValue) VALUES (?, ?, ?)', [novoProduto.name, novoProduto.description, novoProduto.saleValue], function (err) {
        if (err) {
          console.error('Erro ao inserir produto:', err);
          return res.status(500).json({ error: 'Erro ao inserir produto no banco de dados' });
        }
        console.log(`Produto simples inserido com sucesso. ID do produto: ${this.lastID}`);
        return res.status(201).json(novoProduto);
      });

    });
  } catch (error) {
    console.error('Erro ao inserir produto:', error);
    return res.status(500).json({ error: 'Erro ao inserir produto no banco de dados' });
  }
};

export const deletarProdutoPorId = async (req: Request, res: Response) => {
  const { id } = req.params; 

  try {
    db.get('SELECT * FROM produtos_simples WHERE id = ?', [id], (err, produto) => {
      if (err) {
        console.error('Erro ao verificar produto:', err);
        return res.status(500).json({ error: 'Erro ao verificar produto no banco de dados' });
      }

      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      db.run('DELETE FROM produtos_simples WHERE id = ?', [id], function (err) {
        if (err) {
          console.error('Erro ao deletar produto:', err);
          return res.status(500).json({ error: 'Erro ao deletar produto do banco de dados' });
        }
        console.log(`Produto simples deletado com sucesso. ID do produto: ${id}`);
        return res.status(204).send();
      });
    });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    return res.status(500).json({ error: 'Erro ao deletar produto do banco de dados' });
  }
};

export const editarProdutoSimples = async (req: Request, res: Response) => {
  const { id } = req.params;
  const novosDados: SimpleProduct = req.body;

  try {
    db.get('SELECT * FROM produtos_simples WHERE id = ?', [id], (err, produtoExistente: SimpleProduct) => {
      if (err) {
        console.error('Erro ao verificar produto:', err);
        return res.status(500).json({ error: 'Erro ao verificar produto no banco de dados' });
      }

      if (!produtoExistente) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      const oldSaleValue = produtoExistente.saleValue; 
      const currentDate = new Date().toLocaleString();

      db.run('UPDATE produtos_simples SET name = ?, description = ?, saleValue = ? WHERE id = ?', [novosDados.name, novosDados.description, novosDados.saleValue, id], function (err) {
        if (err) {
          console.error('Erro ao editar produto:', err);
          return res.status(500).json({ error: 'Erro ao editar produto no banco de dados' });
        }

        console.log(`Produto simples editado com sucesso. ID do produto: ${id}`);

        db.run('INSERT INTO product_logs (productId, product_name, oldSaleValue, newSaleValue, timestamp) VALUES (?, ?, ?, ?, ?)', [id, novosDados.name, oldSaleValue, novosDados.saleValue, currentDate], (err) => {
          if (err) {
            console.error('Erro ao registrar log de edição do produto:', err);
            return res.status(500).json({ error: 'Erro ao registrar log de edição do produto' });
          }
          console.log('Log de edição do produto registrado com sucesso.');
          return res.status(200).json(novosDados);
        });
      });
    });
  } catch (error) {
    console.error('Erro ao editar produto:', error);
    return res.status(500).json({ error: 'Erro ao editar produto no banco de dados' });
  }
};

export const marcarProdutoComoVisualizado = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    db.get('SELECT * FROM produtos_simples WHERE id = ?', [id], (err, produtoExistente: SimpleProduct) => {
      if (err) {
        console.error('Erro ao verificar produto:', err);
        return res.status(500).json({ error: 'Erro ao verificar produto no banco de dados' });
      }

      if (!produtoExistente) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      db.run('UPDATE produtos_simples SET viewed = ? WHERE id = ?', [true, id], function (err) {
        if (err) {
          console.error('Erro ao marcar produto como visualizado:', err);
          return res.status(500).json({ error: 'Erro ao marcar produto como visualizado no banco de dados' });
        }
        console.log(`Produto marcado como visualizado com sucesso. ID do produto: ${id}`);
        return res.status(200).json({ message: 'Produto marcado como visualizado com sucesso' });
      });
    });
  } catch (error) {
    console.error('Erro ao marcar produto como visualizado:', error);
    return res.status(500).json({ error: 'Erro ao marcar produto como visualizado no banco de dados' });
  }
};

export const definirValorPromocional = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { promotionalValue, promotionStartDate, promotionEndDate } = req.body;

  try {
      db.get('SELECT * FROM produtos_simples WHERE id = ?', [id], (err, produtoExistente: SimpleProduct) => {
          if (err) {
              console.error('Erro ao verificar produto:', err);
              return res.status(500).json({ error: 'Erro ao verificar produto no banco de dados' });
          }

          if (!produtoExistente) {
              return res.status(404).json({ error: 'Produto não encontrado' });
          }

          db.run('UPDATE produtos_simples SET promotionalValue = ?, promotionStartDate = ?, promotionEndDate = ? WHERE id = ?', [promotionalValue, promotionStartDate, promotionEndDate, id], function (err) {
              if (err) {
                  console.error('Erro ao definir valor promocional:', err);
                  return res.status(500).json({ error: 'Erro ao definir valor promocional no banco de dados' });
              }
              console.log(`Valor promocional definido com sucesso para o produto com ID: ${id}`);
              return res.status(200).json({ message: 'Valor promocional definido com sucesso' });
          });
      });
  } catch (error) {
      console.error('Erro ao definir valor promocional:', error);
      return res.status(500).json({ error: 'Erro ao definir valor promocional no banco de dados' });
  }
};

export const obterProdutosSimples = async (res: Response) => {
  try {
    db.all('SELECT * FROM produtos_simples', [], (err, produtos) => {
      if (err) {
        console.error('Erro ao obter produtos:', err);
        return res.status(500).json({ error: 'Erro ao obter produtos do banco de dados' });
      }

      if (!produtos || produtos.length === 0) {
        return res.status(404).json({ error: 'Nenhum simples produto registrado' });
      }

      return res.status(200).json(produtos);
    });
  } catch (error) {
    console.error('Erro ao obter produtos:', error);
    return res.status(500).json({ error: 'Erro ao obter produtos do banco de dados' });
  }
};