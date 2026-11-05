/* eslint-disable no-unused-vars */
import { useState } from "react";
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
import OcorrenciaService from "../../services/OcorrenciaService";
import ContratoService from "../../services/ContratoService";

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
  if (normalized.includes("finaliz") || normalized.includes("conclu")) return "concluidas";
  if (normalized.includes("atendimento") || normalized.includes("andamento")) return "atendimento";
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
  const date = occurrence.atendimentos[0]?.dataHoraInicioAtendimento;
  const year = date ? new Date(date).getFullYear() : new Date().getFullYear();
  return `#OCOR-${year}-${String(occurrence.id).padStart(5, "0")}`;
}

function getTimelinePosition(status) {
  const group = getGroup(status);
  if (group === "concluidas") return 3;
  if (group === "atendimento") return 2;
  if (status.toLocaleLowerCase("pt-BR").includes("análise") || status.toLocaleLowerCase("pt-BR").includes("analise")) return 1;
  return 0;
}

function jumpTo(sectionId) {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function ClienteDashboard({ usuario }) {
  const contracts = ContratoService.buscarContratosPorClienteId(usuario.id);
  const occurrences = OcorrenciaService.buscarOcorrenciasPorClienteId(usuario.id);
  const activeContracts = contracts.filter(contract => contract.statusOperacional?.toLocaleLowerCase("pt-BR") === "ativo");
  const [selectedTab, setSelectedTab] = useState(() => {
    const firstAvailable = STATUS_TABS.find(tab => occurrences.some(occurrence => getGroup(occurrence.status) === tab.id));
    return firstAvailable?.id ?? "abertas";
  });
  const selectedOccurrences = selectedTab === "todas"
    ? occurrences
    : occurrences.filter(occurrence => getGroup(occurrence.status) === selectedTab);
  const trackedOccurrence = occurrences.find(occurrence => getGroup(occurrence.status) !== "concluidas") ?? occurrences[0];
  const featuredContract = activeContracts[0] ?? contracts[0];
  const pendingEvaluation = occurrences.find(occurrence => getGroup(occurrence.status) === "concluidas" && !occurrence.avaliacao?.nota);
  const latestEvaluation = occurrences.find(occurrence => occurrence.avaliacao?.nota);
  const timelinePosition = trackedOccurrence ? getTimelinePosition(trackedOccurrence.status) : -1;

  const navigation = [
    { label: "Painel do Cliente", icon: "⌂", active: true, onClick: () => jumpTo("painel") },
    { label: "Minhas Ocorrências", icon: "▤", onClick: () => jumpTo("ocorrencias") },
    { label: "Meus Equipamentos", icon: "▣", onClick: () => jumpTo("equipamento") },
    { label: "Contratos", icon: "▧", onClick: () => jumpTo("equipamento") },
    { label: "Documentos", icon: "▤", disabled: true },
    { label: "Notificações", icon: "♧", onClick: () => jumpTo("ocorrencias") },
    { label: "Perfil e Acesso", icon: "♙", disabled: true },
    { label: "Ajuda e Suporte", icon: "?", disabled: true },
  ];

  return (
    <DashboardShell
      user={usuario}
      role="Cliente"
      sidebarLabel="Navegação do cliente"
      navigation={navigation}
      helpCard={{
        title: "Precisa de ajuda?",
        description: "Fale com a nossa central de atendimento 24h.",
        href: "mailto:suporte@smartlift.com.br",
        action: "Abrir chamado",
      }}
    >
      <DashboardMain id="painel">
        <DashboardIntro
          title={`Olá, ${usuario.nome}! 👋`}
          subtitle="Acompanhe o status das suas ocorrências e informações dos seus equipamentos."
        />
        <DashboardColumns>
          <DashboardColumn>
            <SummaryGrid label="Resumo da conta">
              <SummaryCard
                icon="✧"
                title="Ocorrências abertas"
                value={occurrences.filter(occurrence => getGroup(occurrence.status) === "abertas").length}
                action="Ver todas"
                tone="#fff2dc"
                ink="#b67a19"
                onClick={() => setSelectedTab("abertas")}
              />
              <SummaryCard
                icon="◷"
                title="Em atendimento"
                value={occurrences.filter(occurrence => getGroup(occurrence.status) === "atendimento").length}
                action="Ver todas"
                tone="#eaf0ff"
                ink="#2861c8"
                onClick={() => setSelectedTab("atendimento")}
              />
              <SummaryCard
                icon="✓"
                title="Concluídas"
                value={occurrences.filter(occurrence => getGroup(occurrence.status) === "concluidas").length}
                action="Ver todas"
                tone="#e7f5e9"
                ink="#398e4f"
                onClick={() => setSelectedTab("concluidas")}
              />
              <SummaryCard
                icon="▤"
                title="Equipamentos ativos"
                value={activeContracts.length}
                action="Ver equipamentos"
                tone="#eaf0ff"
                ink="#2861c8"
                onClick={() => jumpTo("equipamento")}
              />
            </SummaryGrid>
            <Panel id="ocorrencias">
              <PanelHeader>
                <h2>Minhas ocorrências</h2>
                <PanelAction type="button" onClick={() => setSelectedTab("todas")}>Ver todas</PanelAction>
              </PanelHeader>
              <StatusTabs role="tablist" aria-label="Filtrar ocorrências por status">
                {STATUS_TABS.map(tab => {
                  const count = occurrences.filter(occurrence => getGroup(occurrence.status) === tab.id).length;
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
              {selectedOccurrences.length > 0 ? (
                <OccurrenceList>
                  {selectedOccurrences.map(occurrence => {
                    const group = getGroup(occurrence.status);
                    const contract = occurrence.contrato;
                    const serviceDate = occurrence.atendimentos[0]?.dataHoraInicioAtendimento;
                    return (
                      <OccurrenceCard key={occurrence.id} group={group} status={occurrence.status}>
                        <OccurrenceCardDetails>
                          <div><strong>{getOccurrenceCode(occurrence)}</strong></div>
                          <h3>{occurrence.categoria} — {contract?.localizacao?.apelido ?? contract?.produtoApelido ?? "Equipamento"}</h3>
                          <p>{occurrence.descricao}</p>
                          <small>
                            {serviceDate ? `Iniciado em ${formatDate(serviceDate)}` : `Status: ${occurrence.status}`}
                            {" · "}{contract?.localizacao?.cidade}{contract?.localizacao?.estado && ` - ${contract.localizacao.estado}`}
                          </small>
                        </OccurrenceCardDetails>
                      </OccurrenceCard>
                    );
                  })}
                </OccurrenceList>
              ) : <EmptyState>Nenhuma ocorrência nesta etapa.</EmptyState>}
            </Panel>
            <CustomerFeedback
              title={pendingEvaluation ? "Sua opinião é importante!" : latestEvaluation ? "Obrigado pela sua avaliação!" : "Sua opinião é importante!"}
              message={pendingEvaluation
                ? "Avalie nossos atendimentos e nos ajude a melhorar cada vez mais."
                : latestEvaluation
                  ? `Sua nota: ${latestEvaluation.avaliacao.nota}/5${latestEvaluation.avaliacao.comentario ? ` — ${latestEvaluation.avaliacao.comentario}` : ""}`
                  : "Quando um atendimento for concluído, você poderá compartilhar sua experiência."}
              actionHref={pendingEvaluation ? "mailto:suporte@smartlift.com.br?subject=Avalia%C3%A7%C3%A3o%20do%20atendimento" : null}
              actionLabel="Avaliar atendimento"
            />
          </DashboardColumn>
          <DashboardColumn stacked>
            <div id="equipamento">
              <EquipmentPanel
                contract={featuredContract}
                maintenanceDate={formatDate(featuredContract?.ultimaManutencao)}
                onViewAll={() => jumpTo("equipamento")}
              />
            </div>
            <ServiceTimeline occurrence={trackedOccurrence} position={timelinePosition} steps={TIMELINE_STEPS} />
          </DashboardColumn>
        </DashboardColumns>
      </DashboardMain>
    </DashboardShell>
  );
}
