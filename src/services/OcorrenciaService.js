import db from "../db";
import AtendimentoOcorrencia from "../domain/AtendimentoOcorrencia";
import Ocorrencia from "../domain/Ocorrencia";
import PecaAtendimento from "../domain/PecaAtendimento";
import ContratoService from "./ContratoService";
import PecaService from "./PecaService";
import UsuarioService from "./UsuarioService";

export const CHAVE_STORAGE_OCORRENCIAS = "smartlift.novasOcorrencias";
export const EVENTO_OCORRENCIAS_ATUALIZADAS = "smartlift:ocorrencias-atualizadas";

function lerRegistrosStorage() {
  try {
    const dados = localStorage.getItem(CHAVE_STORAGE_OCORRENCIAS);
    const registros = JSON.parse(dados || "[]");

    return Array.isArray(registros) ? registros : [];
  } catch (erro) {
    console.error("Erro ao ler ocorrências salvas:", erro);
    return [];
  }
}

function salvarRegistrosStorage(registros) {
  try {
    localStorage.setItem(CHAVE_STORAGE_OCORRENCIAS, JSON.stringify(registros));
  } catch (erro) {
    console.error("Erro ao salvar ocorrências no localStorage:", erro);
  }
}

function buscarRegistrosBrutos() {
  const registrosMemoria = db.dados.ocorrencias || [];
  const registrosStorage = lerRegistrosStorage();

  // Consolida memória e localStorage sem duplicar IDs.
  const mapa = new Map();

  [...registrosMemoria, ...registrosStorage].forEach((item) => {
    mapa.set(String(item.id), item);
  });

  return Array.from(mapa.values());
}

function formatarNomeAutor(usuario) {
  if (!usuario) return "Sistema";
  return `${usuario.nome || ""} ${usuario.sobrenome || ""}`.trim() || "Usuário";
}

function criarEventoHistorico({ tipo, titulo, detalhe = "", usuario = null }) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    dataHora: new Date().toISOString(),
    tipo,
    titulo,
    detalhe,
    autorNome: formatarNomeAutor(usuario),
    autorTipo: usuario?.tipo || "sistema",
  };
}

