import type { ChangeEvent, FormEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { navigateTo } from '../app/router/AppRouter.tsx'
import Button from '../components/common/Button.tsx'
import PageLayout from '../components/common/PageLayout.tsx'
import SectionCard from '../components/common/SectionCard.tsx'
import StepTitle from '../components/common/StepTitle.tsx'
import { ROUTES } from '../constants/routes'
import { useTdeeCalculator } from '../hooks/useTdeeCalculator'
import type {
  MacroResult,
  MealStructureByTab,
  MealStructureTabKey,
} from '../types/calculator'

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

const Card = styled(SectionCard)`
  display: grid;
  gap: 20px;
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

const MealList = styled.div`
  display: grid;
  gap: 12px;
`

const MealRow = styled.div`
  display: grid;
  gap: 10px;
  padding: 18px 20px;
  border-radius: 22px;
  border: 1px solid rgba(226, 232, 240, 0.9);
  background: rgba(248, 250, 252, 0.78);
`

const MealTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`

const MealName = styled.span`
  color: #111827;
  font-size: 1rem;
  font-weight: 800;
`

const MealTime = styled.span`
  color: #64748b;
  font-size: 0.94rem;
  font-variant-numeric: tabular-nums;
`

const MealBottom = styled.div`
  display: grid;
  gap: 10px;

  @media (min-width: 640px) {
    grid-template-columns: auto auto 1fr;
    align-items: center;
  }
`

const RatioField = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #475569;
  font-size: 0.94rem;
  font-weight: 700;
`

const RatioInput = styled.input`
  width: 78px;
  min-height: 40px;
  padding: 0 12px;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.36);
  background: #ffffff;
  color: #0f172a;
  outline: none;
  text-align: right;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
  }
`

const KcalText = styled.div`
  color: #111827;
  font-size: 1rem;
  font-weight: 800;
`

const MacroText = styled.div`
  color: #475569;
  font-size: 0.94rem;
  line-height: 1.6;
`

const FooterActions = styled.div`
  display: grid;
`

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 20;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.36);
  backdrop-filter: blur(6px);
`

const ModalCard = styled.section`
  width: min(100%, 440px);
  display: grid;
  gap: 18px;
  padding: 24px;
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 28px 70px rgba(15, 23, 42, 0.2);
`

const ModalTitle = styled.h2`
  margin: 0;
  color: #111827;
  font-size: 1.35rem;
`

const ModalBody = styled.p`
  margin: 0;
  color: #475569;
  line-height: 1.6;
`

type RatioState = Record<MealStructureTabKey, string[]>

const TAB_LABELS: Record<MealStructureTabKey, string> = {
  weekday: '평일',
  weekend: '주말',
}

function buildEvenRatios(count: number) {
  if (count <= 0) {
    return []
  }

  const base = Math.floor((1000 / count)) / 10
  const ratios = Array.from({ length: count }, () => base)
  const sumWithoutLast = ratios.slice(0, -1).reduce((sum, value) => sum + value, 0)
  ratios[count - 1] = Number((100 - sumWithoutLast).toFixed(1))

  return ratios.map((value) => value.toFixed(1))
}

function sanitizeRatioInput(value: string) {
  const sanitized = value.replace(/[^0-9.]/g, '')
  const [integerPart = '', ...decimalParts] = sanitized.split('.')

  if (decimalParts.length === 0) {
    return integerPart
  }

  return `${integerPart}.${decimalParts.join('').slice(0, 1)}`
}

function createInitialRatios(mealStructure: MealStructureByTab): RatioState {
  return {
    weekday: buildEvenRatios(mealStructure.weekday.length),
    weekend: buildEvenRatios(mealStructure.weekend.length),
  }
}

function syncRatiosWithMeals(
  currentRatios: string[],
  mealCount: number,
) {
  if (currentRatios.length === mealCount) {
    return currentRatios
  }

  return buildEvenRatios(mealCount)
}

function calculateMealMacros(totalMacros: MacroResult, ratio: number) {
  const multiplier = ratio / 100

  return {
    carbsGrams: Number((totalMacros.carbsGrams * multiplier).toFixed(1)),
    proteinGrams: Number((totalMacros.proteinGrams * multiplier).toFixed(1)),
    fatGrams: Number((totalMacros.fatGrams * multiplier).toFixed(1)),
  }
}

