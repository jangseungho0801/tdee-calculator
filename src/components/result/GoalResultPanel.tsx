import styled from 'styled-components'
import { MACRO_PLANS } from '../../constants/macroPlans'
import type { GoalResult, GoalType } from '../../types/calculator'
import SectionCard from '../common/SectionCard.tsx'
import MacroSummary from './MacroSummary.tsx'

const Panel = styled(SectionCard)`
  display: grid;
  gap: 18px;
`

const Title = styled.h2`
  margin: 0;
  font-size: 1.4rem;
  color: #0f172a;
`

const Description = styled.p`
  margin: 0;
  color: #475569;
`

const CaloriesCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  border-radius: 22px;
  background: linear-gradient(135deg, #e0f2fe, #eff6ff);
`

const CaloriesLabel = styled.span`
  font-weight: 700;
  color: #0f172a;
`

const CaloriesValue = styled.strong`
  font-size: 2rem;
  letter-spacing: -0.05em;
  color: #0f172a;
`

type Props = {
  goalType: GoalType
  goalResult: GoalResult
}

function GoalResultPanel({ goalType, goalResult }: Props) {
  const plan = MACRO_PLANS[goalType]

  return (
    <Panel>
      <div>
        <Title>{plan.headline}</Title>
        <Description>{plan.description}</Description>
      </div>
      <CaloriesCard>
        <CaloriesLabel>하루 권장 칼로리</CaloriesLabel>
        <CaloriesValue>{goalResult.calories.toLocaleString('ko-KR')} kcal</CaloriesValue>
      </CaloriesCard>
      <MacroSummary macros={goalResult.macros} />
    </Panel>
  )
}

export default GoalResultPanel
