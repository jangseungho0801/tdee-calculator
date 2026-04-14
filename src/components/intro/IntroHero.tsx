import styled from 'styled-components'
import SectionCard from '../common/SectionCard.tsx'

const HeroCard = styled(SectionCard)`
  display: grid;
  gap: 20px;
  padding: 32px;
`

const Eyebrow = styled.span`
  font-size: 0.9rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #1d4ed8;
  text-transform: uppercase;
`

const Title = styled.h1`
  margin: 0;
  font-size: clamp(2.4rem, 4vw, 4.5rem);
  line-height: 0.95;
  letter-spacing: -0.06em;
  color: #0f172a;
`

const Description = styled.p`
  margin: 0;
  max-width: 640px;
  color: #334155;
  font-size: 1.05rem;
`

type Props = {
  title: string
  description: string
}

function IntroHero({ title, description }: Props) {
  return (
    <HeroCard>
      <Eyebrow>Fuel Planning</Eyebrow>
      <Title>{title}</Title>
      <Description>{description}</Description>
    </HeroCard>
  )
}

export default IntroHero
