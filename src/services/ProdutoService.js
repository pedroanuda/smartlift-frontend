import db from "../db";
import Produto from "../domain/Produto";

export default class ProdutoService {
  static buscarProdutoPorId(id) {
    const produto = db.dados.produtos.find(produto => produto.id === id);
    if (!produto) {
      return null;
    }

    return new Produto(produto);
  }
}