import styled from 'styled-components'
import type { GoalResult, GoalType } from '../../types/calculator'
import SectionCard from '../common/SectionCard.tsx'
import MacroSummary from './MacroSummary.tsx'

const Panel = styled(SectionCard)`
  display: grid;
  gap: 18px;
`

const CaloriesCard = styled.div`
  display: grid;
  gap: 10px;
  padding: 22px;
  border-radius: 24px;
  background: linear-gradient(180deg, #eff6ff 0%, #f8fbff 100%);
  border: 1px solid rgba(191, 219, 254, 0.9);
`

const CaloriesLabel = styled.span`
  color: #1d4ed8;
  font-size: 0.95rem;
  font-weight: 700;
`

const CaloriesValue = styled.strong`
  color: #111827;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1;
  letter-spacing: -0.05em;
`

const CopyBlock = styled.div`
  display: grid;
  gap: 6px;
`

const Interpretation = styled.p`
  margin: 0;
  color: #111827;
  font-weight: 700;
`

const Note = styled.p`
  margin: 0;
  color: #64748b;
`

type Props = {
  goalType: GoalType
  goalResult: GoalResult
}

const GOAL_COPY: Record<
  GoalType,
  { interpretation: string; note: string }
> = {
  cut: {
    interpretation: '다이어트를 위한 하루 권장 칼로리에요',
    note: '처음부터 너무 많이 줄이면 오래 유지하기 어려워요',
  },
  maintain: {
    interpretation: '현재 체중을 유지하기 위한 하루 권장 칼로리에요',
    note: '활동량이 달라지면 이 기준도 달라질 수 있어요',
  },
  bulk: {
    interpretation: '벌크업을 위한 하루 권장 칼로리에요',
    note: '무작정 많이 먹기보다 천천히 늘리는 게 더 좋아요',
  },
}

function GoalResultPanel({ goalType, goalResult }: Props) {
  const copy = GOAL_COPY[goalType]

  return (
    <Panel>
      <CaloriesCard>
        <CaloriesLabel>권장 칼로리</CaloriesLabel>
        <CaloriesValue>{goalResult.calories.toLocaleString('ko-KR')} kcal</CaloriesValue>
      </CaloriesCard>
      <MacroSummary macros={goalResult.macros} />
      <CopyBlock>
        <Interpretation>{copy.interpretation}</Interpretation>
        <Note>{copy.note}</Note>
      </CopyBlock>
    </Panel>
  )
}

export default GoalResultPanel
