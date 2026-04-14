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
  padding: 18px;
  border-radius: 20px;
  background: #f8fafc;
  border: 1px solid rgba(148, 163, 184, 0.14);
`

const Label = styled.div`
  font-size: 0.94rem;
  font-weight: 700;
  color: #0f172a;
`

const Percent = styled.div`
  margin-top: 10px;
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: #0f172a;
`

const Grams = styled.div`
  margin-top: 4px;
  color: #475569;
`

type Props = {
  macros: MacroResult
}

function MacroSummary({ macros }: Props) {
  return (
    <Grid>
      <Item>
        <Label>탄수화물</Label>
        <Percent>{macros.carbsPercent}%</Percent>
        <Grams>{macros.carbsGrams.toLocaleString('ko-KR')}g</Grams>
      </Item>
      <Item>
        <Label>단백질</Label>
        <Percent>{macros.proteinPercent}%</Percent>
        <Grams>{macros.proteinGrams.toLocaleString('ko-KR')}g</Grams>
      </Item>
      <Item>
        <Label>지방</Label>
        <Percent>{macros.fatPercent}%</Percent>
        <Grams>{macros.fatGrams.toLocaleString('ko-KR')}g</Grams>
      </Item>
    </Grid>
  )
}

export default MacroSummary
