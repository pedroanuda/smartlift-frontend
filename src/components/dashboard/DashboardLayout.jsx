/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import styled from "styled-components";
import smartliftLogo from "../../assets/smartlift-logo.webp";
import db from "../../db";

const Page = styled.div`
  min-height: 100vh;
  color: #172a4c;
  background: #f8f9fb;
`;

const Header = styled.header`
  height: 4.5rem;
  padding: 0 2rem;
  background: #fff;
  border-bottom: 1px solid #e7eaf0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 10;

  @media (max-width: 600px) {
    padding: 0 1rem;
  }
`;

const LogoButton = styled.button`
  border: 0;
  background: transparent;
  padding: 0.25rem;
  margin-left: -0.25rem;
  border-radius: 0.4rem;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  transition: opacity 0.15s ease;

  img {
    width: 9.5rem;
    max-height: 2.5rem;
    object-fit: contain;
    display: block;
  }
  &:hover {
    opacity: 0.85;
  }
  &:focus-visible {
    outline: 2px solid #1755b5;
    outline-offset: 2px;
  }

  @media (max-width: 600px) {
    img {
      width: 7.5rem;
    }
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MenuAnchor = styled.div`
  position: relative;
`;

const IconButton = styled.button`
  width: 2.4rem;
  height: 2.4rem;
  border: 0;
  border-radius: 50%;
  background: ${({ $active }) => ($active ? "#eef3fb" : "transparent")};
  color: #172a4c;
  display: grid;
  place-items: center;
  font-size: 1rem;
  position: relative;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: #eef3fb;
  }
  &:focus-visible {
    outline: 2px solid #1755b5;
    outline-offset: 2px;
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 0.2rem;
  right: 0.2rem;
  min-width: 1rem;
  height: 1rem;
  padding: 0 0.25rem;
  border-radius: 999px;
  background: #d9534f;
  color: #fff;
  font-size: 0.6rem;
  font-weight: 700;
  display: grid;
  place-items: center;
  line-height: 1;
`;

const ProfileButton = styled.button`
  border: 0;
  border-radius: 0.5rem;
  padding: 0.35rem 0.5rem;
  background: ${({ $active }) => ($active ? "#eef3fb" : "transparent")};
  color: inherit;
  font: inherit;
  font-size: 0.8rem;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: #eef3fb;
  }
  &:focus-visible {
    outline: 2px solid #1755b5;
    outline-offset: 2px;
  }

  & > div:nth-child(2) {
    display: grid;
    gap: 0.15rem;
  }
  & small {
    color: #68758a;
  }
  & > i {
    color: #68758a;
    font-size: 0.68rem;
    margin-left: 0.15rem;
    transition: transform 0.15s ease;
    transform: ${({ $active }) => ($active ? "rotate(180deg)" : "none")};
  }

  @media (max-width: 520px) {
    & > div:nth-child(2),
    & > i {
      display: none;
    }
  }
`;

const DropdownPanel = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: ${({ $wide }) => ($wide ? "19.5rem" : "14.5rem")};
  max-width: calc(100vw - 2rem);
  background: #fff;
  border: 1px solid #e2e6ee;
  border-radius: 0.6rem;
  box-shadow: 0 12px 28px rgba(10, 28, 63, 0.14);
  overflow: hidden;
  z-index: 20;
`;

const DropdownHeader = styled.div`
  padding: 0.75rem 0.9rem;
  border-bottom: 1px solid #edf0f4;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;

  strong {
    font-size: 0.78rem;
    color: #172a4c;
  }
  small {
    font-size: 0.66rem;
    color: #68758a;
  }
`;

const NotificationList = styled.div`
  max-height: 18rem;
  overflow-y: auto;
  display: grid;
`;

const NotificationItem = styled.button`
  width: 100%;
  border: 0;
  border-bottom: 1px solid #f1f3f7;
  padding: 0.75rem 0.9rem;
  background: ${({ $unread }) => ($unread ? "#f7faff" : "#fff")};
  text-align: left;
  font: inherit;
  cursor: pointer;
  display: grid;
  gap: 0.2rem;

  &:last-child {
    border-bottom: 0;
  }
  &:hover {
    background: #eef3fb;
  }

  strong {
    font-size: 0.72rem;
    color: #172a4c;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
  p {
    font-size: 0.67rem;
    color: #5f6d82;
    line-height: 1.4;
  }
`;

const UnreadDot = styled.span`
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 50%;
  background: #1755b5;
  flex-shrink: 0;
`;

const DropdownEmpty = styled.p`
  padding: 1.25rem 0.9rem;
  text-align: center;
  font-size: 0.72rem;
  color: #68758a;
`;

