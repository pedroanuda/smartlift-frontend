import styled from 'styled-components'

const StyledFooter = styled.footer`
  background-color: var(--color-surface);
  color: var(--color-on-primary);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  & > h2 { letter-spacing: 0.1rem; font-size: 1.25rem; font-weight: 500; }
`

export default function Footer() {
  return (
    <StyledFooter>
      <h2>SMART LIFT</h2>
      <span>&copy; 2026 Smart Lift - Powered by OTIS</span>
    </StyledFooter>
  )
}