function MealMacroPage() {
  const { resultData, selectedGoal, mealStructure } = useTdeeCalculator()
  const [activeTab, setActiveTab] = useState<MealStructureTabKey>('weekday')
  const [ratiosByTab, setRatiosByTab] = useState<RatioState>(() =>
    createInitialRatios(mealStructure),
  )
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (!resultData) {
      navigateTo(ROUTES.goal)
    }
  }, [resultData])

  useEffect(() => {
    setRatiosByTab((current) => ({
      weekday: syncRatiosWithMeals(current.weekday, mealStructure.weekday.length),
      weekend: syncRatiosWithMeals(current.weekend, mealStructure.weekend.length),
    }))
  }, [mealStructure])

  const goalResult = resultData?.goals[selectedGoal]

  const activeMeals = mealStructure[activeTab]
  const activeRatios = ratiosByTab[activeTab]

  const mealRows = useMemo(() => {
    if (!goalResult) {
      return []
    }

    return activeMeals.map((meal, index) => {
      const ratio = Number(activeRatios[index] || 0)
      const calories = Number(((goalResult.calories * ratio) / 100).toFixed(1))
      const macros = calculateMealMacros(goalResult.macros, ratio)

      return {
        ...meal,
        ratio,
        calories,
        macros,
      }
    })
  }, [activeMeals, activeRatios, goalResult])

  if (!resultData || !goalResult) {
    return null
  }

  const handleRatioChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = sanitizeRatioInput(event.target.value)

    setRatiosByTab((current) => ({
      ...current,
      [activeTab]: current[activeTab].map((ratio, ratioIndex) =>
        ratioIndex === index ? nextValue : ratio,
      ),
    }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const weekdayTotal = ratiosByTab.weekday.reduce(
      (sum, value) => sum + Number(value || 0),
      0,
    )
    const weekendTotal = ratiosByTab.weekend.reduce(
      (sum, value) => sum + Number(value || 0),
      0,
    )

    if (Math.abs(weekdayTotal - 100) > 0.05) {
      setActiveTab('weekday')
      setIsModalOpen(true)
      return
    }

    if (Math.abs(weekendTotal - 100) > 0.05) {
      setActiveTab('weekend')
      setIsModalOpen(true)
      return
    }
  }

  return (
    <PageLayout>
      <PageShell>
        <Header>
          <StepTitle>Step4 끼니별 섭취 기준을 확인하고 조정해보세요</StepTitle>
          <Description>
            입력한 식사 구조를 기준으로 끼니별 섭취 기준을 나눠봤어요
          </Description>
        </Header>

        <Card as="form" onSubmit={handleSubmit}>
          <TabList role="tablist" aria-label="끼니별 섭취 기준 탭">
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

          <MealList>
            {mealRows.map((meal, index) => (
              <MealRow key={meal.id}>
                <MealTop>
                  <MealName>{meal.name}</MealName>
                  <MealTime>{meal.time}</MealTime>
                </MealTop>
                <MealBottom>
                  <RatioField htmlFor={`meal-ratio-${meal.id}`}>
                    비중
                    <RatioInput
                      id={`meal-ratio-${meal.id}`}
                      name={`meal-ratio-${meal.id}`}
                      type="text"
                      inputMode="decimal"
                      value={activeRatios[index] ?? ''}
                      onChange={(event) => handleRatioChange(index, event)}
                    />
                    %
                  </RatioField>
                  <KcalText>{meal.calories.toLocaleString('ko-KR')}kcal</KcalText>
                  <MacroText>
                    탄수화물 {meal.macros.carbsGrams.toLocaleString('ko-KR')}g / 단백질{' '}
                    {meal.macros.proteinGrams.toLocaleString('ko-KR')}g / 지방{' '}
                    {meal.macros.fatGrams.toLocaleString('ko-KR')}g
                  </MacroText>
                </MealBottom>
              </MealRow>
            ))}
          </MealList>

          <FooterActions>
            <Button type="submit" $fullWidth>
              다음
            </Button>
          </FooterActions>
        </Card>
      </PageShell>

      {isModalOpen ? (
        <Overlay>
          <ModalCard>
            <ModalTitle>한번 더 확인해보세요</ModalTitle>
            <ModalBody>끼니별 칼로리 비중 합계가 100%가 되어야 해요</ModalBody>
            <Button type="button" $fullWidth onClick={() => setIsModalOpen(false)}>
              수정하기
            </Button>
          </ModalCard>
        </Overlay>
      ) : null}
    </PageLayout>
  )
}

export default MealMacroPage
