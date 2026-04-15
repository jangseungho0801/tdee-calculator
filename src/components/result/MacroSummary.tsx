import styled from 'styled-components'
import type { MacroResult } from '../../types/calculator'

const Grid = styled.div`
  display: grid;
  gap: 12px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`

const Item = styled.div`
  display: grid;
  gap: 6px;
  padding: 18px;
  border-radius: 20px;
  background: #f8fafc;
  border: 1px solid rgba(148, 163, 184, 0.14);
`

const Label = styled.div`
  color: #475569;
  font-size: 0.94rem;
  font-weight: 700;
`

const Grams = styled.div`
  color: #111827;
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.04em;
`

const Percent = styled.div`
  color: #64748b;
  font-size: 0.98rem;
`

type Props = {
  macros: MacroResult
}

function MacroSummary({ macros }: Props) {
  return (
    <Grid>
      <Item>
        <Label>탄수화물</Label>
        <Grams>{macros.carbsGrams.toLocaleString('ko-KR')}g</Grams>
        <Percent>{macros.carbsPercent}%</Percent>
      </Item>
      <Item>
        <Label>단백질</Label>
        <Grams>{macros.proteinGrams.toLocaleString('ko-KR')}g</Grams>
        <Percent>{macros.proteinPercent}%</Percent>
      </Item>
      <Item>
        <Label>지방</Label>
        <Grams>{macros.fatGrams.toLocaleString('ko-KR')}g</Grams>
        <Percent>{macros.fatPercent}%</Percent>
      </Item>
    </Grid>
  )
}

export default MacroSummary
