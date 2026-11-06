
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

function jumpTo(id) {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}


const STORAGE_KEY = "smartlift.novasOcorrencias";

function buscarOcorrenciasLocalStorage() {
  try {
    const dados = localStorage.getItem(STORAGE_KEY);
    return dados ? JSON.parse(dados) : [];
  } catch (error) {
    console.error("Erro ao carregar ocorrências:", error);
    return [];
  }
}


export default function TecnicoDashboard({ usuario }) {
  const navigate = useNavigate();

  const [filtro, setFiltro] = useState("Pendentes");

  // Busca ocorrências que possuem atendimento atribuído ao técnico logado.
    const ocorrenciasSalvas = buscarOcorrenciasLocalStorage();

    const ocorrenciasOriginais = OcorrenciaService.buscarOcorrencias();

    // Combina os dados do serviço com os cadastros do localStorage.
    const ocorrenciasMap = new Map();

    [...ocorrenciasOriginais, ...ocorrenciasSalvas].forEach((ocorrencia) => {
    ocorrenciasMap.set(String(ocorrencia.id), ocorrencia);
    });

    const ocorrencias = Array.from(ocorrenciasMap.values());

    const ocorrenciasExibidas = ocorrencias.filter((ocorrencia) => {
    const status = (ocorrencia.status || "Pendente").toLowerCase();

    if (filtro === "Pendentes") {
        return status === "pendente" || status === "pendente de atribuição";
    }

    if (filtro === "Em andamento") {
        return status === "em andamento";
    }

    if (filtro === "Concluídas") {
        return (
        status === "finalizada" ||
        status === "concluída" ||
        status === "concluida"
        );
    }

    return true;
    });

  const navigation = [
    {
      label: "Painel do Técnico",
      icon: "⌂",
      active: true,
      onClick: () => jumpTo("painel-tecnico"),
    },
    {
      label: "Ocorrências Atribuídas",
      icon: "▤",
      onClick: () => jumpTo("ocorrencias-tecnico"),
    },
    {
      label: "Notificações",
      icon: "♧",
      badge: "1",
      onClick: () => jumpTo("notificacoes-tecnico"),
    },
    {
      label: "Perfil e Acesso",
      icon: "♙",
      disabled: true,
    },
    {
      label: "Ajuda e Suporte",
      icon: "?",
      onClick: () => jumpTo("suporte-tecnico"),
    },
  ];

  const metrics = [
    { icon: "⌛", label: "Ocorrências pendentes", number: 2, filter: "Pendentes" },
    { icon: "🔧", label: "Em andamento", number: 1, filter: "Em andamento" },
    { icon: "⚠️", label: "SLA crítico", number: 1, filter: "Pendentes" },
    { icon: "✓", label: "Concluídas (30 dias)", number: 6, filter: "Concluídas" },
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


  
  return (
    <DashboardShell
      user={usuario}
      role="Técnico"
      sidebarLabel="Navegação do técnico"
      navigation={navigation}
      helpCard={helpCard}
    >
      <DashboardMain id="painel-tecnico">
        <DashboardIntro
          title={`Olá, ${usuario.nome}!`}
          subtitle="Você tem 3 atendimentos ativos hoje. Confira suas atividades."
        />

        <PageContent>
          <MetricsGrid>
            {metrics.map((metric) => (
              <MetricCard key={metric.label}>
                <div className="metric-icon">{metric.icon}</div>
                <div className="metric-label">{metric.label}</div>
                <div className="metric-number">{metric.number}</div>
                <button
                  type="button"
                  onClick={() => {
                    setFiltro(metric.filter);
                    jumpTo("ocorrencias-tecnico");
                  }}
                >
                  Ver todas →
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
                { label: "Pendentes", count: 2 },
                { label: "Em andamento", count: 1 },
                { label: "Concluídas", count: 1 },
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
                      <Priority>Alta prioridade</Priority>
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
                        ◷ Iniciado em{" "}
                        {formatDate(atendimento?.dataHoraInicioAtendimento)}
                      </span>
                      <span>⌖ {getLocation(ocorrencia)}</span>
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
                <h2>Notificações</h2>
                <p>Atualizações importantes sobre seus atendimentos.</p>
              </div>
            </SectionHeader>

            <SupportText>
              Você possui 1 notificação pendente para consultar.
            </SupportText>
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
