import db from "../db";
import ContratoCliente from "../domain/ContratoCliente";
import ProdutoService from "./ProdutoService";

export default class ContratoService {
  static buscarContratoPorId(id) {
    const contrato = db.dados.contratos.find(contrato => contrato.id === id);
    if (!contrato) {
      return null;
    }

    const contratoCliente = new ContratoCliente(contrato);
    contratoCliente.produto = ProdutoService.buscarProdutoPorId(contratoCliente.idProduto);
    return contratoCliente;
  }
}