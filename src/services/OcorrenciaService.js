import db from "../db";
import AtendimentoOcorrencia from "../domain/AtendimentoOcorrencia";
import Ocorrencia from "../domain/Ocorrencia";
import PecaAtendimento from "../domain/PecaAtendimento";
import ContratoService from "./ContratoService";
import PecaService from "./PecaService";
import UsuarioService from "./UsuarioService";

const CHAVE_STORAGE = "smartlift.novasOcorrencias";

function buscarRegistrosBrutos() {
  const registrosMemoria = db.dados.ocorrencias || [];

  let registrosStorage = [];

  try {
    registrosStorage = JSON.parse(localStorage.getItem(CHAVE_STORAGE) || "[]");

    if (!Array.isArray(registrosStorage)) {
      registrosStorage = [];
    }
  } catch (erro) {
    console.error("Erro ao ler ocorrências salvas:", erro);
  }

  // Consolida memória e localStorage sem duplicar IDs.
  const mapa = new Map();

  [...registrosMemoria, ...registrosStorage].forEach((item) => {
    mapa.set(String(item.id), item);
  });

  return Array.from(mapa.values());
}

function ocorrenciaObjectToInstance(ocorrencia) {
  const novaOcorrencia = new Ocorrencia(ocorrencia);

  novaOcorrencia.contrato = ContratoService.buscarContratoPorId(
    novaOcorrencia.contratoId,
  );

  novaOcorrencia.atendimentos = (ocorrencia.atendimentos || []).map(
    (atendimento) => {
      const novoAtendimento = new AtendimentoOcorrencia(atendimento);

      novoAtendimento.tecnico = UsuarioService.buscarUsuarioPorId(
        novoAtendimento.tecnicoId,
      );

      const mapearPeca = (peca) => {
        const pecaAtendimento = new PecaAtendimento(
          peca.pecaId ?? peca.id,
          peca.quantidade,
        );

        pecaAtendimento.peca = PecaService.buscarPecaPorId(
          pecaAtendimento.pecaId,
        );

        return pecaAtendimento;
      };

      novoAtendimento.pecasRequisitadas = (
        atendimento.pecasRequisitadas || []
      ).map(mapearPeca);

      novoAtendimento.pecasUtilizadas = (atendimento.pecasUtilizadas || []).map(
        mapearPeca,
      );

      return novoAtendimento;
    },
  );

  return novaOcorrencia;
}

export default class OcorrenciaService {
  static buscarOcorrencias() {
    return buscarRegistrosBrutos().map(ocorrenciaObjectToInstance);
  }

  static buscarOcorrenciasPorClienteId(idCliente) {
    return this.buscarOcorrencias().filter(
      (ocorrencia) => ocorrencia.contrato?.idCliente === idCliente,
    );
  }

  static buscarOcorrenciaPorId(id) {
    const ocorrencia = buscarRegistrosBrutos().find(
      (item) => String(item.id) === String(id),
    );

    return ocorrencia ? ocorrenciaObjectToInstance(ocorrencia) : null;
  }

  static salvarNovaOcorrencia(novaOcorrencia) {
    const registros = buscarRegistrosBrutos();

    const existe = registros.some(
      (item) => String(item.id) === String(novaOcorrencia.id),
    );

    if (existe) {
      throw new Error("Esta ocorrência já foi cadastrada.");
    }

    const registro = {
      ...novaOcorrencia,
      dataCriacao: novaOcorrencia.dataCriacao || new Date().toISOString(),
      atendimentos: novaOcorrencia.atendimentos || [],
      avaliacao: novaOcorrencia.avaliacao || {
        nota: null,
        comentario: "",
      },
    };

    registros.push(registro);

    // Atualiza a base em memória.
    db.dados.ocorrencias = registros;

    // Persiste os registros criados.
    localStorage.setItem(
      CHAVE_STORAGE,
      JSON.stringify(
        registros.filter(
          (item) => String(item.id).startsWith("DEMO-") === false,
        ),
      ),
    );

    // Atualiza o dashboard na mesma aba.
    window.dispatchEvent(new Event("smartlift:ocorrencias-atualizadas"));

    return ocorrenciaObjectToInstance(registro);
  }
}
