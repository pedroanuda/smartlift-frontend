import db from "../db";
import Usuario from "../domain/Usuario";

export const CHAVE_STORAGE_USUARIO_LOGADO = "smartlift.usuarioLogado";

function lerUsuarioLogadoIdStorage() {
  try {
    const valor = localStorage.getItem(CHAVE_STORAGE_USUARIO_LOGADO);
    if (!valor) return null;

    const id = Number(valor);
    return Number.isNaN(id) ? null : id;
  } catch (erro) {
    console.error("Erro ao ler usuário logado do localStorage:", erro);
    return null;
  }
}

export default class UsuarioService {
  static buscarUsuarioPorId(id) {
    const usuario = db.dados.usuarios.find((item) => item.id === id);
    if (!usuario) {
      return null;
    }

    const usuarioInstancia = new Usuario(usuario);
    usuarioInstancia.senha = null; // Removendo a senha do objeto retornado
    return usuarioInstancia;
  }

  static buscarUsuarioLogadoId() {
    if (db.dados.logado != null) {
      return db.dados.logado;
    }

    const idSalvo = lerUsuarioLogadoIdStorage();
    if (idSalvo == null) {
      return null;
    }

    const existe = db.dados.usuarios.some((item) => item.id === idSalvo);
    if (!existe) {
      this.logout();
      return null;
    }

    db.dados.logado = idSalvo;
    return idSalvo;
  }

  static buscarUsuarioLogado() {
    const id = this.buscarUsuarioLogadoId();
    return id != null ? this.buscarUsuarioPorId(id) : null;
  }

  static login(usuarioId) {
    const usuario = this.buscarUsuarioPorId(usuarioId);
    if (!usuario) {
      return null;
    }

    db.dados.logado = usuario.id;

    try {
      localStorage.setItem(CHAVE_STORAGE_USUARIO_LOGADO, String(usuario.id));
    } catch (erro) {
      console.error("Erro ao salvar usuário logado no localStorage:", erro);
    }

    return usuario;
  }

  static logout() {
    db.dados.logado = null;

    try {
      localStorage.removeItem(CHAVE_STORAGE_USUARIO_LOGADO);
    } catch (erro) {
      console.error("Erro ao limpar usuário logado do localStorage:", erro);
    }
  }
}
