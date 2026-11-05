/* eslint-disable no-unused-vars, react-refresh/only-export-components */
import styled from "styled-components";

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.55rem;
  margin-bottom: 0.8rem;

  @media (max-width: 860px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 390px) { grid-template-columns: 1fr; }
`;

const SummaryCardButton = styled.button`
  min-height: 6rem;
  padding: 0.75rem;
  border: 1px solid #e4e7ec;
  border-radius: 0.55rem;
  background: #fff;
  color: #172a4c;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  &:hover { border-color: #9ab5e9; box-shadow: 0 2px 8px #0a1c3f12; }

  & > span:first-child {
    width: 2.65rem;
    height: 2.65rem;
    flex: 0 0 2.65rem;
    border-radius: 50%;
    background: ${({ $tone }) => $tone};
    color: ${({ $ink }) => $ink};
    display: grid;
    place-items: center;
    font-size: 1.2rem;
  }
  & > span:last-child { display: grid; gap: 0.2rem; }
  small { color: #566276; font-size: 0.66rem; line-height: 1.3; }
  strong { font-size: 1.25rem; }
  em { color: #1255b5; font-size: 0.64rem; font-style: normal; font-weight: 700; }
`;

export function SummaryCard({ icon, title, value, action, tone, ink, onClick }) {
  return (
    <SummaryCardButton type="button" $tone={tone} $ink={ink} onClick={onClick}>
      <span>{icon}</span>
      <span><small>{title}</small><strong>{value}</strong><em>{action}</em></span>
    </SummaryCardButton>
  );
}

export const Panel = styled.section`
  padding: 1rem;
  background: #fff;
  border: 1px solid #e7e9ed;
  border-radius: 0.55rem;
`;

export const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.65rem;
  h2 { font-size: 0.9rem; }
`;

export const PanelAction = styled.button`
  padding: 0.25rem 0;
  border: 0;
  background: transparent;
  color: #1459bd;
  font: inherit;
  font-size: 0.7rem;
  font-weight: 700;
  cursor: pointer;
`;

export const StatusTabs = styled.div`
  display: flex;
  gap: 0.4rem;
  overflow-x: auto;
  border-bottom: 1px solid #e3e6eb;
  margin-bottom: 0.75rem;
`;

export const StatusTab = styled.button`
  padding: 0.6rem 0.7rem;
  border: 0;
  border-bottom: 2px solid ${({ $active }) => ($active ? "#2861c8" : "transparent")};
  background: transparent;
  color: ${({ $active }) => ($active ? "#172a4c" : "#596579")};
  font: inherit;
  font-size: 0.68rem;
  font-weight: ${({ $active }) => ($active ? "700" : "500")};
  white-space: nowrap;
  cursor: pointer;
`;

export const EmptyState = styled.p`
  padding: 1.8rem 0.5rem;
  color: #68758a;
  text-align: center;
  font-size: 0.75rem;
`;

export const OccurrenceList = styled.div`display: grid; gap: 0.55rem;`;

const OccurrenceCardContainer = styled.article`
  min-height: 6rem;
  padding: 0.8rem 0.75rem;
  border: 1px solid #e7e9ed;
  border-left: 3px solid ${({ $group }) => ($group === "concluidas" ? "#43a35b" : $group === "atendimento" ? "#4c7fe0" : "#e4ad43")};
  border-radius: 0.45rem;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 0.6rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr auto;
    & > span:last-child { grid-column: 1 / -1; justify-self: start; }
  }
`;

const OccurrenceDetails = styled.div`
  min-width: 0;
  display: grid;
  gap: 0.3rem;
  & > div:first-child { display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; }
  strong { font-size: 0.7rem; }
  h3 { font-size: 0.72rem; }
  p { color: #647084; font-size: 0.67rem; }
  small { color: #647084; font-size: 0.63rem; }
`;

const Arrow = styled.span`color: #818b9b; font-size: 1.4rem;`;

export function OccurrenceCard({ group, status, children }) {
  return (
    <OccurrenceCardContainer $group={group}>
      {children}
      <StatusBadge $group={group}>{status}</StatusBadge>
      <Arrow aria-hidden="true">›</Arrow>
    </OccurrenceCardContainer>
  );
}

export function OccurrenceCardDetails({ children }) {
  return <OccurrenceDetails>{children}</OccurrenceDetails>;
}

export const StatusBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 0.4rem;
  background: ${({ $group }) => ($group === "concluidas" ? "#e5f5e8" : $group === "atendimento" ? "#e9f0ff" : "#fff3de")};
  color: ${({ $group }) => ($group === "concluidas" ? "#328345" : $group === "atendimento" ? "#2859b4" : "#a36a13")};
  font-size: 0.62rem;
  font-weight: 700;
  white-space: nowrap;
`;
