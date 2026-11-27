/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router";
import {
  DashboardColumn,
  DashboardColumns,
  DashboardIntro,
  DashboardMain,
  DashboardShell,
} from "../../components/dashboard/DashboardLayout";
import {
  EmptyState,
  OccurrenceCard,
  OccurrenceCardDetails,
  OccurrenceList,
  Panel,
  PanelAction,
  PanelHeader,
  StatusTab,
  StatusTabs,
  SummaryCard,
  SummaryGrid,
} from "../../components/dashboard/DashboardContent";
import {
  CustomerFeedback,
  EquipmentPanel,
  ServiceTimeline,
} from "../../components/dashboard/CustomerDashboardWidgets";
import NotificationsCenter from "../../components/dashboard/NotificationsCenter";
import OcorrenciaService from "../../services/OcorrenciaService";
import ContratoService from "../../services/ContratoService";
import NotificacaoService from "../../services/NotificacaoService";
import UsuarioService from "../../services/UsuarioService";

const STATUS_TABS = [
  { id: "abertas", label: "Abertas" },
  { id: "atendimento", label: "Em atendimento" },
  { id: "concluidas", label: "Concluídas" },
];

const TIMELINE_STEPS = [
  ["Ocorrência registrada", "Recebemos sua solicitação."],
  ["Em análise", "Nossa equipe está avaliando o problema informado."],
  ["Em atendimento", "Um técnico foi alocado para o atendimento."],
  ["Concluída", "O serviço foi finalizado."],
];

function getGroup(status = "") {
  const normalized = status.toLocaleLowerCase("pt-BR");
  if (normalized.includes("finaliz") || normalized.includes("conclu"))
    return "concluidas";
  if (normalized.includes("atendimento") || normalized.includes("andamento"))
    return "atendimento";
  return "abertas";
}

function formatDate(value) {
  if (!value) return null;
  let date = new Date(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    date = new Date(year, month - 1, day);
  }
  return new Intl.DateTimeFormat("pt-BR").format(date);
}

function getOccurrenceCode(occurrence) {
  const date =
    occurrence.atendimentos[0]?.dataHoraInicioAtendimento ||
    occurrence.dataCriacao;
  const year = date ? new Date(date).getFullYear() : new Date().getFullYear();
  return `#OCOR-${year}-${String(occurrence.id).padStart(5, "0")}`;
}

function getTimelinePosition(status) {
  const group = getGroup(status);
  if (group === "concluidas") return 3;
  if (group === "atendimento") return 2;
  if (
    status.toLocaleLowerCase("pt-BR").includes("análise") ||
    status.toLocaleLowerCase("pt-BR").includes("analise")
  )
    return 1;
  return 0;
}

