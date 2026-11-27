/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router";
import styled from "styled-components";

import {
  DashboardColumn,
  DashboardColumns,
  DashboardIntro,
  DashboardMain,
  DashboardShell,
} from "../components/dashboard/DashboardLayout";
import { ServiceTimeline } from "../components/dashboard/CustomerDashboardWidgets";

import OcorrenciaService from "../services/OcorrenciaService";
import UsuarioService from "../services/UsuarioService";

const BackRow = styled.div`
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.48rem 0.85rem;
  border: 1px solid #d9e1ec;
  border-radius: 8px;
  background: #fff;
  color: #172a4c;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.15s ease;

  &:hover {
    background: #eef3fb;
    border-color: #1765b1;
    color: #1765b1;
  }
`;

const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const StatusActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.85rem;
  border: ${({ $secondary }) => ($secondary ? "1px solid #d7e2f1" : "0")};
  border-radius: 8px;
  background: ${({ $tone, $secondary }) =>
    $secondary ? "#f7faff" : $tone === "success" ? "#2f7d42" : "#1765b1"};
  color: ${({ $secondary }) => ($secondary ? "#1765b1" : "#fff")};
  font-size: 0.76rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.15s ease;

  &:hover:not(:disabled) {
    opacity: 0.92;
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const Card = styled.section`
  background: #fff;
  border: 1px solid #e7ebf1;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 3px 12px rgba(20, 40, 70, 0.04);
  margin-bottom: 0.9rem;

  &:last-child {
    margin-bottom: 0;
  }

  h2 {
    color: #102b50;
    font-size: 0.95rem;
    margin-bottom: 0.85rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const HeroHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  padding-bottom: 1rem;
  border-bottom: 1px solid #edf0f4;
`;

const CodeTag = styled.span`
  display: inline-block;
  font-size: 0.74rem;
  font-weight: 700;
  color: #1765b1;
  margin-bottom: 0.35rem;
`;

const HeroTitle = styled.h2`
  margin: 0 !important;
  font-size: 1.12rem !important;
  color: #102b50;
`;

const Badges = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  flex-wrap: wrap;
`;

const StatusPill = styled.span`
  padding: 0.32rem 0.7rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  background: ${({ $group }) =>
    $group === "concluidas"
      ? "#e7f5e9"
      : $group === "atendimento"
        ? "#eaf0ff"
        : "#fff3de"};
  color: ${({ $group }) =>
    $group === "concluidas"
      ? "#2f7d42"
      : $group === "atendimento"
        ? "#2859b4"
        : "#996512"};
`;

const PriorityPill = styled.span`
  padding: 0.32rem 0.7rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  background: ${({ $priority }) =>
    $priority === "alta"
      ? "#fdeeee"
      : $priority === "baixa"
        ? "#e7f5e9"
        : "#fff4df"};
  color: ${({ $priority }) =>
    $priority === "alta"
      ? "#c53030"
      : $priority === "baixa"
        ? "#2f7d42"
        : "#996512"};
`;

const MetaGrid = styled.dl`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.9rem;
  margin-top: 1rem;

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }

  div {
    display: grid;
    gap: 0.2rem;
  }

  dt {
    font-size: 0.7rem;
    color: #7b889b;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  dd {
    font-size: 0.82rem;
    font-weight: 600;
    color: #172a4c;
  }
`;

const DescriptionText = styled.p`
  color: #3d4d63;
  font-size: 0.86rem;
  line-height: 1.65;
  white-space: pre-wrap;
`;

const InfoList = styled.dl`
  display: grid;
  gap: 0.7rem;

  div {
    display: grid;
    gap: 0.15rem;
    padding-bottom: 0.65rem;
    border-bottom: 1px solid #f1f3f7;

    &:last-child {
      padding-bottom: 0;
      border-bottom: 0;
    }
  }

  dt {
    font-size: 0.7rem;
    color: #7b889b;
  }

  dd {
    font-size: 0.82rem;
    font-weight: 600;
    color: #172a4c;
  }
`;

const AttachmentList = styled.ul`
  list-style: none;
  display: grid;
  gap: 0.55rem;

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.65rem 0.8rem;
    border-radius: 8px;
    border: 1px solid #e7ebf1;
    background: #fbfcfe;
    font-size: 0.8rem;
    color: #172a4c;
  }

  span {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    font-weight: 600;
  }

  small {
    color: #758196;
    font-size: 0.72rem;
  }
