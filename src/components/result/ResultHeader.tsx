import styled from 'styled-components'
import SectionCard from '../common/SectionCard.tsx'

const SummaryGrid = styled.section`
  display: grid;
  gap: 14px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`

const SummaryCard = styled(SectionCard)`
  display: grid;
  gap: 10px;
  padding: 24px;
`

const Label = styled.span`
  color: #64748b;
  font-size: 0.95rem;
  font-weight: 700;
`

const Value = styled.strong`
  color: #111827;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1;
  letter-spacing: -0.05em;
`

type Props = {
  tdee: number
  bmr: number
}

function ResultHeader({ tdee, bmr }: Props) {
  return (
    <SummaryGrid>
      <SummaryCard>
        <Label>기초대사량</Label>
        <Value>{bmr.toLocaleString('ko-KR')} kcal</Value>
      </SummaryCard>
      <SummaryCard>
        <Label>유지 칼로리</Label>
        <Value>{tdee.toLocaleString('ko-KR')} kcal</Value>
      </SummaryCard>
    </SummaryGrid>
  )
}

export default ResultHeader