const ProfileSummary = styled.div`
  padding: 0.8rem 0.9rem;
  border-bottom: 1px solid #edf0f4;
  display: grid;
  gap: 0.15rem;

  strong {
    font-size: 0.78rem;
    color: #172a4c;
  }
  small {
    font-size: 0.67rem;
    color: #68758a;
    word-break: break-word;
  }
`;

const MenuAction = styled.button`
  width: 100%;
  border: 0;
  padding: 0.75rem 0.9rem;
  background: #fff;
  color: ${({ $danger }) => ($danger ? "#c0392b" : "#172a4c")};
  font: inherit;
  font-size: 0.75rem;
  font-weight: 600;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 0.55rem;
  cursor: pointer;

  &:hover {
    background: ${({ $danger }) => ($danger ? "#fdf2f2" : "#eef3fb")};
  }
`;

const Avatar = styled.div`
  width: 2.4rem;
  height: 2.4rem;
  color: white;
  background: #09234b;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-weight: 700;
  flex-shrink: 0;
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 14.5rem minmax(0, 1fr);
  min-height: calc(100vh - 4.5rem);

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.aside`
  position: sticky;
  top: 4.5rem;
  height: calc(100vh - 4.5rem);
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: #274873 transparent;
  padding: 1.25rem 0.65rem;
  background: #061f42;
  color: #f5f7fb;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  @media (max-width: 760px) {
    position: static;
    height: auto;
    overflow-y: visible;
    flex-direction: row;
    overflow-x: auto;
    padding: 0.5rem;
  }
`;

const NavButton = styled.button`
  width: 100%;
  min-height: 2.8rem;
  flex-shrink: 0;
  padding: 0.6rem 0.75rem;
  border: 0;
  border-radius: 0.35rem;
  background: ${({ $active }) => ($active ? "#173b68" : "transparent")};
  color: ${({ disabled }) => (disabled ? "#95a3b8" : "#f5f7fb")};
  text-align: left;
  font: inherit;
  font-size: 0.78rem;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};

  &:hover:not(:disabled) {
    background: #173b68;
  }
  & > span:first-child {
    width: 1.25rem;
    text-align: center;
    font-size: 0.9rem;
  }
  & > span:last-child:not(:first-child) {
    margin-left: auto;
  }

  @media (max-width: 760px) {
    width: auto;
    flex: 0 0 auto;
    min-height: 2.5rem;
    white-space: nowrap;
  }
`;

const HelpCard = styled.div`
  margin: auto 0.2rem 0.25rem;
  flex-shrink: 0;
  padding: 1.1rem 0.8rem;
  border-radius: 0.6rem;
  background: #122f54;
  text-align: center;
  font-size: 0.74rem;
  line-height: 1.6;

  strong {
    display: block;
    margin-bottom: 0.4rem;
    font-size: 0.84rem;
  }
  a {
    display: block;
    margin-top: 0.8rem;
    padding: 0.6rem;
    border-radius: 0.35rem;
    background: #f4dfbd;
    color: #172a4c;
    font-weight: 700;
    text-decoration: none;
  }

  @media (max-width: 760px) {
    display: none;
  }
`;

const Main = styled.main`
  width: min(100%, 83rem);
  padding: 1.6rem 2rem 2rem;
  margin: 0 auto;

  @media (max-width: 600px) {
    padding: 1.25rem 1rem;
  }
`;

const Intro = styled.div`
  margin-bottom: 1.15rem;
  h1 {
    margin-bottom: 0.3rem;
    font-size: 1.35rem;
  }
  p {
    color: #68758a;
    font-size: 0.82rem;
  }
`;

const Columns = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2.15fr) minmax(16rem, 0.95fr);
  gap: 0.8rem;
  align-items: start;

  @media (max-width: 1050px) {
    grid-template-columns: 1fr;
  }
`;

const Column = styled.div`
  min-width: 0;
  ${({ $stacked }) => $stacked && "display: grid; gap: 0.8rem;"}
`;

