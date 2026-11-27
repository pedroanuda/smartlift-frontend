/* eslint-disable no-unused-vars */
import styled from "styled-components";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useLocation, useNavigate } from "react-router";
import UsuarioService from "../services/UsuarioService";
import React from "react";

const PageWrapper = styled.div`
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
`;

const StyledMain = styled.main`
  flex: 1;
  width: 100%;
  padding: clamp(1.5rem, 4vw, 3rem) clamp(1rem, 4vw, 2rem);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeroSection = styled.section`
  width: 100%;
  max-width: 64rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const WelcomeBadge = styled.span`
  text-transform: uppercase;
  background-color: var(--color-primary-strong);
  color: var(--color-on-primary);
  padding: 0.45rem 0.95rem;
  border-radius: 999px;
  font-size: clamp(0.68rem, 1.8vw, 0.8rem);
  font-weight: 600;
  letter-spacing: 0.08rem;
  margin-bottom: 0.9rem;
`;

const Title = styled.h2`
  font-family: var(--font-heading);
  font-size: clamp(1.7rem, 4.5vw, 2.5rem);
  line-height: 1.2;
  color: var(--color-text-primary);
  margin-bottom: 0.55rem;
`;

const Subtitle = styled.p`
  font-size: clamp(0.88rem, 2vw, 1rem);
  color: #41516b;
  max-width: 34rem;
  line-height: 1.5;
`;

const CardsGrid = styled.div`
  width: 100%;
  margin-top: clamp(1.5rem, 3.5vw, 2.4rem);
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const StyledCard = styled.article`
  background-color: var(--color-surface);
  border-radius: 14px;
  padding: clamp(1.35rem, 3vw, 2rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  text-align: center;
  color: var(--color-on-primary);
  box-shadow: 0 10px 24px rgba(10, 28, 63, 0.14);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 14px 28px rgba(10, 28, 63, 0.2);
  }

  @media (max-width: 620px) {
    align-items: stretch;
    text-align: left;

    &:hover {
      transform: none;
    }
  }
`;

const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: 620px) {
    flex-direction: row;
    align-items: center;
    gap: 0.85rem;
  }
`;

const RoleIcon = styled.div`
  width: 2.9rem;
  height: 2.9rem;
  border-radius: 12px;
  background: rgba(214, 169, 107, 0.16);
  color: var(--color-secondary);
  display: grid;
  place-items: center;
  font-size: 1.15rem;
  flex-shrink: 0;
`;

const CardText = styled.div`
  display: grid;
  gap: 0.45rem;

  h3 {
    text-transform: uppercase;
    font-size: 1rem;
    letter-spacing: 0.06rem;
  }

  p {
    font-size: 0.86rem;
    line-height: 1.5;
    color: rgba(247, 248, 248, 0.84);
  }
`;

const AccessButton = styled.button`
  width: 100%;
  min-height: 2.75rem;
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  border: 1px solid rgba(247, 248, 248, 0.55);
  padding: 0.65rem 1rem;
  border-radius: 10px;
  font: inherit;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background-color 0.15s ease, border-color 0.15s ease;

  &:hover {
    background-color: var(--color-primary-strong);
    border-color: var(--color-on-primary);
  }

  &:focus-visible {
    outline: 2px solid var(--color-secondary);
    outline-offset: 2px;
  }
`;

function AccessCard({ role, description, icon, onClick }) {
  return (
    <StyledCard>
      <CardHeader>
        <RoleIcon aria-hidden="true">
          <i className={icon} />
        </RoleIcon>
        <CardText>
          <h3>{role}</h3>
          <p>{description}</p>
        </CardText>
      </CardHeader>
      <AccessButton type="button" onClick={onClick}>
        Acessar <i className="fa-solid fa-arrow-right" aria-hidden="true" />
      </AccessButton>
    </StyledCard>
  );
}

export default function Login() {
  const accesses = [
    {
      role: "Cliente",
      description: "Acompanhe chamados e histórico de atendimentos",
      icon: "fa-solid fa-building-user",
      id: 1,
    },
    {
      role: "Gestor",
      description: "Gerencie contratos, equipes e indicadores",
      icon: "fa-solid fa-chart-line",
      id: 2,
    },
    {
      role: "Técnico",
      description: "Ordens de serviço e agenda de manutenções",
      icon: "fa-solid fa-screwdriver-wrench",
      id: 3,
    },
  ];

  const location = useLocation();
  const navigate = useNavigate();
  const fromExists = !!location.state?.from?.pathname;
  const from = location.state?.from?.pathname || "/";

  const handleAccess = React.useCallback(
    (accessId) => {
      UsuarioService.login(accessId);
      navigate(from, { replace: fromExists });
    },
    [navigate, from, fromExists],
  );

  return (
    <PageWrapper>
      <Header />
      <StyledMain>
        <HeroSection>
          <WelcomeBadge>Bem-vindo ao portal Smart Lift</WelcomeBadge>
          <Title>Selecione seu perfil de acesso</Title>
          <Subtitle>Escolha o portal correspondente ao seu perfil</Subtitle>
          <CardsGrid>
            {accesses.map((access) => (
              <AccessCard
                key={access.id}
                role={access.role}
                description={access.description}
                icon={access.icon}
                onClick={() => handleAccess(access.id)}
              />
            ))}
          </CardsGrid>
        </HeroSection>
      </StyledMain>
      <Footer />
    </PageWrapper>
  );
}
