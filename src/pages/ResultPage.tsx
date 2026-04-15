import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { navigateTo } from '../app/router/AppRouter.tsx'
import PageLayout from '../components/common/PageLayout.tsx'
import GoalResultPanel from '../components/result/GoalResultPanel.tsx'
import GoalTabs from '../components/result/GoalTabs.tsx'
import RecalculateButton from '../components/result/RecalculateButton.tsx'
import ResultHeader from '../components/result/ResultHeader.tsx'
import { ROUTES } from '../constants/routes'
import { useTdeeCalculator } from '../hooks/useTdeeCalculator'
import type { GoalType } from '../types/calculator'

const PageShell = styled.div`
  width: min(100%, 760px);
  margin: 0 auto;
  display: grid;
  gap: 18px;
`

function ResultPage() {
  const { resultData } = useTdeeCalculator()
  const [activeGoal, setActiveGoal] = useState<GoalType>('cut')

  useEffect(() => {
    if (!resultData) {
      navigateTo(ROUTES.input)
    }
  }, [resultData])

  if (!resultData) {
    return null
  }

  return (
    <PageLayout>
      <PageShell>
        <ResultHeader tdee={resultData.tdee} bmr={resultData.bmr} />
        <GoalTabs activeGoal={activeGoal} onChange={setActiveGoal} />
        <GoalResultPanel
          goalType={activeGoal}
          goalResult={resultData.goals[activeGoal]}
        />
        <RecalculateButton onClick={() => navigateTo(ROUTES.input)} />
      </PageShell>
    </PageLayout>
  )
}

export default ResultPage
