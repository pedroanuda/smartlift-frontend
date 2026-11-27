export const CHAVE_STORAGE_NOTIFICACOES = "smartlift.notificacoesLidas";
export const EVENTO_NOTIFICACOES_ATUALIZADAS = "smartlift:notificacoes-atualizadas";

function lerMapaLidas() {
  try {
    const dados = localStorage.getItem(CHAVE_STORAGE_NOTIFICACOES);
    const mapa = JSON.parse(dados || "{}");

    return mapa && typeof mapa === "object" && !Array.isArray(mapa) ? mapa : {};
  } catch (erro) {
    console.error("Erro ao ler notificações lidas:", erro);
    return {};
  }
}

function salvarMapaLidas(mapa) {
  try {
    localStorage.setItem(CHAVE_STORAGE_NOTIFICACOES, JSON.stringify(mapa));
  } catch (erro) {
    console.error("Erro ao salvar notificações lidas:", erro);
  }
}

export default class NotificacaoService {
  static buscarIdsLidas(usuarioId) {
    if (usuarioId == null) return [];

    const mapa = lerMapaLidas();
    const ids = mapa[String(usuarioId)];

    return Array.isArray(ids) ? ids : [];
  }

  static marcarComoLida(usuarioId, notificacaoId) {
    if (usuarioId == null || !notificacaoId) return;

    const chaveUsuario = String(usuarioId);
    const mapa = lerMapaLidas();
    const atuais = Array.isArray(mapa[chaveUsuario]) ? mapa[chaveUsuario] : [];

    if (atuais.includes(notificacaoId)) return;

    mapa[chaveUsuario] = [...atuais, notificacaoId];
    salvarMapaLidas(mapa);
    window.dispatchEvent(new Event(EVENTO_NOTIFICACOES_ATUALIZADAS));
  }

  static marcarTodasComoLidas(usuarioId, notificacaoIds = []) {
    if (usuarioId == null || notificacaoIds.length === 0) return;

    const chaveUsuario = String(usuarioId);
    const mapa = lerMapaLidas();
    const atuais = Array.isArray(mapa[chaveUsuario]) ? mapa[chaveUsuario] : [];
    const conjunto = new Set([...atuais, ...notificacaoIds]);

    if (conjunto.size === atuais.length) return;

    mapa[chaveUsuario] = Array.from(conjunto);
    salvarMapaLidas(mapa);
    window.dispatchEvent(new Event(EVENTO_NOTIFICACOES_ATUALIZADAS));
  }

  static inscreverAtualizacoes(callback) {
    const aoAlterarStorage = (event) => {
      if (event.key === null || event.key === CHAVE_STORAGE_NOTIFICACOES) {
        callback();
      }
    };

    window.addEventListener(EVENTO_NOTIFICACOES_ATUALIZADAS, callback);
    window.addEventListener("storage", aoAlterarStorage);
    window.addEventListener("focus", callback);

    return () => {
      window.removeEventListener(EVENTO_NOTIFICACOES_ATUALIZADAS, callback);
      window.removeEventListener("storage", aoAlterarStorage);
      window.removeEventListener("focus", callback);
    };
  }
}
