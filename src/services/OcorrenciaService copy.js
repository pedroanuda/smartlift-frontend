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

  static buscarOcorrenciasPorClienteId(idCliente) {
    return this.buscarOcorrencias().filter(ocorrencia => ocorrencia.contrato?.idCliente === idCliente);
  }

  static buscarOcorrenciaPorId(id) {
    const ocorrencia = db.dados.ocorrencias.find(oc => oc.id === id);
    return ocorrencia ? ocorrenciaObjectToInstance(ocorrencia) : null;
  }
}

//V2 
/*

import db from '../db';
import AtendimentoOcorrencia from '../domain/AtendimentoOcorrencia';
import Ocorrencia from '../domain/Ocorrencia';
import PecaAtendimento from '../domain/PecaAtendimento';
import ContratoService from './ContratoService';
import PecaService from './PecaService';
import UsuarioService from './UsuarioService';

const STORAGE_KEY = 'smartlift.novasOcorrencias';
const EVENT_NAME = 'smartlift:ocorrencias-atualizadas';

function lerOcorrenciasSalvas() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (error) {
    console.error('Erro ao ler ocorrências:', error);
    return [];
  }
}

const ocorrenciaObjectToInstance = (ocorrencia) => {
  const novaOcorrencia = new Ocorrencia(ocorrencia);

  novaOcorrencia.contrato = ContratoService.buscarContratoPorId(
    novaOcorrencia.contratoId
  );

  novaOcorrencia.atendimentos = (ocorrencia.atendimentos || []).map(atendimento => {
    const novoAtendimento = new AtendimentoOcorrencia(atendimento);

    novoAtendimento.tecnico = UsuarioService.buscarUsuarioPorId(
      novoAtendimento.tecnicoId
    );

    const pecaMapper = peca => {
      const pecaAtendimento = new PecaAtendimento(
        peca.pecaId ?? peca.id,
        peca.quantidade
      );

      pecaAtendimento.peca = PecaService.buscarPecaPorId(
        pecaAtendimento.pecaId
      );

      return pecaAtendimento;
    };

    novoAtendimento.pecasRequisitadas =
      atendimento.pecasRequisitadas?.map(pecaMapper) || [];

    novoAtendimento.pecasUtilizadas =
      atendimento.pecasUtilizadas?.map(pecaMapper) || [];

    return novoAtendimento;
  });

  return novaOcorrencia;
};

export default class OcorrenciaService {

  // Combina os dados iniciais com os registros persistidos.
  // O ID evita duplicações.
  static buscarOcorrencias() {
    const ocorrenciasBase = db.dados.ocorrencias || [];
    const ocorrenciasSalvas = lerOcorrenciasSalvas();

    const registros = new Map();

    ocorrenciasBase.forEach(ocorrencia => {
      registros.set(String(ocorrencia.id), ocorrencia);
    });

    ocorrenciasSalvas.forEach(ocorrencia => {
      registros.set(String(ocorrencia.id), ocorrencia);
    });

    return Array.from(registros.values())
      .map(ocorrenciaObjectToInstance)
      .sort((a, b) => Number(b.id) - Number(a.id));
  }

  static salvarNovaOcorrencia(ocorrencia) {
    const ocorrenciasSalvas = lerOcorrenciasSalvas();

    const novasOcorrencias = [
      ...ocorrenciasSalvas.filter(
        item => String(item.id) !== String(ocorrencia.id)
      ),
      ocorrencia
    ];

    // Persistência permanente no navegador.
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(novasOcorrencias)
    );

    // Atualização da base simulada em memória.
    const index = db.dados.ocorrencias.findIndex(
      item => String(item.id) === String(ocorrencia.id)
    );

    if (index >= 0) {
      db.dados.ocorrencias[index] = ocorrencia;
    } else {
      db.dados.ocorrencias.push(ocorrencia);
    }

    // Atualiza os componentes da aplicação na mesma aba.
    window.dispatchEvent(new Event(EVENT_NAME));

    return ocorrenciaObjectToInstance(ocorrencia);
  }

  static buscarOcorrenciasPorClienteId(idCliente) {
    return this.buscarOcorrencias().filter(
      ocorrencia =>
        String(ocorrencia.contrato?.idCliente) === String(idCliente)
    );
  }

  static buscarOcorrenciaPorId(id) {
    return this.buscarOcorrencias().find(
      ocorrencia => String(ocorrencia.id) === String(id)
    ) || null;
  }
}


*/