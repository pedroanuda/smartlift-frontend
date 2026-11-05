import styled from "styled-components";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useLocation, useNavigate } from "react-router";
import db from "../db";
import React from "react";

const StyledMain = styled.main`
  padding: 1rem;
  min-height: calc(100vh - 8rem);

  & > section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  & > section > span {
    text-transform: uppercase;
    background-color: var(--color-primary-strong);
    color: var(--color-on-primary); 
    padding: 0.5rem 1rem;
    border-radius: 5px;
    font-weight: 500;
    letter-spacing: 0.1rem;

    margin-top: 2rem;
    margin-bottom: .5rem;
  }
  & > section > div { display: flex; gap: 1.5rem; }
  & > section > h2 { font-family: var(--font-heading); font-size: 2.5rem; margin-bottom: 0.5rem;}
`;

const StyledCard = styled.div`
  background-color: var(--color-surface);
  border-radius: 10px;
  padding: 2rem;
  width: 20rem;
  gap: 1.2rem;
  display: flex;
  flex-direction: column;
  margin-top: 1.5rem;

  text-align: center;
  color: var(--color-on-primary);

  & > h3 { text-transform: uppercase; }
  & > button { 
    background-color: var(--color-primary); 
    color: var(--color-on-primary); 
    border: 1px solid var(--color-on-primary); 
    padding: 0.5rem 1rem; 
    border-radius: 10px; 
    cursor: pointer;
  }
`;

function AccessCard({ role, description, onClick }) {
  return (
    <StyledCard>
      <h3>{role}</h3>
      <p>{description}</p>
      <button type="button" onClick={onClick}>
        Acessar →
      </button>
    </StyledCard>
  )
}

export default function Login() {
  const accesses = [
    {role: 'Cliente', description: 'Acompanhe chamados e histórico de atendimentos', id: 1},
    {role: 'Gestor', description: 'Gerencie contratos, equipes e indicadores', id: 2},
    {role: 'Técnico', description: 'Ordens de serviço e agenda de manutenções', id: 3}
  ];

  const location = useLocation();
  const navigate = useNavigate();
  const fromExists = !!location.state?.from?.pathname;
  const from = location.state?.from?.pathname || "/";

  const handleAccess = React.useCallback((accessId) => {
    db.dados.logado = accessId;
    navigate(from, { replace: fromExists });
  }, [navigate, from, fromExists]);

  return (
    <>
      <Header />
      <StyledMain>
        <section>
          <span>Bem-vindo ao portal Smart Lift</span>
          <h2>Selecione seu perfil de acesso</h2>
          <p>Escolha o portal correspondente ao seu perfil</p>
          <div>
            {accesses.map((access, index) => (
              <AccessCard key={index} role={access.role} description={access.description} onClick={() => handleAccess(access.id)}  />
            ))}
          </div>
        </section>
      </StyledMain>
      <Footer />
    </>
  )
}
