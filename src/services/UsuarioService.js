import db from "../db";
import Usuario from "../domain/Usuario";

export default class UsuarioService {
  static buscarUsuarioPorId(id) {
    const usuario = db.dados.usuarios.find(usuario => usuario.id === id);
    if (!usuario) {
      return null;
    }

    const usuarioInstancia = new Usuario(usuario);
    usuarioInstancia.senha = null; // Removendo a senha do objeto retornado
    return usuarioInstancia;
  }
}