function persistirAlteracao(registros, registroAtualizado) {
  db.dados.ocorrencias = registros;

  const mapaStorage = new Map();

  [...lerRegistrosStorage(), registroAtualizado]
    .filter((item) => String(item.id).startsWith("DEMO-") === false)
    .forEach((item) => {
      mapaStorage.set(String(item.id), item);
    });

  salvarRegistrosStorage(Array.from(mapaStorage.values()));
  window.dispatchEvent(new Event(EVENTO_OCORRENCIAS_ATUALIZADAS));
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

  novaOcorrencia.historico = Array.isArray(ocorrencia.historico)
    ? ocorrencia.historico
    : [];

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

    const usuarioLogado = UsuarioService.buscarUsuarioLogado();
    const dataCriacao = novaOcorrencia.dataCriacao || new Date().toISOString();

    const registro = {
      ...novaOcorrencia,
      dataCriacao,
      atendimentos: novaOcorrencia.atendimentos || [],
      avaliacao: novaOcorrencia.avaliacao || {
        nota: null,
        comentario: "",
      },
      historico: [
        ...(Array.isArray(novaOcorrencia.historico)
          ? novaOcorrencia.historico
          : []),
        criarEventoHistorico({
          tipo: "criacao",
          titulo: "Ocorrência registrada",
          detalhe: `Status inicial: ${novaOcorrencia.status || "Pendente"}`,
          usuario: usuarioLogado,
        }),
      ],
    };

    registros.push(registro);
    persistirAlteracao(registros, registro);

    return ocorrenciaObjectToInstance(registro);
  }

  static atualizarStatusOcorrencia(id, novoStatus, { usuario = null, relatorio = "" } = {}) {
    const registros = buscarRegistrosBrutos();
    const indice = registros.findIndex(
      (item) => String(item.id) === String(id),
    );

    if (indice === -1) {
      return null;
    }

    const autor = usuario || UsuarioService.buscarUsuarioLogado();
    const atual = registros[indice];
    const statusAnterior = atual.status || "Pendente";
    const agora = new Date().toISOString();
    const textoRelatorio = relatorio.trim();
    const statusNormalizado = novoStatus.toLocaleLowerCase("pt-BR");

    const atendimentos = [...(atual.atendimentos || [])];

    if (
      statusNormalizado.includes("atendimento") ||
      statusNormalizado.includes("andamento")
    ) {
      atendimentos.push({
        tecnicoId: autor?.id ?? null,
        relatorio: textoRelatorio || "Atendimento iniciado.",
        dataHoraInicioAtendimento: agora,
        dataHoraFimAtendimento: null,
        pecasRequisitadas: [],
        pecasUtilizadas: [],
      });
    } else if (
      statusNormalizado.includes("finaliz") ||
      statusNormalizado.includes("conclu")
    ) {
      const indiceAberto = atendimentos.findLastIndex(
        (item) => !item.dataHoraFimAtendimento,
      );

      if (indiceAberto !== -1) {
        const aberto = atendimentos[indiceAberto];
        atendimentos[indiceAberto] = {
          ...aberto,
          dataHoraFimAtendimento: agora,
          relatorio: textoRelatorio
            ? aberto.relatorio && aberto.relatorio !== "Atendimento iniciado."
              ? `${aberto.relatorio}\n\nEncerramento: ${textoRelatorio}`
              : textoRelatorio
            : aberto.relatorio || "Atendimento finalizado.",
        };
      } else {
        atendimentos.push({
          tecnicoId: autor?.id ?? null,
          relatorio: textoRelatorio || "Atendimento finalizado.",
          dataHoraInicioAtendimento: agora,
          dataHoraFimAtendimento: agora,
          pecasRequisitadas: [],
          pecasUtilizadas: [],
        });
      }
    }

    const historico = [
      ...(Array.isArray(atual.historico) ? atual.historico : []),
      criarEventoHistorico({
        tipo: "status",
        titulo: `Status alterado de "${statusAnterior}" para "${novoStatus}"`,
        detalhe: textoRelatorio,
        usuario: autor,
      }),
    ];

    const atualizado = {
      ...atual,
      status: novoStatus,
      atendimentos,
      historico,
    };

    registros[indice] = atualizado;
    persistirAlteracao(registros, atualizado);

    return ocorrenciaObjectToInstance(atualizado);
  }

  static registrarAtendimento(id, { usuario = null, relatorio = "" } = {}) {
    const textoRelatorio = relatorio.trim();
    if (!textoRelatorio) return null;

    const registros = buscarRegistrosBrutos();
    const indice = registros.findIndex(
      (item) => String(item.id) === String(id),
    );

    if (indice === -1) {
      return null;
    }

    const autor = usuario || UsuarioService.buscarUsuarioLogado();
    const atual = registros[indice];
    const agora = new Date().toISOString();

    const atendimentos = [
      ...(atual.atendimentos || []),
      {
        tecnicoId: autor?.id ?? null,
        relatorio: textoRelatorio,
        dataHoraInicioAtendimento: agora,
        dataHoraFimAtendimento: null,
        pecasRequisitadas: [],
        pecasUtilizadas: [],
      },
    ];

    const historico = [
      ...(Array.isArray(atual.historico) ? atual.historico : []),
      criarEventoHistorico({
        tipo: "atendimento",
        titulo: "Registro técnico adicionado ao atendimento",
        detalhe: textoRelatorio,
        usuario: autor,
      }),
    ];

    const atualizado = {
      ...atual,
      atendimentos,
      historico,
    };

    registros[indice] = atualizado;
    persistirAlteracao(registros, atualizado);

    return ocorrenciaObjectToInstance(atualizado);
  }

  static avaliarOcorrencia(id, { nota, comentario = "", usuario = null } = {}) {
    const notaNumerica = Number(nota);
    if (!notaNumerica || notaNumerica < 1 || notaNumerica > 5) {
      throw new Error("Selecione uma nota entre 1 e 5 estrelas.");
    }

    const registros = buscarRegistrosBrutos();
    const indice = registros.findIndex(
      (item) => String(item.id) === String(id),
    );

    if (indice === -1) {
      return null;
    }

    const autor = usuario || UsuarioService.buscarUsuarioLogado();
    const atual = registros[indice];
    const textoComentario = comentario.trim();

    const historico = [
      ...(Array.isArray(atual.historico) ? atual.historico : []),
      criarEventoHistorico({
        tipo: "avaliacao",
        titulo: `Avaliação registrada (${notaNumerica}/5 estrelas)`,
        detalhe: textoComentario,
        usuario: autor,
      }),
    ];

    const atualizado = {
      ...atual,
      avaliacao: {
        nota: notaNumerica,
        comentario: textoComentario,
        dataAvaliacao: new Date().toISOString(),
      },
      historico,
    };

    registros[indice] = atualizado;
    persistirAlteracao(registros, atualizado);

    return ocorrenciaObjectToInstance(atualizado);
  }

  static inscreverAtualizacoes(callback) {
    const aoAlterarStorage = (event) => {
      if (event.key === null || event.key === CHAVE_STORAGE_OCORRENCIAS) {
        callback();
      }
    };

    window.addEventListener(EVENTO_OCORRENCIAS_ATUALIZADAS, callback);
    window.addEventListener("storage", aoAlterarStorage);
    window.addEventListener("focus", callback);

    return () => {
      window.removeEventListener(EVENTO_OCORRENCIAS_ATUALIZADAS, callback);
      window.removeEventListener("storage", aoAlterarStorage);
      window.removeEventListener("focus", callback);
    };
  }
}
