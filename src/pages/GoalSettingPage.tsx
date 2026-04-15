import type { ChangeEvent, FormEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { navigateTo } from '../app/router/AppRouter.tsx'
import Button from '../components/common/Button.tsx'
import NumberInputField from '../components/common/NumberInputField.tsx'
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
  width: min(100%, 720px);
  margin: 0 auto;
  display: grid;
  gap: 20px;
`

const Card = styled(SectionCard)`
  display: grid;
  gap: 20px;
`

const Header = styled.div`
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
  color: #111827;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.1;
  letter-spacing: -0.05em;
`

const Description = styled.p`
  margin: 0;
  color: #475569;
  line-height: 1.7;
`

const FieldGrid = styled.div`
  display: grid;
  gap: 18px;
`

const DurationRow = styled.div`
  display: grid;
  gap: 12px;

  @media (min-width: 640px) {
    grid-template-columns: minmax(0, 1fr) 160px;
    align-items: end;
  }
`

const SelectField = styled.label`
  display: grid;
  gap: 8px;
`

const Label = styled.span`
  font-weight: 700;
  color: #0f172a;
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

const FooterActions = styled.div`
  display: grid;
  gap: 12px;
`

const SecondaryButton = styled(Button)`
  border: 1px solid rgba(148, 163, 184, 0.5);
`

const SuccessCard = styled(SectionCard)`
  display: grid;
  gap: 8px;
  background: linear-gradient(180deg, #eff6ff 0%, #f8fbff 100%);
  border-color: rgba(191, 219, 254, 0.9);
`

const SuccessTitle = styled.strong`
  color: #111827;
  font-size: 1.05rem;
`

const SuccessText = styled.p`
  margin: 0;
  color: #475569;
`

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.36);
  backdrop-filter: blur(6px);
  z-index: 20;
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

const QUESTION_COPY: Record<GoalType, string> = {
  cut: '언제까지 몇 kg를 빼고 싶으세요?',
  maintain: '언제까지 지금 체중을 유지하고 싶으세요?',
  bulk: '언제까지 몇 kg를 늘리고 싶으세요?',
}

const DURATION_WARNING_COPY: Record<GoalType, string> = {
  cut: '우선 최대 3개월 동안 식단을 진행하고 다시 목표를 설정해보세요',
  maintain: '우선 최대 3개월 동안 유지 식단을 진행하고 다시 목표를 설정해보세요',
  bulk: '우선 최대 3개월 동안 식단을 진행하고 다시 목표를 설정해보세요',
}

const RATE_WARNING_COPY: Record<'cut' | 'bulk', string> = {
  cut: '너무 급격한 감량은 건강에 좋지 않아요. 한 번만 다시 생각해보세요',
  bulk: '너무 급격한 벌크업은 체크가 중요해서 한 번만 다시 생각해보세요',
}

const UNIT_LABELS: Record<GoalDurationUnit, string> = {
  day: '일',
  week: '주',
  month: '개월',
}

type GoalSettingErrors = {
  targetWeight?: string
  durationValue?: string
}

function sanitizeNumericInput(value: string) {
  return value.replace(/[^0-9.]/g, '')
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

function validateGoalSettingData(
  goalType: GoalType,
  goalSettingData: GoalSettingData,
  currentWeight: number,
) {
  const errors: GoalSettingErrors = {}

  if (goalType !== 'maintain') {
    if (!goalSettingData.targetWeight.trim()) {
      errors.targetWeight = '목표 체중을 입력해 주세요.'
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
    errors.durationValue = '목표 기간을 입력해 주세요.'
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

  const durationDays = convertDurationToDays(durationValue, goalSettingData.durationUnit)

  if (durationDays > 90) {
    warnings.push(DURATION_WARNING_COPY[goalType])
  }

  if (goalType === 'maintain') {
    return warnings
  }

  const targetWeight = Number(goalSettingData.targetWeight)

  if (!Number.isFinite(targetWeight) || targetWeight <= 0) {
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
  const [isSubmitted, setIsSubmitted] = useState(false)

  const currentWeight = useMemo(() => Number(inputData.weight), [inputData.weight])

  useEffect(() => {
    if (!resultData) {
      navigateTo(ROUTES.result)
    }
  }, [resultData])

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
        targetWeight: sanitizeNumericInput(value),
      }
    } else if (name === 'durationValue') {
      nextGoalSettingData = {
        ...goalSettingData,
        durationValue: sanitizeNumericInput(value),
      }
    } else if (name === 'durationUnit') {
      nextGoalSettingData = {
        ...goalSettingData,
        durationUnit: value as GoalDurationUnit,
      }
    }

    setGoalSettingData(nextGoalSettingData)
    setIsSubmitted(false)

    setErrors((current) => ({
      ...current,
      [name]: '',
    }))
  }

  const finalizeSubmit = () => {
    setIsModalOpen(false)
    setWarningMessages([])
    setIsSubmitted(true)
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

    finalizeSubmit()
  }

  return (
    <PageLayout>
      <PageShell>
        <Card as="form" onSubmit={handleSubmit}>
          <Header>
            <Eyebrow>목표 설정</Eyebrow>
            <Title>{QUESTION_COPY[selectedGoal]}</Title>
            <Description>
              무리한 목표는 한 번 더 확인하고, 현실적인 기간 안에서 방향을
              정해 보세요.
            </Description>
          </Header>
          <FieldGrid>
            {selectedGoal !== 'maintain' ? (
              <NumberInputField
                id="targetWeight"
                name="targetWeight"
                label="목표 체중"
                placeholder="예: 64"
                suffix="kg"
                value={goalSettingData.targetWeight}
                error={errors.targetWeight}
                onChange={handleFieldChange}
              />
            ) : null}
            <DurationRow>
              <NumberInputField
                id="durationValue"
                name="durationValue"
                label="목표 기간"
                placeholder="예: 8"
                value={goalSettingData.durationValue}
                error={errors.durationValue}
                onChange={handleFieldChange}
              />
              <SelectField htmlFor="durationUnit">
                <Label>단위</Label>
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
              </SelectField>
            </DurationRow>
          </FieldGrid>
          <FooterActions>
            <Button type="submit" $fullWidth>
              다음
            </Button>
            <SecondaryButton
              type="button"
              $variant="secondary"
              $fullWidth
              onClick={() => navigateTo(ROUTES.result)}
            >
              결과로 돌아가기
            </SecondaryButton>
          </FooterActions>
        </Card>

        {isSubmitted ? (
          <SuccessCard>
            <SuccessTitle>목표 설정을 저장했어요</SuccessTitle>
            <SuccessText>
              선택한 방향은 {selectedGoal === 'cut'
                ? '다이어트'
                : selectedGoal === 'maintain'
                  ? '유지'
                  : '벌크업'}
              이고, 기간은 {goalSettingData.durationValue}
              {UNIT_LABELS[goalSettingData.durationUnit]}입니다.
            </SuccessText>
          </SuccessCard>
        ) : null}
      </PageShell>

      {isModalOpen ? (
        <Overlay>
          <ModalCard>
            <ModalTitle>한 번 더 확인해보세요</ModalTitle>
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
              <Button type="button" $fullWidth onClick={finalizeSubmit}>
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
