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

const Stack = styled.div`
  display: grid;
  gap: 18px;
`

const FooterNote = styled.p`
  margin: 0;
  color: #64748b;
  text-align: center;
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
      <Stack>
        <ResultHeader tdee={resultData.tdee} bmr={resultData.bmr} />
        <GoalTabs activeGoal={activeGoal} onChange={setActiveGoal} />
        <GoalResultPanel
          goalType={activeGoal}
          goalResult={resultData.goals[activeGoal]}
        />
        <RecalculateButton onClick={() => navigateTo(ROUTES.input)} />
        <FooterNote>
          이후 버전에서 가이드 페이지 CTA를 추가할 수 있도록 결과 영역을 분리해 두었습니다.
        </FooterNote>
      </Stack>
    </PageLayout>
  )
}

export default ResultPage