`;

const ServiceItem = styled.div`
  padding: 0.9rem;
  border-radius: 10px;
  border: 1px solid #e8ecf2;
  background: #fbfcfe;
  display: grid;
  gap: 0.45rem;
  margin-bottom: 0.75rem;

  &:last-child {
    margin-bottom: 0;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    flex-wrap: wrap;
    font-size: 0.8rem;
    color: #102b50;
  }

  p {
    color: #4f5f75;
    font-size: 0.82rem;
    line-height: 1.5;
    white-space: pre-wrap;
  }

  small {
    color: #758196;
    font-size: 0.74rem;
  }
`;

const PartsTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.25rem;

  span {
    padding: 0.25rem 0.55rem;
    border-radius: 6px;
    background: #eef3fb;
    color: #1755b5;
    font-size: 0.72rem;
    font-weight: 600;
  }
`;

const FormBlock = styled.form`
  display: grid;
  gap: 0.75rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 5rem;
  padding: 0.75rem;
  border: 1px solid #d5dce6;
  border-radius: 8px;
  font: inherit;
  font-size: 0.82rem;
  color: #172a4c;
  resize: vertical;

  &:focus {
    outline: 2px solid #1765b1;
    border-color: #1765b1;
  }
`;

const StarPicker = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-wrap: wrap;

  button {
    border: 0;
    background: transparent;
    padding: 0.15rem;
    font-size: 1.45rem;
    color: #d0d7e2;
    cursor: pointer;
    transition:
      transform 0.12s ease,
      color 0.12s ease;

    &[data-filled="true"] {
      color: #f0a500;
    }

    &:hover {
      transform: scale(1.12);
    }
  }

  span {
    margin-left: 0.35rem;
    font-size: 0.78rem;
    font-weight: 600;
    color: #5b6a80;
  }
`;

const Stars = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  color: #f0a500;
  font-size: 0.95rem;
  margin-bottom: 0.4rem;
`;

const FormFeedback = styled.p`
  font-size: 0.78rem;
  font-weight: 600;
  color: ${({ $error }) => ($error ? "#c53030" : "#2f7d42")};
`;

const HistoryList = styled.ol`
  list-style: none;
  display: grid;
  gap: 0.75rem;
`;

const HistoryItem = styled.li`
  display: grid;
  grid-template-columns: 2rem minmax(0, 1fr);
  gap: 0.75rem;
  align-items: start;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f1f3f7;

  &:last-child {
    padding-bottom: 0;
    border-bottom: 0;
  }
`;

const HistoryIcon = styled.span`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  display: grid;
  place-items: center;
  font-size: 0.78rem;
`;

const HistoryContent = styled.div`
  display: grid;
  gap: 0.2rem;

  strong {
    font-size: 0.82rem;
    color: #102b50;
  }

  p {
    font-size: 0.78rem;
    color: #526278;
    line-height: 1.45;
    white-space: pre-wrap;
  }

  small {
    font-size: 0.7rem;
    color: #8290a2;
  }
`;

const MutedText = styled.p`
  color: #758196;
  font-size: 0.82rem;
`;

const NotFoundCard = styled(Card)`
  text-align: center;
  padding: 2.5rem 1.5rem;
  display: grid;
  justify-items: center;
  gap: 0.75rem;

  i {
    font-size: 2rem;
    color: #8a98ac;
  }

  h2 {
    margin: 0;
    justify-content: center;
  }
`;

const TIMELINE_STEPS = [
  ["Ocorrência registrada", "Solicitação recebida no sistema."],
  ["Em análise", "Equipe avaliando os detalhes do problema."],
  ["Em atendimento", "Técnico alocado para execução do serviço."],
  ["Concluída", "Atendimento finalizado."],
];

const FREQUENCY_LABELS = {
  todo: "O tempo todo",
  intermitente: "Intermitente",
  horario: "Horário específico",
};

const ROLE_LABELS = {
  cliente: "Cliente",
  tecnico: "Técnico",
  gestor: "Gestor",
  sistema: "Sistema",
};

const HISTORY_STYLES = {
  criacao: { bg: "#eaf0ff", color: "#1765b1", icon: "fa-solid fa-plus" },
  status: {
    bg: "#fff4df",
    color: "#b67a19",
    icon: "fa-solid fa-arrows-rotate",
  },
  atendimento: { bg: "#eef3fb", color: "#2859b4", icon: "fa-solid fa-wrench" },
  avaliacao: { bg: "#e7f5e9", color: "#2f7d42", icon: "fa-solid fa-star" },
};

