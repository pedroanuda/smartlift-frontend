/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router";
import styled from "styled-components";

import {
  DashboardShell,
  DashboardMain,
  DashboardIntro,
} from "../../components/dashboard/DashboardLayout";
import NotificationsCenter from "../../components/dashboard/NotificationsCenter";

import OcorrenciaService from "../../services/OcorrenciaService";
import NotificacaoService from "../../services/NotificacaoService";
import UsuarioService from "../../services/UsuarioService";

const PageContent = styled.div`
  display: grid;
  gap: 1.4rem;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const MetricCard = styled.div`
  background: white;
  border: 1px solid #e8ecf2;
  border-radius: 12px;
  padding: 1.2rem;
  box-shadow: 0 3px 12px rgba(20, 40, 70, 0.04);

  .metric-icon {
    font-size: 1.4rem;
  }

  .metric-label {
    margin-top: 0.8rem;
    color: #68758a;
    font-size: 0.82rem;
  }

  .metric-number {
    margin-top: 0.3rem;
    color: #102b50;
    font-size: 1.8rem;
    font-weight: 700;
  }

  button {
    margin-top: 0.8rem;
    border: 0;
    background: none;
    color: #1765b1;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }
`;

const Section = styled.section`
  background: white;
  border: 1px solid #e8ecf2;
  border-radius: 12px;
  padding: 1.3rem;
  box-shadow: 0 3px 12px rgba(20, 40, 70, 0.04);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.2rem;

  h2 {
    color: #102b50;
    font-size: 1.05rem;
  }

  p {
    margin-top: 0.3rem;
    color: #758196;
    font-size: 0.8rem;
  }
`;

const LinkButton = styled.button`
  border: 0;
  background: transparent;
  color: #1765b1;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const Tabs = styled.div`
  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid #e8ecf2;
  margin-bottom: 1rem;
  overflow-x: auto;
`;

const Tab = styled.button`
  padding: 0.75rem 0.9rem;
  border: 0;
  border-bottom: 3px solid
    ${({ $active }) => ($active ? "#1765b1" : "transparent")};
  background: transparent;
  color: ${({ $active }) => ($active ? "#1765b1" : "#68758a")};
  font-weight: ${({ $active }) => ($active ? "700" : "500")};
  white-space: nowrap;
  cursor: pointer;
`;

const OccurrencesList = styled.div`
  display: grid;
  gap: 0.8rem;
`;

const OccurrenceCard = styled.button`
  width: 100%;
  display: block;
  padding: 1.2rem;
  border: 1px solid #e8ecf2;
  border-radius: 10px;
  background: white;
  text-align: left;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    border-color: #1765b1;
    box-shadow: 0 4px 14px rgba(20, 40, 70, 0.08);
  }
`;

const OccurrenceTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Priority = styled.span`
  display: inline-block;
  padding: 0.35rem 0.65rem;
  border-radius: 5px;
  background: #fff0e9;
  color: #d65a25;
  font-size: 0.7rem;
  font-weight: 700;
`;

const Status = styled.span`
  display: inline-block;
  padding: 0.4rem 0.7rem;
  border-radius: 20px;
  background: #fff3df;
  color: #b86b12;
  font-size: 0.72rem;
  font-weight: 700;
`;

const OccurrenceTitle = styled.h3`
  margin-top: 0.8rem;
  color: #102b50;
  font-size: 0.95rem;
`;

const OccurrenceDescription = styled.p`
  margin-top: 0.35rem;
  color: #68758a;
  font-size: 0.82rem;
`;

const Metadata = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
  margin-top: 1.2rem;
  padding-top: 1rem;
  border-top: 1px solid #edf0f4;
  color: #68758a;
  font-size: 0.75rem;

  span {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }
`;

const EmptyMessage = styled.div`
  padding: 2rem 1rem;
  text-align: center;
  color: #758196;
  font-size: 0.85rem;
`;

const SupportGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const SupportCard = styled.div`
  padding: 1.2rem;
  border-radius: 10px;
  border: 1px solid #e8ecf2;
  background: #fbfcfe;
  display: grid;
  gap: 0.55rem;

  h3 {
    color: #102b50;
    font-size: 0.92rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  p {
    color: #68758a;
    font-size: 0.8rem;
    line-height: 1.55;
  }

  a {
    justify-self: start;
    margin-top: 0.3rem;
    padding: 0.45rem 0.8rem;
    border-radius: 7px;
    background: #1765b1;
    color: #fff;
    font-size: 0.76rem;
    font-weight: 600;
    text-decoration: none;
  }
`;

function getGrupoStatus(status = "") {
  const normalizado = status.toLocaleLowerCase("pt-BR");

  if (
    normalizado.includes("finaliz") ||
    normalizado.includes("conclu") ||
    normalizado.includes("encerr")
  ) {
    return "Concluídas";
  }

  if (
    normalizado.includes("andamento") ||
    normalizado.includes("atendimento") ||
    normalizado.includes("execução")
  ) {
    return "Em andamento";
  }

  return "Pendentes";
}

export default function TecnicoDashboard({ usuario: usuarioProp, secao = "painel" }) {
  const outletContext = useOutletContext() || {};
  const usuario = usuarioProp || outletContext.usuario || UsuarioService.buscarUsuarioLogado();
  const navigate = useNavigate();
  const location = useLocation();

  const [filtro, setFiltro] = useState(
    () => location.state?.filtro || "Pendentes"
  );
  const [ocorrencias, setOcorrencias] = useState(() =>
    OcorrenciaService.buscarOcorrencias()
  );
  const [notificacoesLidas, setNotificacoesLidas] = useState(() =>
    NotificacaoService.buscarIdsLidas(usuario?.id)
  );

  useEffect(() => {
    const carregarOcorrencias = () => {
      setOcorrencias(OcorrenciaService.buscarOcorrencias());
    };

    return OcorrenciaService.inscreverAtualizacoes(carregarOcorrencias);
  }, []);

  useEffect(() => {
    const carregarLidas = () => {
      setNotificacoesLidas(NotificacaoService.buscarIdsLidas(usuario?.id));
    };

    return NotificacaoService.inscreverAtualizacoes(carregarLidas);
  }, [usuario?.id]);

  const ocorrenciasPendentes = ocorrencias.filter(
    (ocorrencia) => getGrupoStatus(ocorrencia.status) === "Pendentes"
  );
  const ocorrenciasEmAndamento = ocorrencias.filter(
    (ocorrencia) => getGrupoStatus(ocorrencia.status) === "Em andamento"
  );
  const ocorrenciasConcluidas = ocorrencias.filter(
    (ocorrencia) => getGrupoStatus(ocorrencia.status) === "Concluídas"
  );
  const ocorrenciasSlaCritico = ocorrencias.filter(
    (ocorrencia) =>
      getGrupoStatus(ocorrencia.status) !== "Concluídas" &&
      (ocorrencia.prioridade || "").toLocaleLowerCase("pt-BR") === "alta"
  );

  const atendimentosAtivos =
    ocorrenciasPendentes.length + ocorrenciasEmAndamento.length;

  const ocorrenciasExibidas = ocorrencias.filter(
    (ocorrencia) => getGrupoStatus(ocorrencia.status) === filtro
  );

  const irParaOcorrencias = (filtroInicial = "Pendentes") => {
    setFiltro(filtroInicial);
    navigate("/tecnico/ocorrencias", { state: { filtro: filtroInicial } });
  };

  const notificacoesBase = [
    ...(ocorrenciasSlaCritico.length > 0
      ? [{
          id: `tecnico-criticas-${ocorrenciasSlaCritico.length}`,
          title: `${ocorrenciasSlaCritico.length} ocorrência(s) de alta prioridade`,
          description: "Existem chamados críticos aguardando ação imediata para manter o SLA em dia.",
          actionLabel: "Ver chamados críticos",
          accent: "#d9534f",
          bg: "#fdeeee",
          icon: <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" />,
          unread: true,
          onClick: () => irParaOcorrencias("Pendentes"),
        }]
      : []),
    ...(ocorrenciasPendentes.length > 0
      ? [{
          id: `tecnico-fila-${ocorrenciasPendentes.length}`,
          title: `${ocorrenciasPendentes.length} ocorrência(s) pendente(s) na fila`,
          description: "Confira os chamados aguardando início de atendimento técnico.",
          actionLabel: "Ver pendentes",
          accent: "#b67a19",
          bg: "#fff4df",
          icon: <i className="fa-solid fa-clock" aria-hidden="true" />,
          unread: true,
          onClick: () => irParaOcorrencias("Pendentes"),
        }]
      : []),
    ...(ocorrenciasEmAndamento.length > 0
      ? [{
          id: `tecnico-andamento-${ocorrenciasEmAndamento.length}`,
          title: `${ocorrenciasEmAndamento.length} atendimento(s) em andamento`,
          description: "Acompanhe os atendimentos atualmente em execução sob sua responsabilidade.",
          actionLabel: "Ver em andamento",
          accent: "#1765b1",
          bg: "#eaf0ff",
          icon: <i className="fa-solid fa-wrench" aria-hidden="true" />,
          unread: true,
          onClick: () => irParaOcorrencias("Em andamento"),
        }]
      : []),
  ];

  const notifications = notificacoesBase.map((item) => ({
    ...item,
    unread: item.unread && !notificacoesLidas.includes(item.id),
  }));

  const notificacoesNaoLidas = notifications.filter((item) => item.unread);

  const marcarNotificacaoComoLida = (id) => {
    NotificacaoService.marcarComoLida(usuario?.id, id);
  };

  const marcarTodasNotificacoesComoLidas = () => {
    NotificacaoService.marcarTodasComoLidas(
      usuario?.id,
      notificacoesNaoLidas.map((item) => item.id)
    );
  };

  const navigation = [
    {
      label: "Painel do Técnico",
      icon: <i className="fa-solid fa-house" aria-hidden="true" />,
      active: location.pathname === "/",
      onClick: () => navigate("/"),
    },
    {
      label: "Ocorrências Atribuídas",
      icon: <i className="fa-solid fa-clipboard-list" aria-hidden="true" />,
      active: location.pathname === "/tecnico/ocorrencias",
      badge: atendimentosAtivos > 0 ? String(atendimentosAtivos) : undefined,
      onClick: () => irParaOcorrencias("Pendentes"),
    },
    {
      label: "Notificações",
      icon: <i className="fa-solid fa-bell" aria-hidden="true" />,
      active: location.pathname === "/tecnico/notificacoes",
      badge:
        notificacoesNaoLidas.length > 0
          ? String(notificacoesNaoLidas.length)
          : undefined,
      onClick: () => navigate("/tecnico/notificacoes"),
    },
    {
      label: "Perfil e Acesso",
      icon: <i className="fa-solid fa-user" aria-hidden="true" />,
      disabled: true,
    },
    {
      label: "Ajuda e Suporte",
      icon: <i className="fa-solid fa-circle-question" aria-hidden="true" />,
      active: location.pathname === "/tecnico/suporte",
      onClick: () => navigate("/tecnico/suporte"),
    },
  ];

  const metrics = [
    { icon: <i className="fa-solid fa-hourglass-half" aria-hidden="true" />, color: "#b67a19", label: "Ocorrências pendentes", number: ocorrenciasPendentes.length, filter: "Pendentes" },
    { icon: <i className="fa-solid fa-wrench" aria-hidden="true" />, color: "#2861c8", label: "Em andamento", number: ocorrenciasEmAndamento.length, filter: "Em andamento" },
    { icon: <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" />, color: "#d9534f", label: "SLA crítico", number: ocorrenciasSlaCritico.length, filter: "Pendentes" },
    { icon: <i className="fa-solid fa-circle-check" aria-hidden="true" />, color: "#398e4f", label: "Concluídas", number: ocorrenciasConcluidas.length, filter: "Concluídas" },
  ];

  const formatDate = (date) => {
    if (!date) return "Data não informada";

    return new Date(date).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getOccurrenceTitle = (ocorrencia) =>
    ocorrencia.contrato?.produtoApelido ||
    ocorrencia.equipamento ||
    ocorrencia.titulo ||
    ocorrencia.categoria ||
    "Nova ocorrência";

  const getLocation = (ocorrencia) => {
    const local = ocorrencia.contrato?.localizacao;

    if (!local) return "Localização não informada";

    return `${local.cidade || ""} - ${local.estado || ""}`;
  };

  const helpCard = {
    title: "Precisa de ajuda?",
    description: "Fale com a nossa central de atendimento 24h.",
    action: "Abrir chamado",
    href: "mailto:suporte@smartlift.com.br",
  };

  const subtitle =
    atendimentosAtivos === 0
      ? "Você não tem atendimentos ativos no momento."
      : atendimentosAtivos === 1
        ? "Você tem 1 atendimento ativo no momento. Confira suas atividades."
        : `Você tem ${atendimentosAtivos} atendimentos ativos no momento. Confira suas atividades.`;

  const renderOccurrenceCard = (ocorrencia) => {
    const atendimento = ocorrencia.atendimentos?.find(
      (item) => item.tecnicoId === usuario.id
    );

    return (
      <OccurrenceCard
        key={ocorrencia.id}
        type="button"
        onClick={() => irParaOcorrencias(getGrupoStatus(ocorrencia.status))}
      >
        <OccurrenceTop>
          <Priority>Prioridade {ocorrencia.prioridade || "Média"}</Priority>
          <Status>{ocorrencia.status}</Status>
        </OccurrenceTop>

        <OccurrenceTitle>
          {getOccurrenceTitle(ocorrencia).toUpperCase()}
        </OccurrenceTitle>

        <OccurrenceDescription>
          {ocorrencia.descricao || ocorrencia.categoria}
        </OccurrenceDescription>

        <Metadata>
          <span>
            <i className="fa-solid fa-clock" aria-hidden="true" />
            {atendimento?.dataHoraInicioAtendimento
              ? `Iniciado em ${formatDate(atendimento.dataHoraInicioAtendimento)}`
              : `Registrado em ${formatDate(ocorrencia.dataCriacao)}`}
          </span>
          <span>
            <i className="fa-solid fa-location-dot" aria-hidden="true" />
            {getLocation(ocorrencia)}
          </span>
          <span>#{ocorrencia.id}</span>
        </Metadata>
      </OccurrenceCard>
    );
  };

  const introBySection = {
    painel: {
      title: `Olá, ${usuario.nome}!`,
      subtitle,
    },
    ocorrencias: {
      title: "Ocorrências atribuídas",
      subtitle: "Gerencie e filtre todos os chamados sob sua responsabilidade.",
    },
    notificacoes: {
      title: "Notificações",
      subtitle: "Acompanhe alertas de SLA, fila pendente e atendimentos ativos.",
    },
    suporte: {
      title: "Ajuda e suporte técnico",
      subtitle: "Canais de apoio operacional e escalonamento em campo.",
    },
  };

  const intro = introBySection[secao] || introBySection.painel;

  return (
    <DashboardShell
      user={usuario}
      role="Técnico"
      sidebarLabel="Navegação do técnico"
      navigation={navigation}
      notifications={notifications}
      helpCard={helpCard}
    >
      <DashboardMain>
        <DashboardIntro title={intro.title} subtitle={intro.subtitle} />

        <PageContent>
          {secao === "painel" && (
            <>
              <MetricsGrid>
                {metrics.map((metric) => (
                  <MetricCard key={metric.label}>
                    <div className="metric-icon" style={{ color: metric.color }}>
                      {metric.icon}
                    </div>
                    <div className="metric-label">{metric.label}</div>
                    <div className="metric-number">{metric.number}</div>
                    <button
                      type="button"
                      onClick={() => irParaOcorrencias(metric.filter)}
                    >
                      Ver todas <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                    </button>
                  </MetricCard>
                ))}
              </MetricsGrid>

              <Section>
                <SectionHeader>
                  <div>
                    <h2>Próximos atendimentos</h2>
                    <p>Resumo rápido das ocorrências pendentes e em andamento.</p>
                  </div>
                  <LinkButton type="button" onClick={() => irParaOcorrencias("Pendentes")}>
                    Ver todas as ocorrências <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                  </LinkButton>
                </SectionHeader>

                {[...ocorrenciasPendentes, ...ocorrenciasEmAndamento].length > 0 ? (
                  <OccurrencesList>
                    {[...ocorrenciasPendentes, ...ocorrenciasEmAndamento]
                      .slice(0, 3)
                      .map(renderOccurrenceCard)}
                  </OccurrencesList>
                ) : (
                  <EmptyMessage>
                    Nenhum atendimento ativo no momento.
                  </EmptyMessage>
                )}
              </Section>
            </>
          )}

          {secao === "ocorrencias" && (
            <Section>
              <SectionHeader>
                <div>
                  <h2>Fila de ocorrências</h2>
                  <p>Filtre por etapa para acompanhar seus atendimentos.</p>
                </div>
              </SectionHeader>

              <Tabs>
                {[
                  { label: "Pendentes", count: ocorrenciasPendentes.length },
                  { label: "Em andamento", count: ocorrenciasEmAndamento.length },
                  { label: "Concluídas", count: ocorrenciasConcluidas.length },
                ].map((tab) => (
                  <Tab
                    key={tab.label}
                    type="button"
                    $active={filtro === tab.label}
                    onClick={() => setFiltro(tab.label)}
                  >
                    {tab.label} ({tab.count})
                  </Tab>
                ))}
              </Tabs>

              {ocorrenciasExibidas.length > 0 ? (
                <OccurrencesList>
                  {ocorrenciasExibidas.map(renderOccurrenceCard)}
                </OccurrencesList>
              ) : (
                <EmptyMessage>
                  Nenhuma ocorrência encontrada nesta categoria.
                </EmptyMessage>
              )}
            </Section>
          )}

          {secao === "notificacoes" && (
            <NotificationsCenter
              title="Central de notificações"
              subtitle="Atualizações importantes sobre sua fila e atendimentos."
              notifications={notifications}
              onMarkRead={marcarNotificacaoComoLida}
              onMarkAllRead={marcarTodasNotificacoesComoLidas}
            />
          )}

          {secao === "suporte" && (
            <Section>
              <SectionHeader>
                <div>
                  <h2>Canais de suporte ao técnico</h2>
                  <p>Precisa de auxílio técnico ou escalonamento durante um atendimento?</p>
                </div>
              </SectionHeader>

              <SupportGrid>
                <SupportCard>
                  <h3>
                    <i className="fa-solid fa-headset" aria-hidden="true" />
                    Central Operacional 24h
                  </h3>
                  <p>
                    Acione o time de engenharia e despacho para suporte imediato em campo,
                    liberação de peças ou dúvidas de diagnóstico.
                  </p>
                  <a href="mailto:suporte@smartlift.com.br?subject=Suporte%20T%C3%A9cnico%20em%20Campo">
                    Contatar central
                  </a>
                </SupportCard>

                <SupportCard>
                  <h3>
                    <i className="fa-solid fa-shield-halved" aria-hidden="true" />
                    Protocolo de SLA Crítico
                  </h3>
                  <p>
                    Ocorrências com prioridade Alta devem ser priorizadas imediatamente.
                    Consulte sua fila de pendentes para verificar chamados críticos.
                  </p>
                  <a
                    href="#ocorrencias"
                    onClick={(event) => {
                      event.preventDefault();
                      irParaOcorrencias("Pendentes");
                    }}
                  >
                    Ver fila pendente
                  </a>
                </SupportCard>
              </SupportGrid>
            </Section>
          )}
        </PageContent>
      </DashboardMain>
    </DashboardShell>
  );
}