export function DashboardShell({
  user,
  role,
  logo = smartliftLogo,
  sidebarLabel,
  navigation,
  notifications = [],
  helpCard,
  children,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);
  const actionsRef = useRef(null);
  const initials = `${user.nome?.[0] ?? ""}${user.sobrenome?.[0] ?? ""}`;
  const unreadCount = notifications.filter((item) => item.unread).length;

  useEffect(() => {
    if (!openMenu) return undefined;

    function handleOutsideClick(event) {
      if (actionsRef.current && !actionsRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setOpenMenu(null);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openMenu]);

  function handleLogoClick() {
    setOpenMenu(null);
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  }

  function handleLogout() {
    setOpenMenu(null);
    db.dados.logado = null;
    navigate("/login");
  }

  return (
    <Page>
      <Header>
        <LogoButton
          type="button"
          onClick={handleLogoClick}
          aria-label="Voltar ao início"
        >
          <img src={logo} alt="SmartLift" />
        </LogoButton>
        <HeaderActions ref={actionsRef}>
          <MenuAnchor>
            <IconButton
              type="button"
              $active={openMenu === "notifications"}
              aria-label="Notificações"
              aria-haspopup="true"
              aria-expanded={openMenu === "notifications"}
              onClick={() =>
                setOpenMenu((prev) =>
                  prev === "notifications" ? null : "notifications",
                )
              }
            >
              <i className="fa-solid fa-bell" aria-hidden="true" />
              {unreadCount > 0 && (
                <NotificationBadge aria-label={`${unreadCount} não lidas`}>
                  {unreadCount > 9 ? "9+" : unreadCount}
                </NotificationBadge>
              )}
            </IconButton>
            {openMenu === "notifications" && (
              <DropdownPanel
                $wide
                role="region"
                aria-label="Lista de notificações"
              >
                <DropdownHeader>
                  <strong>Notificações</strong>
                  <small>
                    {notifications.length}{" "}
                    {notifications.length === 1 ? "item" : "itens"}
                  </small>
                </DropdownHeader>
                {notifications.length > 0 ? (
                  <NotificationList>
                    {notifications.map((item) => (
                      <NotificationItem
                        key={item.id}
                        type="button"
                        $unread={item.unread}
                        onClick={() => {
                          setOpenMenu(null);
                          item.onClick?.();
                        }}
                      >
                        <strong>
                          {item.unread && <UnreadDot aria-hidden="true" />}
                          {item.title}
                        </strong>
                        <p>{item.description}</p>
                      </NotificationItem>
                    ))}
                  </NotificationList>
                ) : (
                  <DropdownEmpty>Nenhuma notificação no momento.</DropdownEmpty>
                )}
              </DropdownPanel>
            )}
          </MenuAnchor>

          <MenuAnchor>
            <ProfileButton
              type="button"
              $active={openMenu === "profile"}
              aria-haspopup="menu"
              aria-expanded={openMenu === "profile"}
              onClick={() =>
                setOpenMenu((prev) => (prev === "profile" ? null : "profile"))
              }
            >
              <Avatar aria-hidden="true">{initials}</Avatar>
              <div>
                <strong>
                  {user.nome} {user.sobrenome}
                </strong>
                <small>{role}</small>
              </div>
              <i className="fa-solid fa-chevron-down" aria-hidden="true" />
            </ProfileButton>
            {openMenu === "profile" && (
              <DropdownPanel role="menu" aria-label="Menu do usuário">
                <ProfileSummary>
                  <strong>
                    {user.nome} {user.sobrenome}
                  </strong>
                  {user.email && <small>{user.email}</small>}
                  <small>Perfil: {role}</small>
                </ProfileSummary>
                <MenuAction
                  type="button"
                  role="menuitem"
                  onClick={handleLogoClick}
                >
                  <i className="fa-solid fa-house" aria-hidden="true" />
                  Ir para o painel
                </MenuAction>
                <MenuAction
                  type="button"
                  role="menuitem"
                  $danger
                  onClick={handleLogout}
                >
                  <i
                    className="fa-solid fa-right-from-bracket"
                    aria-hidden="true"
                  />
                  Trocar perfil / Sair
                </MenuAction>
              </DropdownPanel>
            )}
          </MenuAnchor>
        </HeaderActions>
      </Header>
      <Layout>
        <Sidebar aria-label={sidebarLabel}>
          {navigation.map((item) => (
            <NavButton
              key={item.label}
              type="button"
              $active={item.active}
              disabled={item.disabled}
              onClick={item.onClick}
            >
              <span>{item.icon}</span>
              {item.label}
              {item.badge && <span>{item.badge}</span>}
            </NavButton>
          ))}
          {helpCard && (
            <HelpCard>
              <strong>{helpCard.title}</strong>
              {helpCard.description}
              <a href={helpCard.href}>{helpCard.action}</a>
            </HelpCard>
          )}
        </Sidebar>
        {children}
      </Layout>
    </Page>
  );
}

export function DashboardMain({ id, children }) {
  return <Main id={id}>{children}</Main>;
}

export function DashboardIntro({ title, subtitle }) {
  return (
    <Intro>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </Intro>
  );
}

export function DashboardColumns({ children }) {
  return <Columns>{children}</Columns>;
}

export function DashboardColumn({ stacked = false, children }) {
  return <Column $stacked={stacked}>{children}</Column>;
}
