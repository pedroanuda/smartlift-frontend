export default class Usuario {
  constructor(usuarioObject) {
    this.id = usuarioObject.id;
    this.nome = usuarioObject.nome;
    this.sobrenome = usuarioObject.sobrenome;
    this.email = usuarioObject.email;
    this.senha = usuarioObject.senha;

    this.tipo = usuarioObject.tipo;
  }
}