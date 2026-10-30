export default class Localizacao {
  constructor(localizacaoObject) {
    this.logradouro = localizacaoObject.logradouro;
    this.numero = localizacaoObject.numero;
    this.complemento = localizacaoObject.complemento;
    this.bairro = localizacaoObject.bairro;
    this.cidade = localizacaoObject.cidade;
    this.estado = localizacaoObject.estado;
    this.cep = localizacaoObject.cep;

    this.apelido = localizacaoObject.apelido;
    this.tipo = localizacaoObject.tipo;
  }
}