export default function ClienteDashboard({
  usuario: usuarioProp,
  secao = "painel",
}) {
  const outletContext = useOutletContext() || {};
  const usuario =
    usuarioProp ||
    outletContext.usuario ||
    UsuarioService.buscarUsuarioLogado();
  const navigate = useNavigate();
  const location = useLocation();

  const contracts = ContratoService.buscarContratosPorClienteId(usuario.id);
  const [occurrences, setOccurrences] = useState(() =>
    OcorrenciaService.buscarOcorrenciasPorClienteId(usuario.id),
  );
  const [readIds, setReadIds] = useState(() =>
    NotificacaoService.buscarIdsLidas(usuario.id),
  );

  useEffect(() => {
    const carregarOcorrencias = () => {
      setOccurrences(
        OcorrenciaService.buscarOcorrenciasPorClienteId(usuario.id),
      );
    };

    return OcorrenciaService.inscreverAtualizacoes(carregarOcorrencias);
  }, [usuario.id]);

  useEffect(() => {
    const carregarLidas = () => {
      setReadIds(NotificacaoService.buscarIdsLidas(usuario.id));
    };

    return NotificacaoService.inscreverAtualizacoes(carregarLidas);
  }, [usuario.id]);

  const activeContracts = contracts.filter(
    (contract) =>
      contract.statusOperacional?.toLocaleLowerCase("pt-BR") === "ativo",
  );

  const [selectedTab, setSelectedTab] = useState(() => {
    if (location.state?.tab) return location.state.tab;
    const firstAvailable = STATUS_TABS.find((tab) =>
      occurrences.some((occurrence) => getGroup(occurrence.status) === tab.id),
    );
    return firstAvailable?.id ?? "abertas";
  });

  const selectedOccurrences =
    selectedTab === "todas"
      ? occurrences
      : occurrences.filter(
          (occurrence) => getGroup(occurrence.status) === selectedTab,
        );

  const trackedOccurrence =
    occurrences.find(
      (occurrence) => getGroup(occurrence.status) !== "concluidas",
    ) ?? occurrences[0];
  const featuredContract = activeContracts[0] ?? contracts[0];
  const pendingEvaluation = occurrences.find(
    (occurrence) =>
      getGroup(occurrence.status) === "concluidas" &&
      !occurrence.avaliacao?.nota,
  );
  const latestEvaluation = occurrences.find(
    (occurrence) => occurrence.avaliacao?.nota,
  );
  const timelinePosition = trackedOccurrence
    ? getTimelinePosition(trackedOccurrence.status)
    : -1;

  const goToOccurrences = (tab = "todas") => {
    setSelectedTab(tab);
    navigate("/cliente/ocorrencias", { state: { tab } });
  };

  const notificationsBase = [
    ...occurrences
      .filter((occurrence) => getGroup(occurrence.status) !== "concluidas")
      .slice(0, 5)
      .map((occurrence) => ({
        id: `ocorrencia-${occurrence.id}-${occurrence.status}`,
        title: `${getOccurrenceCode(occurrence)} · ${occurrence.status}`,
        description: occurrence.descricao,
        actionLabel: "Ver ocorrência",
        accent:
          getGroup(occurrence.status) === "atendimento" ? "#2861c8" : "#b67a19",
        bg:
          getGroup(occurrence.status) === "atendimento" ? "#eaf0ff" : "#fff4df",
        icon: <i className="fa-solid fa-clipboard-list" aria-hidden="true" />,
        unread: true,
        onClick: () => goToOccurrences(getGroup(occurrence.status)),
      })),
    ...(pendingEvaluation
      ? [
          {
            id: `avaliacao-${pendingEvaluation.id}`,
            title: "Avaliação pendente",
            description: `Avalie o atendimento concluído (${getOccurrenceCode(pendingEvaluation)}).`,
            actionLabel: "Ver concluídas",
            accent: "#398e4f",
            bg: "#e7f5e9",
            icon: <i className="fa-solid fa-star" aria-hidden="true" />,
            unread: true,
            onClick: () => goToOccurrences("concluidas"),
          },
        ]
      : []),
  ];

  const notifications = notificationsBase.map((item) => ({
    ...item,
    unread: item.unread && !readIds.includes(item.id),
  }));
  const unreadNotifications = notifications.filter((item) => item.unread);

  const navigation = [
    {
      label: "Painel do Cliente",
      icon: <i className="fa-solid fa-house" aria-hidden="true" />,
      active: location.pathname === "/",
      onClick: () => navigate("/"),
    },
    {
      label: "Minhas Ocorrências",
      icon: <i className="fa-solid fa-clipboard-list" aria-hidden="true" />,
      active: location.pathname === "/cliente/ocorrencias",
      badge: occurrences.length > 0 ? String(occurrences.length) : undefined,
      onClick: () => goToOccurrences("todas"),
    },
    {
      label: "Nova Ocorrência",
      icon: <i className="fa-solid fa-circle-plus" aria-hidden="true" />,
      active: location.pathname === "/ocorrencias/nova",
      onClick: () => navigate("/ocorrencias/nova"),
    },
    {
      label: "Meus Equipamentos",
      icon: <i className="fa-solid fa-elevator" aria-hidden="true" />,
      active: location.pathname === "/cliente/equipamentos",
      onClick: () => navigate("/cliente/equipamentos"),
    },
    {
      label: "Notificações",
      icon: <i className="fa-solid fa-bell" aria-hidden="true" />,
      active: location.pathname === "/cliente/notificacoes",
      badge:
        unreadNotifications.length > 0
          ? String(unreadNotifications.length)
          : undefined,
      onClick: () => navigate("/cliente/notificacoes"),
    },
    {
      label: "Documentos",
      icon: <i className="fa-solid fa-file-lines" aria-hidden="true" />,
      disabled: true,
    },
    {
      label: "Perfil e Acesso",
      icon: <i className="fa-solid fa-user" aria-hidden="true" />,
      disabled: true,
    },
    {
      label: "Ajuda e Suporte",
      icon: <i className="fa-solid fa-circle-question" aria-hidden="true" />,
      disabled: true,
    },
  ];

  const renderOccurrencesPanel = (limit = null) => {
    const list = limit
      ? selectedOccurrences.slice(0, limit)
      : selectedOccurrences;

    return (
      <Panel>
        <PanelHeader>
          <h2>Minhas ocorrências</h2>
          {limit ? (
            <PanelAction type="button" onClick={() => goToOccurrences("todas")}>
              Ver página completa
            </PanelAction>
          ) : (
            <PanelAction
              type="button"
              onClick={() => navigate("/ocorrencias/nova")}
            >
              + Nova ocorrência
            </PanelAction>
          )}
        </PanelHeader>
        <StatusTabs role="tablist" aria-label="Filtrar ocorrências por status">
          {STATUS_TABS.map((tab) => {
            const count = occurrences.filter(
              (occurrence) => getGroup(occurrence.status) === tab.id,
            ).length;
            return (
              <StatusTab
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selectedTab === tab.id}
                $active={selectedTab === tab.id}
                onClick={() => setSelectedTab(tab.id)}
              >
                {tab.label} ({count})
              </StatusTab>
            );
          })}
        </StatusTabs>
        {list.length > 0 ? (
          <OccurrenceList>
            {list.map((occurrence) => {
              const group = getGroup(occurrence.status);
              const contract = occurrence.contrato;
              const serviceDate =
                occurrence.atendimentos[0]?.dataHoraInicioAtendimento;
              return (
                <OccurrenceCard
                  key={occurrence.id}
                  group={group}
                  status={occurrence.status}
                >
                  <OccurrenceCardDetails>
                    <div>
                      <strong>{getOccurrenceCode(occurrence)}</strong>
                    </div>
                    <h3>
                      {occurrence.categoria} —{" "}
                      {contract?.localizacao?.apelido ??
                        contract?.produtoApelido ??
                        "Equipamento"}
                    </h3>
                    <p>{occurrence.descricao}</p>
                    <small>
                      {serviceDate
                        ? `Iniciado em ${formatDate(serviceDate)}`
                        : `Status: ${occurrence.status}`}
                      {" · "}
                      {contract?.localizacao?.cidade}
                      {contract?.localizacao?.estado &&
                        ` - ${contract.localizacao.estado}`}
                    </small>
                  </OccurrenceCardDetails>
                </OccurrenceCard>
              );
            })}
          </OccurrenceList>
        ) : (
          <EmptyState>Nenhuma ocorrência nesta etapa.</EmptyState>
        )}
      </Panel>
    );
  };

  const introBySection = {
    painel: {
      title: `Olá, ${usuario.nome}! 👋`,
      subtitle:
        "Acompanhe o status das suas ocorrências e informações dos seus equipamentos.",
    },
    ocorrencias: {
      title: "Minhas ocorrências",
      subtitle:
        "Consulte o histórico completo de chamados abertos, em atendimento e concluídos.",
    },
    equipamentos: {
      title: "Meus equipamentos e contratos",
      subtitle:
        "Visualize os equipamentos ativos, localizações e datas da última manutenção.",
    },
    notificacoes: {
      title: "Notificações",
      subtitle:
        "Acompanhe atualizações sobre seus chamados e avaliações pendentes.",
    },
  };

  const intro = introBySection[secao] || introBySection.painel;

  return (
    <DashboardShell
      user={usuario}
      role="Cliente"
      sidebarLabel="Navegação do cliente"
      navigation={navigation}
      notifications={notifications}
      helpCard={{
        title: "Precisa de ajuda?",
        description: "Fale com a nossa central de atendimento 24h.",
        href: "mailto:suporte@smartlift.com.br",
        action: "Abrir chamado",
      }}
    >
      <DashboardMain>
        <DashboardIntro title={intro.title} subtitle={intro.subtitle} />

        {secao === "painel" && (
          <DashboardColumns>
            <DashboardColumn>
              <SummaryGrid label="Resumo da conta">
                <SummaryCard
                  icon={
                    <i
                      className="fa-solid fa-circle-exclamation"
                      aria-hidden="true"
                    />
                  }
                  title="Ocorrências abertas"
                  value={
                    occurrences.filter(
                      (occurrence) => getGroup(occurrence.status) === "abertas",
                    ).length
                  }
                  action="Ver todas"
                  tone="#fff2dc"
                  ink="#b67a19"
                  onClick={() => goToOccurrences("abertas")}
                />
                <SummaryCard
                  icon={<i className="fa-solid fa-clock" aria-hidden="true" />}
                  title="Em atendimento"
                  value={
                    occurrences.filter(
                      (occurrence) =>
                        getGroup(occurrence.status) === "atendimento",
                    ).length
                  }
                  action="Ver todas"
                  tone="#eaf0ff"
                  ink="#2861c8"
                  onClick={() => goToOccurrences("atendimento")}
                />
                <SummaryCard
                  icon={<i className="fa-solid fa-check" aria-hidden="true" />}
                  title="Concluídas"
                  value={
                    occurrences.filter(
                      (occurrence) =>
                        getGroup(occurrence.status) === "concluidas",
                    ).length
                  }
                  action="Ver todas"
                  tone="#e7f5e9"
                  ink="#398e4f"
                  onClick={() => goToOccurrences("concluidas")}
                />
                <SummaryCard
                  icon={
                    <i className="fa-solid fa-elevator" aria-hidden="true" />
                  }
                  title="Equipamentos ativos"
                  value={activeContracts.length}
                  action="Ver equipamentos"
                  tone="#eaf0ff"
                  ink="#2861c8"
                  onClick={() => navigate("/cliente/equipamentos")}
                />
              </SummaryGrid>
              {renderOccurrencesPanel(3)}
              <CustomerFeedback
                title={
                  pendingEvaluation
                    ? "Sua opinião é importante!"
                    : latestEvaluation
                      ? "Obrigado pela sua avaliação!"
                      : "Sua opinião é importante!"
                }
                message={
                  pendingEvaluation
                    ? "Avalie nossos atendimentos e nos ajude a melhorar cada vez mais."
                    : latestEvaluation
                      ? `Sua nota: ${latestEvaluation.avaliacao.nota}/5${latestEvaluation.avaliacao.comentario ? ` — ${latestEvaluation.avaliacao.comentario}` : ""}`
                      : "Quando um atendimento for concluído, você poderá compartilhar sua experiência."
                }
                actionHref={
                  pendingEvaluation
                    ? "mailto:suporte@smartlift.com.br?subject=Avalia%C3%A7%C3%A3o%20do%20atendimento"
                    : null
                }
                actionLabel="Avaliar atendimento"
              />
            </DashboardColumn>
            <DashboardColumn stacked>
              <EquipmentPanel
                contract={featuredContract}
                maintenanceDate={formatDate(featuredContract?.ultimaManutencao)}
                onViewAll={() => navigate("/cliente/equipamentos")}
              />
              <ServiceTimeline
                occurrence={trackedOccurrence}
                position={timelinePosition}
                steps={TIMELINE_STEPS}
              />
            </DashboardColumn>
          </DashboardColumns>
        )}

        {secao === "ocorrencias" && renderOccurrencesPanel()}

        {secao === "equipamentos" && (
          <DashboardColumn stacked>
            {contracts.length > 0 ? (
              contracts.map((contract) => (
                <EquipmentPanel
                  key={contract.id}
                  contract={contract}
                  maintenanceDate={formatDate(contract.ultimaManutencao)}
                  onViewAll={() => navigate("/ocorrencias/nova")}
                />
              ))
            ) : (
              <EmptyState>
                Nenhum equipamento vinculado ao seu perfil.
              </EmptyState>
            )}
          </DashboardColumn>
        )}

        {secao === "notificacoes" && (
          <NotificationsCenter
            title="Central de notificações"
            subtitle="Fique por dentro das atualizações dos seus chamados."
            notifications={notifications}
            onMarkRead={(id) =>
              NotificacaoService.marcarComoLida(usuario.id, id)
            }
            onMarkAllRead={() =>
              NotificacaoService.marcarTodasComoLidas(
                usuario.id,
                unreadNotifications.map((item) => item.id),
              )
            }
          />
        )}
      </DashboardMain>
    </DashboardShell>
  );
}
