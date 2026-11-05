import styled from 'styled-components'
import smartliftLogo from '../assets/smartlift-logo.webp';

const StyledHeader = styled.header`
  background-color: var(--color-header);
  padding: 1rem;
  position: sticky;
  top: 0;

  display: grid;
  align-items: center;
  grid-template-columns: 1fr 1fr 1fr;

  & img { height: 2.5rem; }
  & h2 { text-transform: uppercase; font-size: 1rem; font-weight: 600; letter-spacing: 0.1rem; text-align: center; }
`;

export default function Header() {
  return (
    <StyledHeader>
      <img src={smartliftLogo} alt="Smart Lift Logo" />
      <h2>Portal de Acesso</h2>
    </StyledHeader>
  )
}
