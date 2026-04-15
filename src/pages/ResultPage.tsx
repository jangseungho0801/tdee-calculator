import { useEffect } from 'react'
import styled from 'styled-components'
import { navigateTo } from '../app/router/AppRouter.tsx'
import Button from '../components/common/Button.tsx'
import PageLayout from '../components/common/PageLayout.tsx'
import GoalResultPanel from '../components/result/GoalResultPanel.tsx'
import GoalTabs from '../components/result/GoalTabs.tsx'
import RecalculateButton from '../components/result/RecalculateButton.tsx'
import ResultHeader from '../components/result/ResultHeader.tsx'
import { ROUTES } from '../constants/routes'
import { useTdeeCalculator } from '../hooks/useTdeeCalculator'

const PageShell = styled.div`
  width: min(100%, 760px);
  margin: 0 auto;
  display: grid;
  gap: 18px;
`

const ActionStack = styled.div`
  display: grid;
  gap: 12px;
`

function ResultPage() {
  const { resultData, selectedGoal, setSelectedGoal } = useTdeeCalculator()

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
        <GoalTabs activeGoal={selectedGoal} onChange={setSelectedGoal} />
        <GoalResultPanel
          goalType={selectedGoal}
          goalResult={resultData.goals[selectedGoal]}
        />
        <ActionStack>
          <Button
            type="button"
            $fullWidth
            onClick={() => navigateTo(ROUTES.goal)}
          >
            다음
          </Button>
          <RecalculateButton onClick={() => navigateTo(ROUTES.input)} />
        </ActionStack>
      </PageShell>
    </PageLayout>
  )
}

export default ResultPage