function getGroup(status = "") {
  const normalized = status.toLocaleLowerCase("pt-BR");
  if (
    normalized.includes("finaliz") ||
    normalized.includes("conclu") ||
    normalized.includes("encerr")
  ) {
    return "concluidas";
  }
  if (
    normalized.includes("atendimento") ||
    normalized.includes("andamento") ||
    normalized.includes("execução")
  ) {
    return "atendimento";
  }
  return "abertas";
}

function getTimelinePosition(status = "") {
  const group = getGroup(status);
  if (group === "concluidas") return 3;
  if (group === "atendimento") return 2;
  const normalized = status.toLocaleLowerCase("pt-BR");
  if (normalized.includes("análise") || normalized.includes("analise"))
    return 1;
  return 0;
}

function formatDateTime(value) {
  if (!value) return "Não informada";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Não informada";
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatFileSize(bytes) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getOccurrenceCode(ocorrencia) {
  if (String(ocorrencia.id).startsWith("DEMO-")) {
    return `#${ocorrencia.id}`;
  }
  const date =
    ocorrencia.atendimentos?.[0]?.dataHoraInicioAtendimento ||
    ocorrencia.dataCriacao;
  const year = date ? new Date(date).getFullYear() : new Date().getFullYear();
  return `#OCOR-${year}-${String(ocorrencia.id).padStart(5, "0")}`;
}

function buildFallbackHistory(ocorrencia) {
  const eventos = [];

  if (ocorrencia.dataCriacao) {
    eventos.push({
      id: "fallback-criacao",
      dataHora: ocorrencia.dataCriacao,
      tipo: "criacao",
      titulo: "Ocorrência registrada",
      detalhe: `Status atual: ${ocorrencia.status || "Pendente"}`,
      autorNome: "Sistema",
      autorTipo: "sistema",
    });
  }

  (ocorrencia.atendimentos || []).forEach((atendimento, idx) => {
    const tecnicoNome = atendimento.tecnico
      ? `${atendimento.tecnico.nome} ${atendimento.tecnico.sobrenome || ""}`.trim()
      : "Técnico";

    eventos.push({
      id: `fallback-atendimento-${idx}`,
      dataHora:
        atendimento.dataHoraFimAtendimento ||
        atendimento.dataHoraInicioAtendimento,
      tipo: "atendimento",
      titulo: atendimento.dataHoraFimAtendimento
        ? "Atendimento concluído"
        : "Atendimento em andamento",
      detalhe: atendimento.relatorio || "",
      autorNome: tecnicoNome,
      autorTipo: "tecnico",
    });
  });

  if (ocorrencia.avaliacao?.nota) {
    eventos.push({
      id: "fallback-avaliacao",
      dataHora: ocorrencia.avaliacao.dataAvaliacao || ocorrencia.dataCriacao,
      tipo: "avaliacao",
      titulo: `Avaliação registrada (${ocorrencia.avaliacao.nota}/5 estrelas)`,
      detalhe: ocorrencia.avaliacao.comentario || "",
      autorNome: "Cliente",
      autorTipo: "cliente",
    });
  }

  return eventos;
}

function buildNavigation(usuario, navigate) {
  if (usuario.tipo === "cliente") {
    return {
      roleLabel: "Cliente",
      sidebarLabel: "Navegação do cliente",
      backPath: "/cliente/ocorrencias",
      items: [
        {
          label: "Painel do Cliente",
          icon: <i className="fa-solid fa-house" aria-hidden="true" />,
          onClick: () => navigate("/"),
        },
        {
          label: "Minhas Ocorrências",
          icon: <i className="fa-solid fa-clipboard-list" aria-hidden="true" />,
          active: true,
          onClick: () => navigate("/cliente/ocorrencias"),
        },
        {
          label: "Nova Ocorrência",
          icon: <i className="fa-solid fa-circle-plus" aria-hidden="true" />,
          onClick: () => navigate("/ocorrencias/nova"),
        },
        {
          label: "Meus Equipamentos",
          icon: <i className="fa-solid fa-elevator" aria-hidden="true" />,
          onClick: () => navigate("/cliente/equipamentos"),
        },
        {
          label: "Notificações",
          icon: <i className="fa-solid fa-bell" aria-hidden="true" />,
          onClick: () => navigate("/cliente/notificacoes"),
        },
      ],
    };
  }

  if (usuario.tipo === "tecnico") {
    return {
      roleLabel: "Técnico",
      sidebarLabel: "Navegação do técnico",
      backPath: "/tecnico/ocorrencias",
      items: [
        {
          label: "Painel do Técnico",
          icon: <i className="fa-solid fa-house" aria-hidden="true" />,
          onClick: () => navigate("/"),
        },
        {
          label: "Ocorrências Atribuídas",
          icon: <i className="fa-solid fa-clipboard-list" aria-hidden="true" />,
          active: true,
          onClick: () => navigate("/tecnico/ocorrencias"),
        },
        {
          label: "Notificações",
          icon: <i className="fa-solid fa-bell" aria-hidden="true" />,
          onClick: () => navigate("/tecnico/notificacoes"),
        },
        {
          label: "Ajuda e Suporte",
          icon: (
            <i className="fa-solid fa-circle-question" aria-hidden="true" />
          ),
          onClick: () => navigate("/tecnico/suporte"),
        },
      ],
    };
  }

  return {
    roleLabel: "Gestor",
    sidebarLabel: "Navegação do gestor",
    backPath: "/gestor/ocorrencias",
    items: [
      {
        label: "Visão geral",
        icon: <i className="fa-solid fa-chart-pie" aria-hidden="true" />,
        onClick: () => navigate("/"),
      },
      {
        label: "Ocorrências",
        icon: <i className="fa-solid fa-clipboard-list" aria-hidden="true" />,
        active: true,
        onClick: () => navigate("/gestor/ocorrencias"),
      },
      {
        label: "Indicadores",
        icon: <i className="fa-solid fa-chart-column" aria-hidden="true" />,
        onClick: () => navigate("/gestor/indicadores"),
      },
      {
        label: "Notificações",
        icon: <i className="fa-solid fa-bell" aria-hidden="true" />,
        onClick: () => navigate("/gestor/notificacoes"),
      },
    ],
  };
}

export default function OcorrenciaDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const outletContext = useOutletContext() || {};
  const usuario = outletContext.usuario || UsuarioService.buscarUsuarioLogado();

  const ocorrenciaDemo = location.state?.ocorrenciaDemo;

  const [ocorrencia, setOcorrencia] = useState(
    () => OcorrenciaService.buscarOcorrenciaPorId(id) || ocorrenciaDemo || null,
  );

  // Estado do formulário de avaliação do cliente
  const [notaSelecionada, setNotaSelecionada] = useState(0);
  const [notaHover, setNotaHover] = useState(0);
  const [comentarioAvaliacao, setComentarioAvaliacao] = useState("");
  const [feedbackAvaliacao, setFeedbackAvaliacao] = useState({
    texto: "",
    erro: false,
  });

  // Estado do registro de atendimento (técnico/gestor)
  const [relatorioAtendimento, setRelatorioAtendimento] = useState("");
  const [feedbackAtendimento, setFeedbackAtendimento] = useState({
    texto: "",
    erro: false,
  });

  useEffect(() => {
    const atualizar = () => {
      setOcorrencia(
        OcorrenciaService.buscarOcorrenciaPorId(id) || ocorrenciaDemo || null,
      );
    };

    return OcorrenciaService.inscreverAtualizacoes(atualizar);
  }, [id, ocorrenciaDemo]);

  const navConfig = buildNavigation(usuario, navigate);

  const acessoNegado =
    ocorrencia &&
    usuario.tipo === "cliente" &&
    ocorrencia.contrato?.idCliente != null &&
    ocorrencia.contrato.idCliente !== usuario.id;

  const ehRegistroReal = Boolean(ocorrencia && ocorrencia.origem !== "demo");
  const group = ocorrencia ? getGroup(ocorrencia.status) : "abertas";
  const priorityNormalized = (
    ocorrencia?.prioridade || "Média"
  ).toLocaleLowerCase("pt-BR");
  const contrato = ocorrencia?.contrato;
  const localizacao = contrato?.localizacao;
  const clienteOcorrencia = contrato?.idCliente
    ? UsuarioService.buscarUsuarioPorId(contrato.idCliente)
    : null;

  const historicoExibido = ocorrencia
    ? [
        ...(ocorrencia.historico?.length
          ? ocorrencia.historico
          : buildFallbackHistory(ocorrencia)),
      ].reverse()
    : [];

  const alterarStatus = (novoStatus) => {
    if (!ehRegistroReal) return;
    const atualizada = OcorrenciaService.atualizarStatusOcorrencia(
      ocorrencia.id,
      novoStatus,
      {
        usuario,
        relatorio: relatorioAtendimento,
      },
    );
    if (atualizada) {
      setOcorrencia(atualizada);
      setRelatorioAtendimento("");
      setFeedbackAtendimento({
        texto: `Status atualizado para "${novoStatus}" e registrado no histórico.`,
        erro: false,
      });
    }
  };

  const handleRegistrarAtualizacao = (event) => {
    event.preventDefault();
    if (!ehRegistroReal) return;

    if (!relatorioAtendimento.trim()) {
      setFeedbackAtendimento({
        texto: "Escreva um relatório ou observação antes de registrar.",
        erro: true,
      });
      return;
    }

    const atualizada = OcorrenciaService.registrarAtendimento(ocorrencia.id, {
      usuario,
      relatorio: relatorioAtendimento,
    });

    if (atualizada) {
      setOcorrencia(atualizada);
      setRelatorioAtendimento("");
      setFeedbackAtendimento({
        texto: "Registro técnico adicionado ao histórico de atendimentos.",
        erro: false,
      });
    }
  };

  const handleEnviarAvaliacao = (event) => {
    event.preventDefault();
    if (!ehRegistroReal) return;

    if (notaSelecionada < 1 || notaSelecionada > 5) {
      setFeedbackAvaliacao({
        texto: "Selecione uma nota de 1 a 5 estrelas.",
        erro: true,
      });
      return;
    }

    try {
      const atualizada = OcorrenciaService.avaliarOcorrencia(ocorrencia.id, {
        nota: notaSelecionada,
        comentario: comentarioAvaliacao,
        usuario,
      });

      if (atualizada) {
        setOcorrencia(atualizada);
        setFeedbackAvaliacao({
          texto: "Obrigado! Sua avaliação foi registrada com sucesso.",
          erro: false,
        });
      }
    } catch (erro) {
      setFeedbackAvaliacao({
        texto: erro.message || "Não foi possível salvar a avaliação.",
        erro: true,
      });
    }
  };

  return (
    <DashboardShell
      user={usuario}
      role={navConfig.roleLabel}
      sidebarLabel={navConfig.sidebarLabel}
      navigation={navConfig.items}
      helpCard={{
        title: "Precisa de ajuda?",
        description: "Fale com a nossa central de atendimento 24h.",
        href: "mailto:suporte@smartlift.com.br",
        action: "Abrir chamado",
      }}
    >
      <DashboardMain>
        <BackRow>
          <BackButton
            type="button"
            onClick={() => navigate(navConfig.backPath)}
          >
            <i className="fa-solid fa-arrow-left" aria-hidden="true" />
            Voltar para ocorrências
          </BackButton>

          {ocorrencia &&
            !acessoNegado &&
            ehRegistroReal &&
            usuario.tipo !== "cliente" && (
              <ActionGroup>
                {group === "abertas" && (
                  <StatusActionButton
                    type="button"
                    onClick={() => alterarStatus("Em atendimento")}
                  >
                    <i className="fa-solid fa-play" aria-hidden="true" />
                    Iniciar atendimento
                  </StatusActionButton>
                )}
                {group !== "concluidas" && (
                  <StatusActionButton
                    type="button"
                    $tone="success"
                    onClick={() => alterarStatus("Finalizada")}
                  >
                    <i className="fa-solid fa-check" aria-hidden="true" />
                    Finalizar ocorrência
                  </StatusActionButton>
                )}
              </ActionGroup>
            )}
        </BackRow>

        {!ocorrencia || acessoNegado ? (
          <NotFoundCard>
            <i className="fa-solid fa-file-circle-xmark" aria-hidden="true" />
            <h2>Ocorrência não encontrada</h2>
            <MutedText>
              {acessoNegado
                ? "Você não tem permissão para visualizar esta ocorrência."
                : "Não encontramos nenhum registro com o código informado."}
            </MutedText>
            <BackButton
              type="button"
              onClick={() => navigate(navConfig.backPath)}
            >
              Ir para lista de ocorrências
            </BackButton>
          </NotFoundCard>
        ) : (
          <>
            <DashboardIntro
              title={`Detalhes da ocorrência ${getOccurrenceCode(ocorrencia)}`}
              subtitle="Acompanhe todas as informações técnicas, histórico de atendimentos e status atual."
            />

            <DashboardColumns>
              <DashboardColumn>
                <Card>
                  <HeroHeader>
                    <div>
                      <CodeTag>{getOccurrenceCode(ocorrencia)}</CodeTag>
                      <HeroTitle>
                        {ocorrencia.categoria || "Ocorrência"} —{" "}
                        {contrato?.produtoApelido ||
                          ocorrencia.equipamento ||
                          "Equipamento"}
                      </HeroTitle>
                    </div>

                    <Badges>
                      <PriorityPill $priority={priorityNormalized}>
                        Prioridade {ocorrencia.prioridade || "Média"}
                      </PriorityPill>
                      <StatusPill $group={group}>
                        {ocorrencia.status || "Pendente"}
                      </StatusPill>
                    </Badges>
                  </HeroHeader>

                  <MetaGrid>
                    <div>
                      <dt>Data de abertura</dt>
                      <dd>
                        {formatDateTime(
                          ocorrencia.dataCriacao ||
                            ocorrencia.atendimentos?.[0]
                              ?.dataHoraInicioAtendimento,
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt>Contrato</dt>
                      <dd>{ocorrencia.contratoId || "Demonstrativo"}</dd>
                    </div>
                    <div>
                      <dt>Frequência</dt>
                      <dd>
                        {ocorrencia.frequencia
                          ? `${FREQUENCY_LABELS[ocorrencia.frequencia] || ocorrencia.frequencia}${ocorrencia.horario ? ` (${ocorrencia.horario})` : ""}`
                          : "Não informada"}
                      </dd>
                    </div>
                  </MetaGrid>
                </Card>

                <Card>
                  <h2>
                    <i className="fa-solid fa-align-left" aria-hidden="true" />
                    Descrição do problema
                  </h2>
                  <DescriptionText>
                    {ocorrencia.descricao || "Nenhuma descrição informada."}
                  </DescriptionText>
                </Card>

                {ocorrencia.anexos?.length > 0 && (
                  <Card>
                    <h2>
                      <i className="fa-solid fa-paperclip" aria-hidden="true" />
                      Anexos ({ocorrencia.anexos.length})
                    </h2>
                    <AttachmentList>
                      {ocorrencia.anexos.map((anexo, index) => (
                        <li key={`${anexo.nome}-${index}`}>
                          <span>
                            <i
                              className="fa-regular fa-file"
                              aria-hidden="true"
                            />
                            {anexo.nome}
                          </span>
                          <small>{formatFileSize(anexo.tamanho)}</small>
                        </li>
                      ))}
                    </AttachmentList>
                  </Card>
                )}

                {ehRegistroReal &&
                  usuario.tipo !== "cliente" &&
                  group !== "concluidas" && (
                    <Card>
                      <h2>
                        <i
                          className="fa-solid fa-pen-to-square"
                          aria-hidden="true"
                        />
                        Registrar atendimento ou atualização
                      </h2>
                      <FormBlock onSubmit={handleRegistrarAtualizacao}>
                        <TextArea
                          placeholder="Descreva o diagnóstico, ações realizadas ou observações técnicas..."
                          value={relatorioAtendimento}
                          onChange={(event) => {
                            setRelatorioAtendimento(event.target.value);
                            setFeedbackAtendimento({ texto: "", erro: false });
                          }}
                        />

                        {feedbackAtendimento.texto && (
                          <FormFeedback
                            $error={feedbackAtendimento.erro}
                            role="status"
                          >
                            {feedbackAtendimento.texto}
                          </FormFeedback>
                        )}

                        <ActionGroup>
                          {group === "abertas" && (
                            <StatusActionButton
                              type="button"
                              onClick={() => alterarStatus("Em atendimento")}
                            >
                              <i
                                className="fa-solid fa-play"
                                aria-hidden="true"
                              />
                              Iniciar atendimento
                            </StatusActionButton>
                          )}

                          <StatusActionButton type="submit" $secondary>
                            <i
                              className="fa-solid fa-plus"
                              aria-hidden="true"
                            />
                            Adicionar registro técnico
                          </StatusActionButton>

                          <StatusActionButton
                            type="button"
                            $tone="success"
                            onClick={() => alterarStatus("Finalizada")}
                          >
                            <i
                              className="fa-solid fa-check"
                              aria-hidden="true"
                            />
                            Finalizar ocorrência
                          </StatusActionButton>
                        </ActionGroup>
                      </FormBlock>
                    </Card>
                  )}

                <Card>
                  <h2>
                    <i
                      className="fa-solid fa-screwdriver-wrench"
                      aria-hidden="true"
                    />
                    Histórico de atendimentos (
                    {ocorrencia.atendimentos?.length || 0})
                  </h2>
                  {ocorrencia.atendimentos?.length > 0 ? (
                    ocorrencia.atendimentos.map((atendimento, index) => (
                      <ServiceItem key={index}>
                        <header>
                          <strong>
                            Técnico:{" "}
                            {atendimento.tecnico
                              ? `${atendimento.tecnico.nome} ${atendimento.tecnico.sobrenome || ""}`.trim()
                              : atendimento.tecnicoId
                                ? `ID #${atendimento.tecnicoId}`
                                : "Equipe SmartLift"}
                          </strong>
                          <small>
                            {formatDateTime(
                              atendimento.dataHoraInicioAtendimento,
                            )}
                            {atendimento.dataHoraFimAtendimento
                              ? ` até ${formatDateTime(atendimento.dataHoraFimAtendimento)}`
                              : " · Em aberto"}
                          </small>
                        </header>
                        <p>
                          {atendimento.relatorio || "Sem relatório registrado."}
                        </p>
                        {atendimento.pecasUtilizadas?.length > 0 && (
                          <PartsTags>
                            {atendimento.pecasUtilizadas.map((item, idx) => (
                              <span key={idx}>
                                {item.peca?.nome || `Peça #${item.pecaId}`} ×{" "}
                                {item.quantidade}
                              </span>
                            ))}
                          </PartsTags>
                        )}
                      </ServiceItem>
                    ))
                  ) : (
                    <MutedText>
                      Nenhum atendimento técnico registrado até o momento.
                    </MutedText>
                  )}
                </Card>

                <Card>
                  <h2>
                    <i
                      className="fa-solid fa-clock-rotate-left"
                      aria-hidden="true"
                    />
                    Histórico de alterações
                  </h2>
                  {historicoExibido.length > 0 ? (
                    <HistoryList>
                      {historicoExibido.map((evento) => {
                        const estilo =
                          HISTORY_STYLES[evento.tipo] || HISTORY_STYLES.status;
                        return (
                          <HistoryItem key={evento.id}>
                            <HistoryIcon $bg={estilo.bg} $color={estilo.color}>
                              <i className={estilo.icon} aria-hidden="true" />
                            </HistoryIcon>
                            <HistoryContent>
                              <strong>{evento.titulo}</strong>
                              {evento.detalhe && <p>{evento.detalhe}</p>}
                              <small>
                                {evento.autorNome} (
                                {ROLE_LABELS[evento.autorTipo] ||
                                  evento.autorTipo}
                                ) · {formatDateTime(evento.dataHora)}
                              </small>
                            </HistoryContent>
                          </HistoryItem>
                        );
                      })}
                    </HistoryList>
                  ) : (
                    <MutedText>Nenhuma alteração registrada ainda.</MutedText>
                  )}
                </Card>

                <Card>
                  <h2>
                    <i className="fa-solid fa-star" aria-hidden="true" />
                    Avaliação do atendimento
                  </h2>
                  {ocorrencia.avaliacao?.nota ? (
                    <>
                      <Stars
                        aria-label={`Nota ${ocorrencia.avaliacao.nota} de 5`}
                      >
                        {[1, 2, 3, 4, 5].map((estrela) => (
                          <i
                            key={estrela}
                            className={
                              estrela <= ocorrencia.avaliacao.nota
                                ? "fa-solid fa-star"
                                : "fa-regular fa-star"
                            }
                            aria-hidden="true"
                          />
                        ))}
                      </Stars>
                      <DescriptionText>
                        {ocorrencia.avaliacao.comentario ||
                          "Sem comentário adicional."}
                      </DescriptionText>
                      {feedbackAvaliacao.texto && !feedbackAvaliacao.erro && (
                        <FormFeedback
                          role="status"
                          style={{ marginTop: "0.6rem" }}
                        >
                          {feedbackAvaliacao.texto}
                        </FormFeedback>
                      )}
                    </>
                  ) : usuario.tipo === "cliente" && ehRegistroReal ? (
                    <FormBlock onSubmit={handleEnviarAvaliacao}>
                      <MutedText>
                        Como você avalia o atendimento desta ocorrência?
                      </MutedText>

                      <StarPicker
                        role="radiogroup"
                        aria-label="Nota de 1 a 5 estrelas"
                      >
                        {[1, 2, 3, 4, 5].map((estrela) => {
                          const preenchida =
                            estrela <= (notaHover || notaSelecionada);
                          return (
                            <button
                              key={estrela}
                              type="button"
                              data-filled={preenchida}
                              aria-label={`${estrela} ${estrela === 1 ? "estrela" : "estrelas"}`}
                              aria-pressed={notaSelecionada === estrela}
                              onMouseEnter={() => setNotaHover(estrela)}
                              onMouseLeave={() => setNotaHover(0)}
                              onClick={() => {
                                setNotaSelecionada(estrela);
                                setFeedbackAvaliacao({
                                  texto: "",
                                  erro: false,
                                });
                              }}
                            >
                              <i
                                className={
                                  preenchida
                                    ? "fa-solid fa-star"
                                    : "fa-regular fa-star"
                                }
                                aria-hidden="true"
                              />
                            </button>
                          );
                        })}
                        <span>
                          {notaSelecionada > 0
                            ? `${notaSelecionada} de 5 estrelas`
                            : "Selecione uma nota"}
                        </span>
                      </StarPicker>

                      <TextArea
                        placeholder="Deixe um comentário sobre o atendimento (opcional)..."
                        value={comentarioAvaliacao}
                        onChange={(event) =>
                          setComentarioAvaliacao(event.target.value)
                        }
                      />

                      {feedbackAvaliacao.texto && (
                        <FormFeedback
                          $error={feedbackAvaliacao.erro}
                          role="status"
                        >
                          {feedbackAvaliacao.texto}
                        </FormFeedback>
                      )}

                      <ActionGroup>
                        <StatusActionButton type="submit" $tone="success">
                          <i
                            className="fa-solid fa-paper-plane"
                            aria-hidden="true"
                          />
                          Enviar avaliação
                        </StatusActionButton>
                      </ActionGroup>
                    </FormBlock>
                  ) : (
                    <MutedText>
                      Esta ocorrência ainda não foi avaliada pelo cliente.
                    </MutedText>
                  )}
                </Card>
              </DashboardColumn>

              <DashboardColumn stacked>
                <ServiceTimeline
                  occurrence={ocorrencia}
                  position={getTimelinePosition(ocorrencia.status)}
                  steps={TIMELINE_STEPS}
                />

                <Card>
                  <h2>
                    <i className="fa-solid fa-elevator" aria-hidden="true" />
                    Equipamento e local
                  </h2>
                  <InfoList>
                    <div>
                      <dt>Equipamento</dt>
                      <dd>
                        {contrato?.produtoApelido ||
                          ocorrencia.equipamento ||
                          "Não informado"}
                      </dd>
                    </div>
                    {contrato?.produto?.modelo && (
                      <div>
                        <dt>Modelo</dt>
                        <dd>{contrato.produto.modelo}</dd>
                      </div>
                    )}
                    {contrato?.statusOperacional && (
                      <div>
                        <dt>Status operacional</dt>
                        <dd>{contrato.statusOperacional}</dd>
                      </div>
                    )}
                    <div>
                      <dt>Localização</dt>
                      <dd>
                        {localizacao
                          ? `${localizacao.apelido ? `${localizacao.apelido} · ` : ""}${localizacao.logradouro}, ${localizacao.numero} — ${localizacao.bairro}, ${localizacao.cidade} - ${localizacao.estado}`
                          : ocorrencia.local || "Não informada"}
                      </dd>
                    </div>
                  </InfoList>
                </Card>

                {usuario.tipo !== "cliente" && (
                  <Card>
                    <h2>
                      <i className="fa-solid fa-user" aria-hidden="true" />
                      Dados do cliente
                    </h2>
                    <InfoList>
                      <div>
                        <dt>Nome</dt>
                        <dd>
                          {clienteOcorrencia
                            ? `${clienteOcorrencia.nome} ${clienteOcorrencia.sobrenome || ""}`.trim()
                            : ocorrencia.cliente || "Cliente SmartLift"}
                        </dd>
                      </div>
                      {clienteOcorrencia?.email && (
                        <div>
                          <dt>E-mail</dt>
                          <dd>{clienteOcorrencia.email}</dd>
                        </div>
                      )}
                    </InfoList>
                  </Card>
                )}
              </DashboardColumn>
            </DashboardColumns>
          </>
        )}
      </DashboardMain>
    </DashboardShell>
  );
}
