import type { ChangeEvent, DragEvent, FormEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { navigateTo } from '../app/router/AppRouter.tsx'
import Button from '../components/common/Button.tsx'
import NumberInputField from '../components/common/NumberInputField.tsx'
import PageLayout from '../components/common/PageLayout.tsx'
import SectionCard from '../components/common/SectionCard.tsx'
import StepTitle from '../components/common/StepTitle.tsx'
import { ROUTES } from '../constants/routes'
import { useTdeeCalculator } from '../hooks/useTdeeCalculator'
import type {
  GoalDurationUnit,
  GoalSettingData,
  GoalType,
  MealStructureItem,
} from '../types/calculator'

const PageShell = styled.div`
  width: min(100%, 680px);
  margin: 0 auto;
  display: grid;
  gap: 20px;
`

const Card = styled(SectionCard)`
  display: grid;
  gap: 24px;
`

const Divider = styled.div`
  height: 1px;
  background: rgba(226, 232, 240, 0.95);
`

const SummaryCard = styled.section`
  padding: 16px 20px;
  border-radius: 20px;
  border: 1px solid rgba(191, 219, 254, 0.9);
  background: rgba(248, 250, 252, 0.92);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
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

const Question = styled.p`
  margin: 0;
  color: #111827;
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1.5;
`

const CurrentWeightNote = styled.p`
  margin: 0;
  color: #475569;
  font-size: 0.95rem;
`

const FieldGrid = styled.div`
  display: grid;
  gap: 18px;
`

const Field = styled.div`
  display: grid;
  gap: 8px;
`

const LabelRow = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`

const Label = styled.span`
  font-weight: 700;
  color: #0f172a;
`

const InlineInfo = styled.span`
  color: #64748b;
  font-size: 0.92rem;
`

const SummaryText = styled.p`
  margin: 0;
  color: #334155;
  font-size: 0.96rem;
  font-weight: 600;
  line-height: 1.5;
`

const DurationRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 120px;
  gap: 12px;
  align-items: start;
`

const MealSection = styled.section`
  display: grid;
  gap: 16px;
  padding-top: 8px;
`

const SectionTitle = styled.h2`
  margin: 0;
  color: #111827;
  font-size: 1.08rem;
  line-height: 1.4;
  letter-spacing: -0.02em;
`

const MealList = styled.div`
  display: grid;
  gap: 12px;
`

const MealRow = styled.div`
  display: grid;
  grid-template-columns: 40px minmax(0, 7fr) minmax(112px, 3fr) 40px;
  gap: 10px;
  align-items: start;
`

const DragHandle = styled.button`
  min-width: 40px;
  min-height: 52px;
  border: 0;
  border-radius: 14px;
  background: rgba(248, 250, 252, 0.92);
  color: #64748b;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`

const DotGrid = styled.span`
  display: grid;
  grid-template-columns: repeat(2, 4px);
  gap: 4px;

  span {
    width: 4px;
    height: 4px;
    border-radius: 999px;
    background: currentColor;
  }
`

const MealTextInput = styled.input`
  width: 100%;
  min-height: 52px;
  padding: 0 16px;
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.36);
  background: rgba(248, 250, 252, 0.88);
  color: #0f172a;
  outline: none;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
  }
`

const MealTimeInput = styled(MealTextInput)`
  text-align: center;
  font-variant-numeric: tabular-nums;
`

const RemoveMealButton = styled.button`
  min-width: 40px;
  min-height: 52px;
  border: 0;
  border-radius: 14px;
  background: transparent;
  color: #94a3b8;
  cursor: pointer;

  &:hover {
    background: rgba(241, 245, 249, 0.92);
    color: #475569;
  }
`

const FieldErrorText = styled.span`
  display: block;
  margin-top: 6px;
  color: #b42318;
  font-size: 0.88rem;
`

const InlineButtonRow = styled.div`
  display: flex;
  justify-content: flex-start;
`

const AddMealButton = styled(Button)`
  min-height: 44px;
  padding: 0 18px;
`

const UnitSelect = styled.select`
  width: 100%;
  min-height: 52px;
  padding: 0 16px;
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.36);
  background: rgba(248, 250, 252, 0.88);
  color: #0f172a;
  outline: none;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
  }
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
  width: min(100%, 520px);
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

const WarningList = styled.ul`
  margin: 0;
  padding-left: 20px;
  color: #475569;
  display: grid;
  gap: 8px;
`

const ModalActions = styled.div`
  display: grid;
  gap: 12px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`

const SecondaryButton = styled(Button)`
  border: 1px solid rgba(148, 163, 184, 0.5);
`

const QUESTION_COPY: Record<GoalType, string> = {
  cut: '언제까지 몇kg을 빼고 싶으세요?',
  maintain: '언제까지 지금 체중을 유지하고 싶으세요?',
  bulk: '언제까지 몇kg을 늘리고 싶으세요?',
}

const GOAL_LABELS: Record<GoalType, string> = {
  cut: '다이어트',
  maintain: '유지',
  bulk: '벌크업',
}

const DURATION_WARNING_COPY: Record<GoalType, string> = {
  cut: '우선 최대 3개월 동안 식단을 진행하고 다시 목표를 설정하세요',
  maintain: '우선 최대 3개월 동안 유지 식단을 진행하고 다시 목표를 설정하세요',
  bulk: '우선 최대 3개월 동안 식단을 진행하고 다시 목표를 설정하세요',
}

const RATE_WARNING_COPY: Record<'cut' | 'bulk', string> = {
  cut: '너무 급격한 감량은 건강에 좋지 않아요, 한번만 다시 생각해보세요',
  bulk: '너무 급격한 벌크업은 살크업 가능성이 높아요, 한번만 다시 생각해보세요',
}

type GoalSettingErrors = {
  targetWeight?: string
  durationValue?: string
}

type MealItemErrors = {
  name?: string
  time?: string
}

const TIME_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d$/

function sanitizeWeightInput(value: string) {
  const sanitized = value.replace(/[^0-9.]/g, '')
  const [integerPart = '', ...decimalParts] = sanitized.split('.')

  if (decimalParts.length === 0) {
    return integerPart
  }

  return `${integerPart}.${decimalParts.join('')}`
}

function sanitizeDurationInput(value: string) {
  return value.replace(/[^0-9]/g, '')
}

function sanitizeMealTimeInput(value: string) {
  const sanitized = value.replace(/[^0-9:]/g, '').slice(0, 5)

  if (sanitized.length <= 2) {
    return sanitized
  }

  const [hours, minutes = ''] = sanitized.replace(':', '').match(/.{1,2}/g) ?? []

  if (!hours) {
    return ''
  }

  return [hours, minutes].filter(Boolean).join(':').slice(0, 5)
}

function validateMealStructure(mealStructure: MealStructureItem[]) {
  return mealStructure.map((meal) => {
    const errors: MealItemErrors = {}

    if (!meal.name.trim()) {
      errors.name = '식사 이름을 입력해주세요.'
    }

    if (!meal.time.trim()) {
      errors.time = '식사 시간을 입력해주세요.'
    } else if (!TIME_PATTERN.test(meal.time)) {
      errors.time = '식사 시간은 HH:MM 형식으로 입력해주세요.'
    }

    return errors
  })
}

function hasMealErrors(mealErrors: MealItemErrors[]) {
  return mealErrors.some((error) => error.name || error.time)
}

function createMealItem(id: number): MealStructureItem {
  return {
    id: `meal-${id}`,
    name: `식사 ${id}`,
    time: '',
  }
}

function convertDurationToDays(value: number, unit: GoalDurationUnit) {
  if (unit === 'day') {
    return value
  }

  if (unit === 'week') {
    return value * 7
  }

  return value * 30
}

function formatWeight(weight: number) {
  if (!Number.isFinite(weight)) {
    return '-'
  }

  return Number.isInteger(weight) ? weight.toString() : weight.toFixed(1)
}

function validateGoalSettingData(
  goalType: GoalType,
  goalSettingData: GoalSettingData,
  currentWeight: number,
) {
  const errors: GoalSettingErrors = {}

  if (goalType !== 'maintain') {
    if (!goalSettingData.targetWeight.trim()) {
      errors.targetWeight = '목표 체중을 입력해주세요.'
    } else {
      const targetWeight = Number(goalSettingData.targetWeight)

      if (!Number.isFinite(targetWeight) || targetWeight <= 0) {
        errors.targetWeight = '목표 체중은 0보다 큰 숫자여야 합니다.'
      } else if (goalType === 'cut' && targetWeight >= currentWeight) {
        errors.targetWeight = '다이어트 목표 체중은 현재 체중보다 낮아야 합니다.'
      } else if (goalType === 'bulk' && targetWeight <= currentWeight) {
        errors.targetWeight = '벌크업 목표 체중은 현재 체중보다 높아야 합니다.'
      }
    }
  }

  if (!goalSettingData.durationValue.trim()) {
    errors.durationValue = '목표 기간을 입력해주세요.'
  } else {
    const durationValue = Number(goalSettingData.durationValue)

    if (!Number.isFinite(durationValue) || durationValue <= 0) {
      errors.durationValue = '목표 기간은 0보다 큰 숫자여야 합니다.'
    }
  }

  return errors
}

function collectWarnings(
  goalType: GoalType,
  goalSettingData: GoalSettingData,
  currentWeight: number,
) {
  const warnings: string[] = []
  const durationValue = Number(goalSettingData.durationValue)

  if (!Number.isFinite(durationValue) || durationValue <= 0) {
    return warnings
  }

  const durationDays = convertDurationToDays(
    durationValue,
    goalSettingData.durationUnit,
  )

  if (durationDays > 90) {
    warnings.push(DURATION_WARNING_COPY[goalType])
  }

  if (goalType === 'maintain') {
    return warnings
  }

  const targetWeight = Number(goalSettingData.targetWeight)

  if (!Number.isFinite(targetWeight) || targetWeight <= 0 || durationDays <= 0) {
    return warnings
  }

  const weeklyChangeGrams =
    (Math.abs(targetWeight - currentWeight) * 1000) / (durationDays / 7)

  if (weeklyChangeGrams > 500) {
    warnings.push(RATE_WARNING_COPY[goalType])
  }

  return warnings
}

const FIELD_FOCUS_ORDER: Array<keyof GoalSettingErrors> = [
  'targetWeight',
  'durationValue',
]

function focusGoalField(
  form: HTMLFormElement,
  fieldName: keyof GoalSettingErrors,
) {
  const target = form.querySelector<HTMLElement>(`#${fieldName}`)

  if (!target) {
    return
  }

  target.scrollIntoView({ block: 'center', behavior: 'smooth' })
  target.focus()
}

