export default class AtendimentoOcorrencia {
  constructor(atendimentoObject) {
    this.tecnicoId = atendimentoObject.tecnicoId;
    this.relatorio = atendimentoObject.relatorio;
    this.dataHoraInicioAtendimento = atendimentoObject.dataHoraInicioAtendimento;
    this.dataHoraFimAtendimento = atendimentoObject.dataHoraFimAtendimento;

    this.pecasRequisitadas = [];
    this.pecasUtilizadas = [];

    this.tecnico = null;
  }
}