import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { navigateTo } from '../app/router/AppRouter.tsx'
import Button from '../components/common/Button.tsx'
import PageLayout from '../components/common/PageLayout.tsx'
import SectionCard from '../components/common/SectionCard.tsx'
import StepTitle from '../components/common/StepTitle.tsx'
import { ROUTES } from '../constants/routes'
import { useTdeeCalculator } from '../hooks/useTdeeCalculator'
import type { MealStructureTabKey } from '../types/calculator'

const PageShell = styled.div`
  width: min(100%, 760px);
  margin: 0 auto;
  display: grid;
  gap: 20px;
`

const Header = styled.header`
  display: grid;
  gap: 10px;
`

const Description = styled.p`
  margin: 0;
  color: #475569;
  line-height: 1.6;
`

const ContentCard = styled(SectionCard)`
  display: grid;
  gap: 24px;
`

const TabList = styled.div`
  display: inline-grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  width: fit-content;
  min-width: 220px;
  padding: 6px;
  border-radius: 999px;
  background: rgba(241, 245, 249, 0.92);
`

const TabButton = styled.button<{ $active: boolean }>`
  min-height: 40px;
  padding: 0 18px;
  border: 0;
  border-radius: 999px;
  background: ${({ $active }) =>
    $active ? 'linear-gradient(135deg, #111827, #1d4ed8)' : 'transparent'};
  color: ${({ $active }) => ($active ? '#ffffff' : '#64748b')};
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 160ms ease,
    color 160ms ease,
    box-shadow 160ms ease;
  box-shadow: ${({ $active }) =>
    $active ? '0 10px 24px rgba(29, 78, 216, 0.18)' : 'none'};
`

const CardGrid = styled.div`
  display: grid;
  gap: 14px;
`

const MealCard = styled.article`
  display: grid;
  gap: 18px;
  padding: 24px;
  border-radius: 26px;
  border: 1px solid rgba(226, 232, 240, 0.92);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.96)),
    #ffffff;
  box-shadow:
    0 18px 40px rgba(15, 23, 42, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.65);
`

const MealName = styled.h2`
  margin: 0;
  color: #111827;
  font-size: 1.05rem;
  font-weight: 800;
  line-height: 1.4;
`

const KcalValue = styled.p`
  margin: 0;
  color: #0f172a;
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.04em;
`

const MacroGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
`

const MacroCell = styled.div`
  display: grid;
  gap: 6px;
  padding: 14px 12px;
  border-radius: 18px;
  background: rgba(248, 250, 252, 0.95);
  border: 1px solid rgba(226, 232, 240, 0.9);
  text-align: center;
`

const MacroLabel = styled.span`
  color: #64748b;
  font-size: 0.84rem;
  font-weight: 700;
`

const MacroValue = styled.span`
  color: #111827;
  font-size: 1rem;
  font-weight: 800;
`

const FooterActions = styled.div`
  display: grid;
  gap: 10px;
`

const TAB_LABELS: Record<MealStructureTabKey, string> = {
  weekday: '평일',
  weekend: '주말',
}

function calculateEvenMealSplit(total: number, count: number) {
  if (count <= 0) {
    return []
  }

  const baseValue = total / count
  const values = Array.from({ length: count }, () => Number(baseValue.toFixed(1)))
  const sumWithoutLast = values.slice(0, -1).reduce((sum, value) => sum + value, 0)
  values[count - 1] = Number((total - sumWithoutLast).toFixed(1))

  return values
}

function MealMacroPage() {
  const { resultData, selectedGoal, mealStructure } = useTdeeCalculator()
  const [activeTab, setActiveTab] = useState<MealStructureTabKey>('weekday')

  useEffect(() => {
    if (!resultData) {
      navigateTo(ROUTES.goal)
    }
  }, [resultData])

  const goalResult = resultData?.goals[selectedGoal]
  const activeMeals = mealStructure[activeTab]

  const mealCards = useMemo(() => {
    if (!goalResult || activeMeals.length === 0) {
      return []
    }

    const mealCalories = calculateEvenMealSplit(goalResult.calories, activeMeals.length)
    const carbs = calculateEvenMealSplit(goalResult.macros.carbsGrams, activeMeals.length)
    const protein = calculateEvenMealSplit(goalResult.macros.proteinGrams, activeMeals.length)
    const fat = calculateEvenMealSplit(goalResult.macros.fatGrams, activeMeals.length)

    return activeMeals.map((meal, index) => ({
      id: meal.id,
      name: meal.name,
      calories: mealCalories[index] ?? 0,
      carbsGrams: carbs[index] ?? 0,
      proteinGrams: protein[index] ?? 0,
      fatGrams: fat[index] ?? 0,
    }))
  }, [activeMeals, goalResult])

  if (!resultData || !goalResult) {
    return null
  }

  return (
    <PageLayout>
      <PageShell>
        <Header>
          <StepTitle>Step4 한번에 얼마나 먹어야 하는지 확인하세요</StepTitle>
          <Description>
            평일과 주말 식사 구조에 맞춰 한 끼 기준을 계산했어요
          </Description>
        </Header>

        <ContentCard>
          <TabList role="tablist" aria-label="한 끼 기준 탭">
            {(Object.keys(TAB_LABELS) as MealStructureTabKey[]).map((tab) => (
              <TabButton
                key={tab}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                $active={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              >
                {TAB_LABELS[tab]}
              </TabButton>
            ))}
          </TabList>

          <CardGrid>
            {mealCards.map((meal) => (
              <MealCard key={meal.id}>
                <MealName>{meal.name}</MealName>
                <KcalValue>{meal.calories.toLocaleString('ko-KR')} kcal</KcalValue>
                <MacroGrid>
                  <MacroCell>
                    <MacroLabel>탄수화물</MacroLabel>
                    <MacroValue>{meal.carbsGrams.toLocaleString('ko-KR')}g</MacroValue>
                  </MacroCell>
                  <MacroCell>
                    <MacroLabel>단백질</MacroLabel>
                    <MacroValue>{meal.proteinGrams.toLocaleString('ko-KR')}g</MacroValue>
                  </MacroCell>
                  <MacroCell>
                    <MacroLabel>지방</MacroLabel>
                    <MacroValue>{meal.fatGrams.toLocaleString('ko-KR')}g</MacroValue>
                  </MacroCell>
                </MacroGrid>
              </MealCard>
            ))}
          </CardGrid>

          <FooterActions>
            <Button type="button" $fullWidth>
              다음
            </Button>
            <Button
              type="button"
              $variant="secondary"
              $fullWidth
              onClick={() => navigateTo(ROUTES.goal)}
            >
              뒤로가기
            </Button>
          </FooterActions>
        </ContentCard>
      </PageShell>
    </PageLayout>
  )
}

export default MealMacroPage
