import db from '../db';
import AtendimentoOcorrencia from '../domain/AtendimentoOcorrencia';
import Ocorrencia from '../domain/Ocorrencia';
import PecaAtendimento from '../domain/PecaAtendimento';
import ContratoService from './ContratoService';
import PecaService from './PecaService';
import UsuarioService from './UsuarioService';

const ocorrenciaObjectToInstance = (ocorrencia) => {
  const novaOcorrencia = new Ocorrencia(ocorrencia);
  novaOcorrencia.contrato = ContratoService.buscarContratoPorId(novaOcorrencia.contratoId);

  novaOcorrencia.atendimentos = ocorrencia.atendimentos.map(atendimento => {
    const novoAtendimento = new AtendimentoOcorrencia(atendimento);
    novoAtendimento.tecnico = UsuarioService.buscarUsuarioPorId(novoAtendimento.tecnicoId);

    const pecaMapper = (peca => {
      const pecaAtendimento = new PecaAtendimento(peca.pecaId, peca.quantidade);
      pecaAtendimento.peca = PecaService.buscarPecaPorId(pecaAtendimento.pecaId);
      return pecaAtendimento;
    })

    novoAtendimento.pecasRequisitadas = atendimento.pecasRequisitadas?.map(pecaMapper) || [];
    novoAtendimento.pecasUtilizadas = atendimento.pecasUtilizadas?.map(pecaMapper) || [];
    return novoAtendimento;
  })

  return novaOcorrencia;
};

export default class OcorrenciaService {
  static buscarOcorrencias() {
    return db.dados.ocorrencias.map(ocorrenciaObjectToInstance);
  }

  static buscarOcorrenciaPorId(id) {
    const ocorrencia = db.dados.ocorrencias.find(oc => oc.id === id);
    return ocorrencia ? ocorrenciaObjectToInstance(ocorrencia) : null;
  }
}