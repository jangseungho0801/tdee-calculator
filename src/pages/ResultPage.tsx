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

const GoalGuideCard = styled.section`
  display: grid;
  gap: 10px;
  padding: 22px 24px;
  border-radius: 24px;
  border: 1px solid rgba(226, 232, 240, 0.92);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.06);
`

const GuideLine = styled.p`
  margin: 0;
  color: #334155;
  line-height: 1.6;
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
        <GoalGuideCard>
          <GuideLine>감량: 덜 먹는 게 아니라, 내 기준보다 맞게 줄여야 해요</GuideLine>
          <GuideLine>
            유지: 지금 몸 상태를 유지하고 싶다면 이 기준이 필요해요
          </GuideLine>
          <GuideLine>
            벌크: 무작정 많이 먹지 말고, 늘리는 기준부터 확인하세요
          </GuideLine>
        </GoalGuideCard>
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
