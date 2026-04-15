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

type Props = {
  goalType: GoalType
  goalResult: GoalResult
}

function GoalResultPanel({ goalType: _goalType, goalResult }: Props) {
  return (
    <Panel>
      <CaloriesCard>
        <CaloriesLabel>권장 칼로리</CaloriesLabel>
        <CaloriesValue>{goalResult.calories.toLocaleString('ko-KR')} kcal</CaloriesValue>
      </CaloriesCard>
      <MacroSummary macros={goalResult.macros} />
    </Panel>
  )
}

export default GoalResultPanel
