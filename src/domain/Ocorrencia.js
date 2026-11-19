
import AvaliacaoOcorrencia from "./AvaliacaoOcorrencia";

export default class Ocorrencia {
  constructor(ocorrenciaObject) {
    // Preserva os campos adicionais do cadastro.
    Object.assign(this, ocorrenciaObject);

    this.id = ocorrenciaObject.id;
    this.contratoId = ocorrenciaObject.contratoId;
    this.descricao = ocorrenciaObject.descricao;
    this.status = ocorrenciaObject.status;
    this.categoria = ocorrenciaObject.categoria;

    this.contrato = null;
    this.atendimentos = [];

    const avaliacao = ocorrenciaObject.avaliacao || {};

    this.avaliacao = new AvaliacaoOcorrencia(
      avaliacao.nota ?? null,
      avaliacao.comentario ?? ""
    );
  }
}
