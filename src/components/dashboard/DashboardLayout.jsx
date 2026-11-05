/* eslint-disable no-unused-vars */
import styled from "styled-components";
import smartliftLogo from "../../assets/smartlift-logo.webp";

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
  z-index: 2;

  img { width: 9.5rem; max-height: 2.5rem; object-fit: contain; }

  @media (max-width: 600px) {
    padding: 0 1rem;
    img { width: 7.5rem; }
  }
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8rem;

  & > div:last-child { display: grid; gap: 0.15rem; }
  & small { color: #68758a; }
`;

const Avatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  color: white;
  background: #09234b;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-weight: 700;
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 14.5rem minmax(0, 1fr);
  min-height: calc(100vh - 4.5rem);

  @media (max-width: 760px) { grid-template-columns: 1fr; }
`;

const Sidebar = styled.aside`
  padding: 1.25rem 0.65rem;
  background: #061f42;
  color: #f5f7fb;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  @media (max-width: 760px) {
    flex-direction: row;
    overflow-x: auto;
    padding: 0.5rem;
  }
`;

const NavButton = styled.button`
  width: 100%;
  min-height: 2.8rem;
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

  &:hover:not(:disabled) { background: #173b68; }
  & > span:first-child { width: 1.25rem; text-align: center; font-size: 1rem; }
  & > span:last-child:not(:first-child) { margin-left: auto; }

  @media (max-width: 760px) {
    width: auto;
    flex: 0 0 auto;
    min-height: 2.5rem;
    white-space: nowrap;
  }
`;

const HelpCard = styled.div`
  margin: auto 0.2rem 1rem;
  padding: 1.1rem 0.8rem;
  border-radius: 0.6rem;
  background: #122f54;
  text-align: center;
  font-size: 0.74rem;
  line-height: 1.6;

  strong { display: block; margin-bottom: 0.4rem; font-size: 0.84rem; }
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

  @media (max-width: 760px) { display: none; }
`;

const Main = styled.main`
  width: min(100%, 83rem);
  padding: 1.6rem 2rem 2rem;
  margin: 0 auto;

  @media (max-width: 600px) { padding: 1.25rem 1rem; }
`;

const Intro = styled.div`
  margin-bottom: 1.15rem;
  h1 { margin-bottom: 0.3rem; font-size: 1.35rem; }
  p { color: #68758a; font-size: 0.82rem; }
`;

const Columns = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2.15fr) minmax(16rem, 0.95fr);
  gap: 0.8rem;
  align-items: start;

  @media (max-width: 1050px) { grid-template-columns: 1fr; }
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
  helpCard,
  children,
}) {
  const initials = `${user.nome?.[0] ?? ""}${user.sobrenome?.[0] ?? ""}`;

  return (
    <Page>
      <Header>
        <img src={logo} alt="SmartLift" />
        <Profile>
          <span aria-label="Notificações">♧</span>
          <Avatar aria-hidden="true">{initials}</Avatar>
          <div><strong>{user.nome} {user.sobrenome}</strong><small>{role}</small></div>
        </Profile>
      </Header>
      <Layout>
        <Sidebar aria-label={sidebarLabel}>
          {navigation.map(item => (
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
  return <Intro><h1>{title}</h1><p>{subtitle}</p></Intro>;
}

export function DashboardColumns({ children }) {
  return <Columns>{children}</Columns>;
}

export function DashboardColumn({ stacked = false, children }) {
  return <Column $stacked={stacked}>{children}</Column>;
}
