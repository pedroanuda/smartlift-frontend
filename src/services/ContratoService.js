import db from "../db";
import ContratoCliente from "../domain/ContratoCliente";
import ProdutoService from "./ProdutoService";

const contratoObjectToInstance = contrato => {
  const contratoCliente = new ContratoCliente(contrato);
  contratoCliente.produto = ProdutoService.buscarProdutoPorId(contratoCliente.idProduto);
  return contratoCliente;
};

export default class ContratoService {
  static buscarContratosPorClienteId(idCliente) {
    return db.dados.contratos
      .filter(contrato => contrato.idCliente === idCliente)
      .map(contratoObjectToInstance);
  }

  static buscarContratoPorId(id) {
    const contrato = db.dados.contratos.find(contrato => contrato.id === id);
    return contrato ? contratoObjectToInstance(contrato) : null;
  }
}