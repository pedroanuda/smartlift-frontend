/* eslint-disable no-unused-vars */
import { useState } from "react";
import styled from "styled-components";

const Section = styled.section`
  background: white;
  border: 1px solid #e8ecf2;
  border-radius: 12px;
  padding: 1.35rem;
  box-shadow: 0 3px 12px rgba(20, 40, 70, 0.04);
`;

const Header = styled.div`
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

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-wrap: wrap;
`;

const UnreadPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.32rem 0.7rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  background: ${({ $hasUnread }) => ($hasUnread ? "#eef3fb" : "#e7f5e9")};
  color: ${({ $hasUnread }) => ($hasUnread ? "#1765b1" : "#2f7d42")};
`;

const MarkAllButton = styled.button`
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

const Filters = styled.div`
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

const Feed = styled.div`
  display: grid;
  gap: 0.75rem;
`;

const Card = styled.article`
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

const IconBox = styled.div`
  width: 2.35rem;
  height: 2.35rem;
  border-radius: 10px;
  background: ${({ $bg }) => $bg || "#eaf0ff"};
  color: ${({ $color }) => $color || "#1765b1"};
  display: grid;
  place-items: center;
  font-size: 0.95rem;
  flex-shrink: 0;
`;

const Body = styled.div`
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

const Tag = styled.span`
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-size: 0.65rem;
  font-weight: 700;
  background: ${({ $unread }) => ($unread ? "#1765b1" : "#eef2f6")};
  color: ${({ $unread }) => ($unread ? "#fff" : "#68758a")};
`;

const CardActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
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

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  padding: 2.2rem 1rem;
  border-radius: 10px;
  border: 1px dashed #d8e2ee;
  background: #fbfcfe;
  text-align: center;

  i {
    font-size: 1.65rem;
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

export default function NotificationsCenter({
  title = "Central de notificações",
  subtitle = "Acompanhe atualizações importantes e marque o que já foi visualizado.",
  notifications = [],
  onMarkRead,
  onMarkAllRead,
}) {
  const [filter, setFilter] = useState("todas");
  const unreadItems = notifications.filter((item) => item.unread);
  const visibleItems = filter === "nao-lidas" ? unreadItems : notifications;

  return (
    <Section>
      <Header>
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>

        <HeaderActions>
          <UnreadPill $hasUnread={unreadItems.length > 0}>
            <i
              className={
                unreadItems.length > 0
                  ? "fa-solid fa-bell"
                  : "fa-solid fa-circle-check"
              }
              aria-hidden="true"
            />
            {unreadItems.length === 0
              ? "Tudo em dia"
              : unreadItems.length === 1
                ? "1 não lida"
                : `${unreadItems.length} não lidas`}
          </UnreadPill>

          {unreadItems.length > 0 && (
            <MarkAllButton type="button" onClick={onMarkAllRead}>
              <i className="fa-solid fa-check-double" aria-hidden="true" />
              Marcar todas como lidas
            </MarkAllButton>
          )}
        </HeaderActions>
      </Header>

      <Filters>
        <FilterChip
          type="button"
          $active={filter === "todas"}
          onClick={() => setFilter("todas")}
        >
          Todas ({notifications.length})
        </FilterChip>
        <FilterChip
          type="button"
          $active={filter === "nao-lidas"}
          onClick={() => setFilter("nao-lidas")}
        >
          Não lidas ({unreadItems.length})
        </FilterChip>
      </Filters>

      {visibleItems.length > 0 ? (
        <Feed>
          {visibleItems.map((item) => (
            <Card
              key={item.id}
              $unread={item.unread}
              $accent={item.accent || "#1765b1"}
            >
              <IconBox $bg={item.bg} $color={item.accent}>
                {item.icon || <i className="fa-solid fa-bell" aria-hidden="true" />}
              </IconBox>

              <Body>
                <h3>
                  {item.title}
                  <Tag $unread={item.unread}>
                    {item.unread ? "Nova" : "Lida"}
                  </Tag>
                </h3>
                <p>{item.description}</p>

                <CardActions>
                  {item.onClick && (
                    <ActionButton
                      type="button"
                      $primary
                      onClick={() => {
                        onMarkRead?.(item.id);
                        item.onClick?.();
                      }}
                    >
                      {item.actionLabel || "Abrir"}
                      <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                    </ActionButton>
                  )}

                  {item.unread && (
                    <ActionButton
                      type="button"
                      onClick={() => onMarkRead?.(item.id)}
                    >
                      <i className="fa-solid fa-check" aria-hidden="true" />
                      Marcar como lida
                    </ActionButton>
                  )}
                </CardActions>
              </Body>
            </Card>
          ))}
        </Feed>
      ) : (
        <EmptyState>
          <i className="fa-solid fa-circle-check" aria-hidden="true" />
          <strong>Tudo em dia!</strong>
          <p>
            {filter === "nao-lidas"
              ? "Você já leu todas as suas notificações pendentes."
              : "Não há notificações registradas no momento."}
          </p>
        </EmptyState>
      )}
    </Section>
  );
}
