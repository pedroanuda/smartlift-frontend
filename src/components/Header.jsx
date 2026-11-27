import styled from "styled-components";
import smartliftLogo from "../assets/smartlift-logo.webp";

const StyledHeader = styled.header`
  background-color: var(--color-header);
  padding: 0.9rem clamp(1rem, 3vw, 2rem);
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid rgba(10, 28, 63, 0.08);

  display: grid;
  align-items: center;
  grid-template-columns: 1fr auto 1fr;
  gap: 0.75rem;

  & img {
    height: clamp(2rem, 4vw, 2.5rem);
    width: auto;
    display: block;
  }

  & h2 {
    text-transform: uppercase;
    font-size: clamp(0.78rem, 2vw, 1rem);
    font-weight: 600;
    letter-spacing: 0.08rem;
    text-align: center;
    color: var(--color-text-primary);
  }

  @media (max-width: 600px) {
    display: flex;
    justify-content: space-between;
    align-items: center;

    & h2 {
      text-align: right;
    }
  }
`;

export default function Header() {
  return (
    <StyledHeader>
      <img src={smartliftLogo} alt="Smart Lift Logo" />
      <h2>Portal de Acesso</h2>
    </StyledHeader>
  );
}
