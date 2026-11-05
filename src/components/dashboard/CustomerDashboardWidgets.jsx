/* eslint-disable no-unused-vars */
import styled from "styled-components";
import { EmptyState, Panel, PanelAction, PanelHeader, StatusBadge } from "./DashboardContent";

const Equipment = styled.div`
  display: grid;
  grid-template-columns: 4.5rem minmax(0, 1fr);
  gap: 0.75rem;
  align-items: center;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid #eceef2;

  img {
    width: 4.5rem;
    height: 4.5rem;
    border-radius: 0.35rem;
    object-fit: cover;
    background: #f1f3f5;
  }
  h3 { margin-bottom: 0.35rem; font-size: 0.75rem; }
  p { margin-bottom: 0.25rem; color: #68758a; font-size: 0.65rem; }
`;

const EquipmentMeta = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  padding-top: 0.75rem;
  color: #68758a;
  font-size: 0.62rem;
  span { display: grid; gap: 0.25rem; }
  strong { color: #172a4c; font-size: 0.63rem; }
`;

const Timeline = styled.ol`
  list-style: none;
  display: grid;
  gap: 0.1rem;
`;

const TimelineItem = styled.li`
  min-height: 3.45rem;
  display: grid;
  grid-template-columns: 1.7rem 1fr;
  gap: 0.55rem;
  position: relative;

  &:not(:last-child)::after {
    content: "";
    position: absolute;
    left: 0.72rem;
    top: 1.55rem;
    bottom: -0.1rem;
    border-left: 1px solid #d5dbe5;
  }

  & > span:first-child {
    z-index: 1;
    width: 1.45rem;
    height: 1.45rem;
    border: 1px solid ${({ $complete }) => ($complete ? "#1755b5" : "#aeb7c5")};
    border-radius: 50%;
    background: ${({ $complete }) => ($complete ? "#1755b5" : "#fff")};
    color: ${({ $complete }) => ($complete ? "#fff" : "#667286")};
    display: grid;
    place-items: center;
    font-size: 0.65rem;
    font-weight: 700;
  }
  strong { font-size: 0.68rem; }
  p { margin-top: 0.2rem; color: #68758a; font-size: 0.63rem; line-height: 1.45; }
`;

const Feedback = styled.div`
  margin-top: 0.8rem;
  padding: 0.9rem 1rem;
  border: 1px solid #ece7e0;
  border-radius: 0.55rem;
  background: #fffaf3;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.8rem;
  h2 { margin-bottom: 0.25rem; font-size: 0.75rem; }
  p { color: #68758a; font-size: 0.65rem; }
  a {
    flex: 0 0 auto;
    padding: 0.6rem 0.9rem;
    border-radius: 0.35rem;
    background: #09234b;
    color: white;
    text-decoration: none;
    font-size: 0.66rem;
    font-weight: 700;
  }
`;

export function EquipmentPanel({ contract, maintenanceDate, onViewAll }) {
  return (
    <Panel>
      <PanelHeader>
        <h2>Equipamento em destaque</h2>
        <PanelAction type="button" onClick={onViewAll}>Ver todos</PanelAction>
      </PanelHeader>
      {contract ? (
        <>
          <Equipment>
            <img src={`/${contract.produto?.imagem}`} alt={contract.produto?.modelo ?? "Equipamento"} />
            <div>
              <h3>{contract.produtoApelido ?? contract.produto?.modelo}</h3>
              <p>{contract.localizacao?.apelido}{contract.localizacao?.tipo && ` · ${contract.localizacao.tipo}`}</p>
              <p>Contrato: {contract.id}</p>
              <StatusBadge $group={contract.statusOperacional?.toLocaleLowerCase("pt-BR") === "ativo" ? "concluidas" : "abertas"}>
                {contract.statusOperacional}
              </StatusBadge>
            </div>
          </Equipment>
          <EquipmentMeta>
            <span>Modelo<strong>{contract.produto?.modelo ?? "Não informado"}</strong></span>
            <span>Última manutenção<strong>{maintenanceDate ?? "Não informada"}</strong></span>
          </EquipmentMeta>
        </>
      ) : <EmptyState>Nenhum equipamento vinculado ao seu perfil.</EmptyState>}
    </Panel>
  );
}

export function ServiceTimeline({ occurrence, position, steps }) {
  return (
    <Panel>
      <PanelHeader><h2>Acompanhe seu atendimento</h2></PanelHeader>
      {occurrence ? (
        <Timeline>
          {steps.map(([title, description], index) => {
            const complete = index <= position;
            return (
              <TimelineItem key={title} $complete={complete}>
                <span>{complete ? "✓" : index + 1}</span>
                <div>
                  <strong>{title}</strong>
                  <p>{index === position ? occurrence.descricao : description}</p>
                </div>
              </TimelineItem>
            );
          })}
        </Timeline>
      ) : <EmptyState>Quando você abrir uma ocorrência, poderá acompanhar o atendimento por aqui.</EmptyState>}
    </Panel>
  );
}

export function CustomerFeedback({ title, message, actionHref, actionLabel }) {
  return (
    <Feedback>
      <div><h2>{title}</h2><p>{message}</p></div>
      {actionHref && <a href={actionHref}>{actionLabel}</a>}
    </Feedback>
  );
}
