/*
import db from "../db";

import AtendimentoOcorrencia from "../domain/AtendimentoOcorrencia";

import Ocorrencia from "../domain/Ocorrencia";

import PecaAtendimento from "../domain/PecaAtendimento";

import ContratoService from "./ContratoService";

import PecaService from "./PecaService";

import UsuarioService from "./UsuarioService";

 

const STORAGE_KEY = "smartlift.novasOcorrencias";

const EVENT_NAME = "smartlift:ocorrencias-atualizadas";

 

function lerOcorrenciasSalvas() {

  try {

    const conteudo = localStorage.getItem(STORAGE_KEY);

    const registros = conteudo ? JSON.parse(conteudo) : [];

    return Array.isArray(registros) ? registros : [];

  } catch (error) {

    console.error("Erro ao ler ocorrências:", error);

    return [];

  }

}

 

const ocorrenciaObjectToInstance = (ocorrencia = {}) => {

  const instancia = new Ocorrencia(ocorrencia);

  instancia.contrato = ContratoService.buscarContratoPorId(instancia.contratoId);

 

  instancia.atendimentos = (ocorrencia.atendimentos ?? []).map((atendimento) => {

    const novo = new AtendimentoOcorrencia(atendimento);

    novo.tecnico = UsuarioService.buscarUsuarioPorId(novo.tecnicoId);

 

    const mapearPeca = (peca) => {

      const pecaId = peca.pecaId ?? peca.id;

      const item = new PecaAtendimento(pecaId, peca.quantidade);

      item.peca = PecaService.buscarPecaPorId(pecaId);

      return item;

    };

 

    novo.pecasRequisitadas = (atendimento.pecasRequisitadas ?? []).map(mapearPeca);

    novo.pecasUtilizadas = (atendimento.pecasUtilizadas ?? []).map(mapearPeca);

    return novo;

  });

 

  return instancia;

};

 

export default class OcorrenciaService {

  static buscarOcorrenciasBrutas() {

    const emMemoria = db.dados.ocorrencias ?? [];

    const persistidas = lerOcorrenciasSalvas();

    const porId = new Map();

 

    emMemoria.forEach((item) => porId.set(String(item.id), item));

    // O registro do storage prevalece se o id já existir.

    persistidas.forEach((item) => porId.set(String(item.id), item));

 

    return Array.from(porId.values()).sort(

      (a, b) => Number(b.id) - Number(a.id)

    );

  }

 

  static buscarOcorrencias() {

    return this.buscarOcorrenciasBrutas().map(ocorrenciaObjectToInstance);

  }

 

  static salvarNovaOcorrencia(ocorrencia) {

    const registros = this.buscarOcorrenciasBrutas();

    const id = String(ocorrencia.id);

    const atualizados = registros.filter((item) => String(item.id) !== id);

    atualizados.push(ocorrencia);

 

    try {

      localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizados));

    } catch (error) {

      console.error("Erro ao persistir ocorrência:", error);

      throw new Error("Não foi possível salvar a ocorrência neste navegador.");

    }

 

    if (!Array.isArray(db.dados.ocorrencias)) db.dados.ocorrencias = [];

    const indice = db.dados.ocorrencias.findIndex(

      (item) => String(item.id) === id

    );

    if (indice >= 0) db.dados.ocorrencias[indice] = ocorrencia;

    else db.dados.ocorrencias.push(ocorrencia);

 

    if (typeof window !== "undefined") {

      window.dispatchEvent(new CustomEvent(EVENT_NAME));

    }

 

    return ocorrenciaObjectToInstance(ocorrencia);

  }

 

  static buscarOcorrenciasPorClienteId(idCliente) {

    return this.buscarOcorrencias().filter(

      (item) => item.contrato?.idCliente === idCliente

    );

  }

 

  static buscarOcorrenciaPorId(id) {

    const item = this.buscarOcorrenciasBrutas().find(

      (oc) => String(oc.id) === String(id)

    );

    return item ? ocorrenciaObjectToInstance(item) : null;

  }

}

 

export { STORAGE_KEY, EVENT_NAME }; */


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
    registrosStorage = JSON.parse(
      localStorage.getItem(CHAVE_STORAGE) || "[]"
    );

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

  novaOcorrencia.contrato =
    ContratoService.buscarContratoPorId(
      novaOcorrencia.contratoId
    );

  novaOcorrencia.atendimentos = (
    ocorrencia.atendimentos || []
  ).map((atendimento) => {
    const novoAtendimento = new AtendimentoOcorrencia(
      atendimento
    );

    novoAtendimento.tecnico =
      UsuarioService.buscarUsuarioPorId(
        novoAtendimento.tecnicoId
      );

    const mapearPeca = (peca) => {
      const pecaAtendimento = new PecaAtendimento(
        peca.pecaId ?? peca.id,
        peca.quantidade
      );

      pecaAtendimento.peca =
        PecaService.buscarPecaPorId(
          pecaAtendimento.pecaId
        );

      return pecaAtendimento;
    };

    novoAtendimento.pecasRequisitadas = (
      atendimento.pecasRequisitadas || []
    ).map(mapearPeca);

    novoAtendimento.pecasUtilizadas = (
      atendimento.pecasUtilizadas || []
    ).map(mapearPeca);

    return novoAtendimento;
  });

  return novaOcorrencia;
}

export default class OcorrenciaService {
  static buscarOcorrencias() {
    return buscarRegistrosBrutos().map(
      ocorrenciaObjectToInstance
    );
  }

  static buscarOcorrenciasPorClienteId(idCliente) {
    return this.buscarOcorrencias().filter(
      (ocorrencia) =>
        ocorrencia.contrato?.idCliente === idCliente
    );
  }

  static buscarOcorrenciaPorId(id) {
    const ocorrencia = buscarRegistrosBrutos().find(
      (item) => String(item.id) === String(id)
    );

    return ocorrencia
      ? ocorrenciaObjectToInstance(ocorrencia)
      : null;
  }

  static salvarNovaOcorrencia(novaOcorrencia) {
    const registros = buscarRegistrosBrutos();

    const existe = registros.some(
      (item) => String(item.id) === String(novaOcorrencia.id)
    );

    if (existe) {
      throw new Error("Esta ocorrência já foi cadastrada.");
    }

    const registro = {
      ...novaOcorrencia,
      dataCriacao:
        novaOcorrencia.dataCriacao || new Date().toISOString(),
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
        registros.filter((item) =>
          String(item.id).startsWith("DEMO-") === false
        )
      )
    );

    // Atualiza o dashboard na mesma aba.
    window.dispatchEvent(
      new Event("smartlift:ocorrencias-atualizadas")
    );

    return ocorrenciaObjectToInstance(registro);
  }
}
