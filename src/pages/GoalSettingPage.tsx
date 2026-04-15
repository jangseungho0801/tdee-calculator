import type { ChangeEvent, FormEvent } from 'react'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { navigateTo } from '../app/router/AppRouter.tsx'
import Button from '../components/common/Button.tsx'
import PageLayout from '../components/common/PageLayout.tsx'
import SectionCard from '../components/common/SectionCard.tsx'
import { ROUTES } from '../constants/routes'
import { useTdeeCalculator } from '../hooks/useTdeeCalculator'
import type {
  GoalDurationUnit,
  GoalSettingData,
  GoalType,
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

const Header = styled.header`
  display: grid;
  gap: 10px;
`

const Eyebrow = styled.span`
  color: #1d4ed8;
  font-size: 0.92rem;
  font-weight: 700;
`

const Title = styled.h1`
  margin: 0;
  color: #0f172a;
  font-size: clamp(2rem, 4vw, 2.8rem);
  line-height: 1.15;
  letter-spacing: -0.04em;
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

const Field = styled.label`
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

const Input = styled.input`
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

const InputWrap = styled.span`
  position: relative;
  display: block;
`

const Suffix = styled.span`
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  color: #64748b;
  font-size: 0.92rem;
`

const DurationRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 116px;
  gap: 12px;
  align-items: end;
`

const Select = styled.select`
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

const ErrorText = styled.span`
  color: #b42318;
  font-size: 0.92rem;
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

function GoalSettingPage() {
  const {
    inputData,
    resultData,
    selectedGoal,
    goalSettingData,
    setGoalSettingData,
  } = useTdeeCalculator()
  const [errors, setErrors] = useState<GoalSettingErrors>({})
  const [warningMessages, setWarningMessages] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

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

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setErrors({})

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
        <Card as="form" onSubmit={handleSubmit}>
          <Header>
            <Eyebrow>목표 설정</Eyebrow>
            <Title>{QUESTION_COPY[selectedGoal]}</Title>
            {selectedGoal === 'maintain' ? (
              <CurrentWeightNote>현재 체중: {formattedCurrentWeight}kg</CurrentWeightNote>
            ) : null}
          </Header>

          <FieldGrid>
            {selectedGoal !== 'maintain' ? (
              <Field htmlFor="targetWeight">
                <LabelRow>
                  <Label>목표 체중</Label>
                  <InlineInfo>현재 체중: {formattedCurrentWeight}kg</InlineInfo>
                </LabelRow>
                <InputWrap>
                  <Input
                    id="targetWeight"
                    name="targetWeight"
                    type="number"
                    min="0"
                    inputMode="decimal"
                    placeholder="예: 64"
                    value={goalSettingData.targetWeight}
                    onChange={handleFieldChange}
                  />
                  <Suffix>kg</Suffix>
                </InputWrap>
                {errors.targetWeight ? (
                  <ErrorText>{errors.targetWeight}</ErrorText>
                ) : null}
              </Field>
            ) : null}

            <Field htmlFor="durationValue">
              <Label>목표 기간</Label>
              <DurationRow>
                <Input
                  id="durationValue"
                  name="durationValue"
                  type="number"
                  min="0"
                  inputMode="numeric"
                  placeholder="예: 8"
                  value={goalSettingData.durationValue}
                  onChange={handleFieldChange}
                />
                <Select
                  id="durationUnit"
                  name="durationUnit"
                  value={goalSettingData.durationUnit}
                  onChange={handleFieldChange}
                >
                  <option value="day">일</option>
                  <option value="week">주</option>
                  <option value="month">개월</option>
                </Select>
              </DurationRow>
              {errors.durationValue ? (
                <ErrorText>{errors.durationValue}</ErrorText>
              ) : null}
            </Field>
          </FieldGrid>

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
