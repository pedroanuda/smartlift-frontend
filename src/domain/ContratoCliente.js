import Localizacao from "./Localizacao.js";

export default class ContratoCliente {
  constructor(contratoClienteObject) {
    this.id = contratoClienteObject.id;
    this.idCliente = contratoClienteObject.idCliente;
    this.idProduto = contratoClienteObject.idProduto;
    this.localizacao = new Localizacao(contratoClienteObject.localizacao);
    this.statusOperacional = contratoClienteObject.statusOperacional;

    this.produtoApelido = contratoClienteObject.produtoApelido;
    this.ultimaManutencao = contratoClienteObject.ultimaManutencao;

    this.produto = null;
  }
}