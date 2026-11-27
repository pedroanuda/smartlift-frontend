
//import { useState } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";

import {
  DashboardShell,
  DashboardMain,
  DashboardIntro,
} from "../../components/dashboard/DashboardLayout";

import OcorrenciaService from "../../services/OcorrenciaService";
import NotificacaoService from "../../services/NotificacaoService";

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

const SupportText = styled.p`
  color: #68758a;
  font-size: 0.82rem;
  line-height: 1.6;
`;

const NotificationHeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-wrap: wrap;
`;

const UnreadPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.65rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  background: ${({ $hasUnread }) => ($hasUnread ? "#eef3fb" : "#e7f5e9")};
  color: ${({ $hasUnread }) => ($hasUnread ? "#1765b1" : "#2f7d42")};
`;

const MarkAllReadButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.75rem;
  border: 1px solid #d7e2f1;
  border-radius: 8px;
  background: #f7faff;
  color: #1765b1;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.15s ease;

  &:hover {
    background: #eaf1fc;
    border-color: #1765b1;
  }
`;

const NotificationFilters = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const FilterChip = styled.button`
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  border: 1px solid ${({ $active }) => ($active ? "#1765b1" : "#e2e8f0")};
  background: ${({ $active }) => ($active ? "#1765b1" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#58677c")};
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.15s ease;

  &:hover {
    border-color: #1765b1;
  }
`;

const NotificationFeed = styled.div`
  display: grid;
  gap: 0.75rem;
`;

const NotificationCard = styled.article`
  display: flex;
  align-items: flex-start;
  gap: 0.9rem;
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid ${({ $unread }) => ($unread ? "#d4e3f7" : "#edf0f4")};
  border-left: 4px solid ${({ $accent, $unread }) => ($unread ? $accent : "#cbd5e1")};
  background: ${({ $unread }) => ($unread ? "#fafcff" : "#fff")};
  transition: 0.2s ease;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const NotificationIcon = styled.div`
  width: 2.35rem;
  height: 2.35rem;
  border-radius: 10px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  display: grid;
  place-items: center;
  font-size: 0.95rem;
  flex-shrink: 0;
`;

const NotificationBody = styled.div`
  flex: 1;
  min-width: 0;

  h3 {
    color: #102b50;
    font-size: 0.88rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  p {
    margin-top: 0.25rem;
    color: #607087;
    font-size: 0.8rem;
    line-height: 1.5;
  }
`;

const NotificationTag = styled.span`
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-size: 0.65rem;
  font-weight: 700;
  background: ${({ $unread }) => ($unread ? "#1765b1" : "#eef2f6")};
  color: ${({ $unread }) => ($unread ? "#fff" : "#68758a")};
`;

const NotificationCardActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  flex-wrap: wrap;
`;

const CardActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.7rem;
  border-radius: 7px;
  border: 1px solid ${({ $primary }) => ($primary ? "#1765b1" : "#dce3ed")};
  background: ${({ $primary }) => ($primary ? "#1765b1" : "#fff")};
  color: ${({ $primary }) => ($primary ? "#fff" : "#4a5a71")};
  font-size: 0.73rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.15s ease;

  &:hover {
    background: ${({ $primary }) => ($primary ? "#125291" : "#f4f7fb")};
  }
`;

const NotificationEmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  padding: 2rem 1rem;
  border-radius: 10px;
  border: 1px dashed #d8e2ee;
  background: #fbfcfe;
  text-align: center;

  i {
    font-size: 1.6rem;
    color: #398e4f;
  }

  strong {
    color: #102b50;
    font-size: 0.9rem;
  }

  p {
    color: #68758a;
    font-size: 0.8rem;
  }
`;

function jumpTo(id) {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

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


export default function TecnicoDashboard({ usuario }) {
  const navigate = useNavigate();

  const [filtro, setFiltro] = useState("Pendentes");
  const [filtroNotificacoes, setFiltroNotificacoes] = useState("todas");
  const [ocorrencias, setOcorrencias] = useState(() =>
    OcorrenciaService.buscarOcorrencias()
  );
  const [notificacoesLidas, setNotificacoesLidas] = useState(() =>
    NotificacaoService.buscarIdsLidas(usuario.id)
  );

  useEffect(() => {
    const carregarOcorrencias = () => {
      setOcorrencias(OcorrenciaService.buscarOcorrencias());
    };

    return OcorrenciaService.inscreverAtualizacoes(carregarOcorrencias);
  }, []);

  useEffect(() => {
    const carregarLidas = () => {
      setNotificacoesLidas(NotificacaoService.buscarIdsLidas(usuario.id));
    };

    return NotificacaoService.inscreverAtualizacoes(carregarLidas);
  }, [usuario.id]);

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
          onClick: () => {
            setFiltro("Pendentes");
            jumpTo("ocorrencias-tecnico");
          },
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
          onClick: () => {
            setFiltro("Pendentes");
            jumpTo("ocorrencias-tecnico");
          },
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
          onClick: () => {
            setFiltro("Em andamento");
            jumpTo("ocorrencias-tecnico");
          },
        }]
      : []),
  ];

  const notifications = notificacoesBase.map((item) => ({
    ...item,
    unread: item.unread && !notificacoesLidas.includes(item.id),
  }));

  const notificacoesNaoLidas = notifications.filter((item) => item.unread);
  const notificacoesExibidas =
    filtroNotificacoes === "nao-lidas" ? notificacoesNaoLidas : notifications;

  const marcarNotificacaoComoLida = (id) => {
    NotificacaoService.marcarComoLida(usuario.id, id);
  };

  const marcarTodasNotificacoesComoLidas = () => {
    NotificacaoService.marcarTodasComoLidas(
      usuario.id,
      notificacoesNaoLidas.map((item) => item.id)
    );
  };

  const navigation = [
    {
      label: "Painel do Técnico",
      icon: <i className="fa-solid fa-house" aria-hidden="true" />,
      active: true,
      onClick: () => jumpTo("painel-tecnico"),
    },
    {
      label: "Ocorrências Atribuídas",
      icon: <i className="fa-solid fa-clipboard-list" aria-hidden="true" />,
      onClick: () => jumpTo("ocorrencias-tecnico"),
    },
    {
      label: "Notificações",
      icon: <i className="fa-solid fa-bell" aria-hidden="true" />,
      badge:
        notificacoesNaoLidas.length > 0
          ? String(notificacoesNaoLidas.length)
          : undefined,
      onClick: () => jumpTo("notificacoes-tecnico"),
    },
    {
      label: "Perfil e Acesso",
      icon: <i className="fa-solid fa-user" aria-hidden="true" />,
      disabled: true,
    },
    {
      label: "Ajuda e Suporte",
      icon: <i className="fa-solid fa-circle-question" aria-hidden="true" />,
      onClick: () => jumpTo("suporte-tecnico"),
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
    href: "#suporte-tecnico",
  };

  const subtitle =
    atendimentosAtivos === 0
      ? "Você não tem atendimentos ativos no momento."
      : atendimentosAtivos === 1
        ? "Você tem 1 atendimento ativo no momento. Confira suas atividades."
        : `Você tem ${atendimentosAtivos} atendimentos ativos no momento. Confira suas atividades.`;

  return (
    <DashboardShell
      user={usuario}
      role="Técnico"
      sidebarLabel="Navegação do técnico"
      navigation={navigation}
      notifications={notifications}
      helpCard={helpCard}
    >
      <DashboardMain id="painel-tecnico">
        <DashboardIntro
          title={`Olá, ${usuario.nome}!`}
          subtitle={subtitle}
        />

        <PageContent>
          <MetricsGrid>
            {metrics.map((metric) => (
              <MetricCard key={metric.label}>
                <div className="metric-icon" style={{ color: metric.color }}>{metric.icon}</div>
                <div className="metric-label">{metric.label}</div>
                <div className="metric-number">{metric.number}</div>
                <button
                  type="button"
                  onClick={() => {
                    setFiltro(metric.filter);
                    jumpTo("ocorrencias-tecnico");
                  }}
                >
                  Ver todas <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                </button>
              </MetricCard>
            ))}
          </MetricsGrid>

          <Section id="ocorrencias-tecnico">
            <SectionHeader>
              <div>
                <h2>Ocorrências atribuídas</h2>
                <p>Acompanhe os atendimentos sob sua responsabilidade.</p>
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
              ocorrenciasExibidas.map((ocorrencia) => {
                const atendimento = ocorrencia.atendimentos?.find(
                  (item) => item.tecnicoId === usuario.id
                );

                return (
                  <OccurrenceCard
                    key={ocorrencia.id}
                    type="button"
                    onClick={() =>
                      navigate(`/ocorrencias/${ocorrencia.id}`)
                    }
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
              })
            ) : (
              <EmptyMessage>
                Nenhuma ocorrência encontrada nesta categoria.
              </EmptyMessage>
            )}
          </Section>

          <Section id="notificacoes-tecnico">
            <SectionHeader>
              <div>
                <h2>Central de notificações</h2>
                <p>Atualizações importantes sobre sua fila e atendimentos.</p>
              </div>

              <NotificationHeaderActions>
                <UnreadPill $hasUnread={notificacoesNaoLidas.length > 0}>
                  <i
                    className={
                      notificacoesNaoLidas.length > 0
                        ? "fa-solid fa-bell"
                        : "fa-solid fa-circle-check"
                    }
                    aria-hidden="true"
                  />
                  {notificacoesNaoLidas.length === 0
                    ? "Tudo em dia"
                    : notificacoesNaoLidas.length === 1
                      ? "1 não lida"
                      : `${notificacoesNaoLidas.length} não lidas`}
                </UnreadPill>

                {notificacoesNaoLidas.length > 0 && (
                  <MarkAllReadButton
                    type="button"
                    onClick={marcarTodasNotificacoesComoLidas}
                  >
                    <i className="fa-solid fa-check-double" aria-hidden="true" />
                    Marcar todas como lidas
                  </MarkAllReadButton>
                )}
              </NotificationHeaderActions>
            </SectionHeader>

            <NotificationFilters>
              <FilterChip
                type="button"
                $active={filtroNotificacoes === "todas"}
                onClick={() => setFiltroNotificacoes("todas")}
              >
                Todas ({notifications.length})
              </FilterChip>
              <FilterChip
                type="button"
                $active={filtroNotificacoes === "nao-lidas"}
                onClick={() => setFiltroNotificacoes("nao-lidas")}
              >
                Não lidas ({notificacoesNaoLidas.length})
              </FilterChip>
            </NotificationFilters>

            {notificacoesExibidas.length > 0 ? (
              <NotificationFeed>
                {notificacoesExibidas.map((item) => (
                  <NotificationCard
                    key={item.id}
                    $unread={item.unread}
                    $accent={item.accent}
                  >
                    <NotificationIcon $bg={item.bg} $color={item.accent}>
                      {item.icon}
                    </NotificationIcon>

                    <NotificationBody>
                      <h3>
                        {item.title}
                        <NotificationTag $unread={item.unread}>
                          {item.unread ? "Nova" : "Lida"}
                        </NotificationTag>
                      </h3>
                      <p>{item.description}</p>

                      <NotificationCardActions>
                        <CardActionButton
                          type="button"
                          $primary
                          onClick={() => {
                            marcarNotificacaoComoLida(item.id);
                            item.onClick?.();
                          }}
                        >
                          {item.actionLabel}
                          <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                        </CardActionButton>

                        {item.unread && (
                          <CardActionButton
                            type="button"
                            onClick={() => marcarNotificacaoComoLida(item.id)}
                          >
                            <i className="fa-solid fa-check" aria-hidden="true" />
                            Marcar como lida
                          </CardActionButton>
                        )}
                      </NotificationCardActions>
                    </NotificationBody>
                  </NotificationCard>
                ))}
              </NotificationFeed>
            ) : (
              <NotificationEmptyState>
                <i className="fa-solid fa-circle-check" aria-hidden="true" />
                <strong>Tudo em dia!</strong>
                <p>
                  {filtroNotificacoes === "nao-lidas"
                    ? "Você já leu todas as suas notificações pendentes."
                    : "Não há notificações registradas no momento."}
                </p>
              </NotificationEmptyState>
            )}
          </Section>

          <Section id="suporte-tecnico">
            <SectionHeader>
              <div>
                <h2>Ajuda e suporte</h2>
                <p>Precisa de auxílio durante um atendimento?</p>
              </div>
            </SectionHeader>

            <SupportText>
              Entre em contato com a central de atendimento SmartLift para
              receber suporte.
            </SupportText>
          </Section>
        </PageContent>
      </DashboardMain>
    </DashboardShell>
  );
}