function GoalSettingPage() {
  const {
    inputData,
    resultData,
    selectedGoal,
    goalSettingData,
    mealStructure,
    setGoalSettingData,
    setMealStructure,
  } = useTdeeCalculator()
  const formRef = useRef<HTMLFormElement | null>(null)
  const [errors, setErrors] = useState<GoalSettingErrors>({})
  const [mealErrors, setMealErrors] = useState<MealItemErrors[]>([])
  const [warningMessages, setWarningMessages] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [draggingMealId, setDraggingMealId] = useState<string | null>(null)

  const currentWeight = Number(inputData.weight)
  const formattedCurrentWeight = formatWeight(currentWeight)

  useEffect(() => {
    if (!resultData) {
      navigateTo(ROUTES.result)
    }
  }, [resultData])

  useEffect(() => {
    if (selectedGoal === 'maintain' && goalSettingData.targetWeight) {
      setGoalSettingData({
        ...goalSettingData,
        targetWeight: '',
      })
    }
  }, [goalSettingData, selectedGoal, setGoalSettingData])

  if (!resultData) {
    return null
  }

  const handleFieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target
    let nextGoalSettingData = goalSettingData

    if (name === 'targetWeight') {
      nextGoalSettingData = {
        ...goalSettingData,
        targetWeight: sanitizeWeightInput(value),
      }
    } else if (name === 'durationValue') {
      nextGoalSettingData = {
        ...goalSettingData,
        durationValue: sanitizeDurationInput(value),
      }
    } else if (name === 'durationUnit') {
      nextGoalSettingData = {
        ...goalSettingData,
        durationUnit: value as GoalDurationUnit,
      }
    }

    setGoalSettingData(nextGoalSettingData)
    setErrors((current) => ({
      ...current,
      [name]: '',
    }))
  }

  const handleMealNameChange = (
    mealId: string,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setMealStructure(
      mealStructure.map((meal) =>
        meal.id === mealId ? { ...meal, name: event.target.value } : meal,
      ),
    )
    setMealErrors((current) =>
      current.map((error, index) =>
        mealStructure[index]?.id === mealId ? { ...error, name: undefined } : error,
      ),
    )
  }

  const handleMealTimeChange = (
    mealId: string,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const nextValue = sanitizeMealTimeInput(event.target.value)

    setMealStructure(
      mealStructure.map((meal) =>
        meal.id === mealId ? { ...meal, time: nextValue } : meal,
      ),
    )
    setMealErrors((current) =>
      current.map((error, index) =>
        mealStructure[index]?.id === mealId ? { ...error, time: undefined } : error,
      ),
    )
  }

  const handleAddMeal = () => {
    if (mealStructure.length >= 10) {
      return
    }

    setMealStructure([...mealStructure, createMealItem(mealStructure.length + 1)])
    setMealErrors([])
  }

  const handleRemoveMeal = (mealId: string) => {
    if (mealStructure.length <= 1) {
      return
    }

    setMealStructure(mealStructure.filter((meal) => meal.id !== mealId))
    setMealErrors([])
  }

  const handleDragStart = (mealId: string) => {
    setDraggingMealId(mealId)
  }

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleDropMeal = (targetMealId: string) => {
    if (!draggingMealId || draggingMealId === targetMealId) {
      setDraggingMealId(null)
      return
    }

    const sourceIndex = mealStructure.findIndex((meal) => meal.id === draggingMealId)
    const targetIndex = mealStructure.findIndex((meal) => meal.id === targetMealId)

    if (sourceIndex === -1 || targetIndex === -1) {
      setDraggingMealId(null)
      return
    }

    const nextMeals = [...mealStructure]
    const [movedMeal] = nextMeals.splice(sourceIndex, 1)
    nextMeals.splice(targetIndex, 0, movedMeal)
    setMealStructure(nextMeals)
    setMealErrors([])
    setDraggingMealId(null)
  }

  const proceedToNextStep = () => {
    setIsModalOpen(false)
    setWarningMessages([])
    navigateTo(ROUTES.result)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validateGoalSettingData(
      selectedGoal,
      goalSettingData,
      currentWeight,
    )
    const nextMealErrors = validateMealStructure(mealStructure)

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      const firstErrorField = FIELD_FOCUS_ORDER.find(
        (fieldName) => nextErrors[fieldName],
      )

      if (formRef.current && firstErrorField) {
        focusGoalField(formRef.current, firstErrorField)
      }

      return
    }

    if (hasMealErrors(nextMealErrors)) {
      setMealErrors(nextMealErrors)
      return
    }

    setErrors({})
    setMealErrors([])

    const nextWarnings = collectWarnings(
      selectedGoal,
      goalSettingData,
      currentWeight,
    )

    if (nextWarnings.length > 0) {
      setWarningMessages(nextWarnings)
      setIsModalOpen(true)
      return
    }

    proceedToNextStep()
  }

  return (
    <PageLayout>
      <PageShell>
        <Header>
          <StepTitle>Step3 언제까지, 얼마나 바뀌고 싶은지 정해보세요</StepTitle>
          <Description>
            현재 체중을 기준으로 목표 체중과 기간을 설정해보세요
          </Description>
        </Header>

        <SummaryCard aria-label="현재 상태 요약">
          <SummaryText>
            현재 목표 : {GOAL_LABELS[selectedGoal]} | 현재 체중 : {formattedCurrentWeight}kg
          </SummaryText>
        </SummaryCard>

        <Card as="form" ref={formRef} onSubmit={handleSubmit}>
          <Header>
            <Question>{QUESTION_COPY[selectedGoal]}</Question>
            {selectedGoal === 'maintain' ? (
              <CurrentWeightNote>현재 체중: {formattedCurrentWeight}kg</CurrentWeightNote>
            ) : null}
          </Header>

          <FieldGrid>
            {selectedGoal !== 'maintain' ? (
              <Field>
                <LabelRow>
                  <Label>목표 체중</Label>
                  <InlineInfo>현재 체중: {formattedCurrentWeight}kg</InlineInfo>
                </LabelRow>
                <NumberInputField
                  id="targetWeight"
                  name="targetWeight"
                  label={undefined}
                  placeholder="예: 64"
                  suffix="kg"
                  value={goalSettingData.targetWeight}
                  error={errors.targetWeight}
                  onChange={handleFieldChange}
                />
              </Field>
            ) : null}

            <Field>
              <Label>목표 기간</Label>
              <DurationRow>
                <NumberInputField
                  id="durationValue"
                  name="durationValue"
                  label={undefined}
                  placeholder="예: 8"
                  suffix=""
                  value={goalSettingData.durationValue}
                  error={errors.durationValue}
                  onChange={handleFieldChange}
                />
                <UnitSelect
                  id="durationUnit"
                  name="durationUnit"
                  aria-label="목표 기간 단위"
                  value={goalSettingData.durationUnit}
                  onChange={handleFieldChange}
                >
                  <option value="day">일</option>
                  <option value="week">주</option>
                  <option value="month">개월</option>
                </UnitSelect>
              </DurationRow>
            </Field>
          </FieldGrid>

          <Divider />

          <MealSection>
            <SectionTitle>하루에 얼마나 드실 수 있으세요?</SectionTitle>
            <MealList>
              {mealStructure.map((meal, index) => (
                <div key={meal.id}>
                  <MealRow
                    onDragOver={handleDragOver}
                    onDrop={() => handleDropMeal(meal.id)}
                  >
                    <DragHandle
                      type="button"
                      draggable
                      aria-label={`${meal.name || `식사 ${index + 1}`} 순서 변경`}
                      onDragStart={() => handleDragStart(meal.id)}
                      onDragEnd={() => setDraggingMealId(null)}
                    >
                      <DotGrid aria-hidden="true">
                        <span />
                        <span />
                        <span />
                        <span />
                        <span />
                        <span />
                      </DotGrid>
                    </DragHandle>
                    <div>
                      <MealTextInput
                        id={`meal-name-${meal.id}`}
                        name={`meal-name-${meal.id}`}
                        type="text"
                        placeholder="식사 이름"
                        value={meal.name}
                        onChange={(event) => handleMealNameChange(meal.id, event)}
                      />
                      {mealErrors[index]?.name ? (
                        <FieldErrorText>{mealErrors[index]?.name}</FieldErrorText>
                      ) : null}
                    </div>
                    <div>
                      <MealTimeInput
                        id={`meal-time-${meal.id}`}
                        name={`meal-time-${meal.id}`}
                        type="text"
                        inputMode="numeric"
                        placeholder="08:00"
                        value={meal.time}
                        onChange={(event) => handleMealTimeChange(meal.id, event)}
                      />
                      {mealErrors[index]?.time ? (
                        <FieldErrorText>{mealErrors[index]?.time}</FieldErrorText>
                      ) : null}
                    </div>
                    <RemoveMealButton
                      type="button"
                      aria-label={`${meal.name || `식사 ${index + 1}`} 삭제`}
                      title={`${meal.name || `식사 ${index + 1}`} 삭제`}
                      disabled={mealStructure.length <= 1}
                      onClick={() => handleRemoveMeal(meal.id)}
                    >
                      <svg
                        aria-hidden="true"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4 7H20M9 7V5.8C9 5.05 9.05 4.68 9.2 4.4C9.33 4.17 9.52 3.98 9.75 3.85C10.03 3.7 10.4 3.65 11.15 3.65H12.85C13.6 3.65 13.97 3.7 14.25 3.85C14.48 3.98 14.67 4.17 14.8 4.4C14.95 4.68 15 5.05 15 5.8V7M18.2 7V17.2C18.2 18.32 18.2 18.88 17.98 19.31C17.79 19.68 17.48 19.99 17.11 20.18C16.68 20.4 16.12 20.4 15 20.4H9C7.88 20.4 7.32 20.4 6.89 20.18C6.52 19.99 6.21 19.68 6.02 19.31C5.8 18.88 5.8 18.32 5.8 17.2V7M10 10.5V16.5M14 10.5V16.5"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </RemoveMealButton>
                  </MealRow>
                </div>
              ))}
            </MealList>
            <InlineButtonRow>
              <AddMealButton
                type="button"
                $variant="secondary"
                disabled={mealStructure.length >= 10}
                onClick={handleAddMeal}
              >
                식사 추가하기
              </AddMealButton>
            </InlineButtonRow>
          </MealSection>

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
            <WarningList>
              {warningMessages.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </WarningList>
            <ModalActions>
              <SecondaryButton
                type="button"
                $variant="secondary"
                $fullWidth
                onClick={() => setIsModalOpen(false)}
              >
                수정하기
              </SecondaryButton>
              <Button type="button" $fullWidth onClick={proceedToNextStep}>
                그대로 진행하기
              </Button>
            </ModalActions>
          </ModalCard>
        </Overlay>
      ) : null}
    </PageLayout>
  )
}

export default GoalSettingPage
