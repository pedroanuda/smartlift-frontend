/* eslint-disable no-unused-vars */
import styled from 'styled-components';

const StyledFooter = styled.footer`
  background-color: var(--color-surface);
  color: var(--color-on-primary);
  padding: 1rem clamp(1rem, 4vw, 2rem);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem 1rem;
  flex-wrap: wrap;

  & > h2 {
    letter-spacing: 0.1rem;
    font-size: clamp(1rem, 2.5vw, 1.25rem);
    font-weight: 500;
  }

  & > span {
    font-size: clamp(0.75rem, 2vw, 0.88rem);
    color: rgba(247, 248, 248, 0.85);
  }

  @media (max-width: 600px) {
    flex-direction: column;
    text-align: center;
  }
`;

export default function Footer() {
  return (
    <StyledFooter>
      <h2>SMART LIFT</h2>
      <span>&copy; 2026 Smart Lift - Powered by OTIS</span>
    </StyledFooter>
  );
}
