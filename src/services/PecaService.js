import db from "../db";
import Peca from "../domain/Peca";

export default class PecaService {
  static buscarPecaPorId(id) {
    const peca = db.dados.pecas.find(peca => peca.id === id);
    if (!peca) {
      return null;
    }

    return new Peca(peca.id, peca.nome);
  }
}