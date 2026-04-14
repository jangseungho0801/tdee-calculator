import styled from 'styled-components'
import SectionCard from '../common/SectionCard.tsx'

const Grid = styled.div`
  display: grid;
  gap: 16px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`

const ItemCard = styled(SectionCard)`
  display: grid;
  gap: 10px;
  min-height: 180px;
`

const Index = styled.span`
  font-size: 0.9rem;
  font-weight: 800;
  color: #1d4ed8;
`

const Title = styled.h2`
  margin: 0;
  font-size: 1.15rem;
  color: #0f172a;
`

const Description = styled.p`
  margin: 0;
  color: #475569;
`

type Highlight = {
  title: string
  description: string
}

type Props = {
  items: Highlight[]
}

function IntroHighlights({ items }: Props) {
  return (
    <Grid>
      {items.map((item, index) => (
        <ItemCard key={item.title}>
          <Index>0{index + 1}</Index>
          <Title>{item.title}</Title>
          <Description>{item.description}</Description>
        </ItemCard>
      ))}
    </Grid>
  )
}

export default IntroHighlights
