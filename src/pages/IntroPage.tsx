import styled from 'styled-components'
import { navigateTo } from '../app/router/AppRouter.tsx'
import Button from '../components/common/Button.tsx'
import { ROUTES } from '../constants/routes'

const IntroShell = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background:
    radial-gradient(circle at top, rgba(219, 234, 254, 0.82), transparent 28%),
    #ffffff;
`

const CenterCard = styled.section`
  position: relative;
  width: min(100%, 560px);
  display: grid;
  justify-items: center;
  gap: 20px;
  padding: 56px 32px;
  text-align: center;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 28px 80px rgba(15, 23, 42, 0.08);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -72px;
    width: 180px;
    height: 180px;
    border-radius: 999px;
    background: rgba(219, 234, 254, 0.78);
    filter: blur(8px);
  }

  @media (max-width: 640px) {
    gap: 18px;
    padding: 48px 24px;
    border-radius: 24px;
  }
`

const ServiceName = styled.span`
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: -0.02em;
`

const Title = styled.h1`
  position: relative;
  z-index: 1;
  margin: 0;
  color: #111827;
  font-size: clamp(2.2rem, 5vw, 3.6rem);
  line-height: 1.08;
  letter-spacing: -0.05em;
`

const Description = styled.p`
  position: relative;
  z-index: 1;
  margin: 0;
  max-width: 420px;
  color: #4b5563;
  font-size: 1rem;
  line-height: 1.7;
  letter-spacing: -0.02em;
`

const StartButton = styled(Button)`
  position: relative;
  z-index: 1;
  min-width: 220px;
  background: #2563eb;
  box-shadow: 0 14px 30px rgba(37, 99, 235, 0.2);

  &:hover:not(:disabled) {
    background: #1d4ed8;
    box-shadow: 0 18px 34px rgba(37, 99, 235, 0.24);
  }

  &:focus-visible {
    outline: 3px solid rgba(191, 219, 254, 0.9);
    outline-offset: 3px;
  }
`

function IntroPage() {
  return (
    <IntroShell>
      <CenterCard>
        <ServiceName>OnFit 식단 관리</ServiceName>
        <Title>언제까지 닭가슴살만<br/>드실거에요?</Title>
        <Description>살 빼려면 어떤걸 얼마나 먹어야할지 알아보세요</Description>
        <StartButton type="button" onClick={() => navigateTo(ROUTES.input)}>
          식단관리 시작하기
        </StartButton>
      </CenterCard>
    </IntroShell>
  )
}

export default IntroPage
