import AvaliacaoOcorrencia from "./AvaliacaoOcorrencia";

export default class Ocorrencia {
  constructor(ocorrenciaObject) {
    this.id = ocorrenciaObject.id;
    this.contratoId = ocorrenciaObject.contratoId;
    this.descricao = ocorrenciaObject.descricao;
    this.status = ocorrenciaObject.status;
    this.categoria = ocorrenciaObject.categoria;

    this.contrato = null;
    this.atendimentos = [];
    this.avaliacao = new AvaliacaoOcorrencia(
      ocorrenciaObject.avaliacao.nota, 
      ocorrenciaObject.avaliacao.comentario
    );

    // TODO: Adicionar anexos/imagens se possível
  }
}