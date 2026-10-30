export default class Produto {
  constructor(produtoObject) {
    this.id = produtoObject.id;
    this.modelo = produtoObject.modelo;
    this.imagem = produtoObject.imagem;
    this.tipo = produtoObject.tipo;
  }
}