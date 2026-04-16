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

const Header = styled.header`
  display: grid;
  gap: 8px;
`

const Title = styled.h1`
  margin: 0;
  color: #111827;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.15;
  letter-spacing: -0.05em;
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
        <Header>
          <Title>Step2 하루 권장 칼로리를 확인하고, 하루 식단을 구성하세요</Title>
        </Header>
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
            하루 식단 구성하기
          </Button>
          <RecalculateButton onClick={() => navigateTo(ROUTES.input)} />
        </ActionStack>
      </PageShell>
    </PageLayout>
  )
}

export default ResultPage
