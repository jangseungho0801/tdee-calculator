import type { ChangeEvent, FormEvent } from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import { ACTIVITY_LEVELS } from '../../constants/activityLevels'
import type {
  CalculationResult,
  InputData,
  ParsedInputData,
  ValidationErrors,
} from '../../types/calculator'
import { calculateBmrByInput } from '../../utils/calculations/bmr'
import { calculateGoalCalories } from '../../utils/calculations/goalCalories'
import { calculateMacros } from '../../utils/calculations/macros'
import { calculateTdee } from '../../utils/calculations/tdee'
import AdditionalInfoSection from './AdditionalInfoSection.tsx'
import BasicInfoSection from './BasicInfoSection.tsx'
import CalculateButton from './CalculateButton.tsx'

const Form = styled.form`
  width: min(100%, 720px);
  margin: 0 auto;
  display: grid;
  gap: 20px;
`

const Header = styled.div`
  display: grid;
  gap: 10px;
  margin-bottom: 6px;
`

const Title = styled.h1`
  margin: 0;
  color: #111827;
  font-size: clamp(2rem, 4vw, 3.1rem);
  line-height: 1.12;
  letter-spacing: -0.05em;
`

const Description = styled.p`
  margin: 0;
  max-width: 620px;
  color: #4b5563;
  font-size: 1rem;
  line-height: 1.7;
`

const ErrorBanner = styled.div`
  padding: 14px 16px;
  border-radius: 18px;
  background: #fef2f2;
  color: #b42318;
  border: 1px solid rgba(244, 63, 94, 0.22);
`

const FooterAction = styled.div`
  position: sticky;
  bottom: 20px;
  z-index: 2;
`

type Props = {
  inputData: InputData
  setInputData: (value: InputData) => void
  setResultData: (value: CalculationResult | null) => void
  onSuccess: () => void
}

function sanitizeNumericInput(value: string) {
  return value.replace(/[^0-9.]/g, '')
}

function validatePositiveField(value: string, label: string) {
  if (!value.trim()) {
    return `${label}를 입력해 주세요`
  }

  const numericValue = Number(value)

  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return `${label}는 0보다 큰 숫자여야 합니다`
  }

  return ''
}

function validateInputData(inputData: InputData): ValidationErrors {
  const errors: ValidationErrors = {}

  if (!inputData.gender) {
    errors.gender = '성별을 선택해 주세요'
  }

  errors.age = validatePositiveField(inputData.age, '나이')
  errors.height = validatePositiveField(inputData.height, '키')
  errors.weight = validatePositiveField(inputData.weight, '현재 체중')

  if (!inputData.activityLevel) {
    errors.activityLevel = '평소 활동량을 선택해 주세요'
  }

  if (inputData.bodyFatPercentage.trim()) {
    const bodyFatValue = Number(inputData.bodyFatPercentage)

    if (!Number.isFinite(bodyFatValue) || bodyFatValue <= 0) {
      errors.bodyFatPercentage = '체지방률은 0보다 큰 숫자여야 합니다'
    } else if (bodyFatValue >= 100) {
      errors.bodyFatPercentage = '체지방률은 100 미만이어야 합니다'
    }
  }

  return Object.fromEntries(
    Object.entries(errors).filter(([, message]) => Boolean(message)),
  ) as ValidationErrors
}

function parseInputData(inputData: InputData): ParsedInputData {
  const parsed: ParsedInputData = {
    gender: inputData.gender as ParsedInputData['gender'],
    age: Number(inputData.age),
    height: Number(inputData.height),
    weight: Number(inputData.weight),
    activityLevel: inputData.activityLevel as ParsedInputData['activityLevel'],
  }

  if (inputData.bodyFatPercentage.trim()) {
    parsed.bodyFatPercentage = Number(inputData.bodyFatPercentage)
  }

  return parsed
}

function buildCalculationResult(inputData: ParsedInputData): CalculationResult {
  const bmr = Math.round(calculateBmrByInput(inputData))
  const activityMultiplier =
    ACTIVITY_LEVELS.find((option) => option.id === inputData.activityLevel)
      ?.multiplier ?? 1
  const tdee = Math.round(calculateTdee(bmr, activityMultiplier))
  const goalCalories = calculateGoalCalories(tdee)

  return {
    bmr,
    tdee,
    goals: {
      cut: {
        calories: goalCalories.cut,
        macros: calculateMacros(goalCalories.cut, 'cut'),
      },
      maintain: {
        calories: goalCalories.maintain,
        macros: calculateMacros(goalCalories.maintain, 'maintain'),
      },
      bulk: {
        calories: goalCalories.bulk,
        macros: calculateMacros(goalCalories.bulk, 'bulk'),
      },
    },
  }
}

function InputForm({
  inputData,
  setInputData,
  setResultData,
  onSuccess,
}: Props) {
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [errorBanner, setErrorBanner] = useState('')

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = event.target
    const nextValue = type === 'number' ? sanitizeNumericInput(value) : value

    setInputData({
      ...inputData,
      [name]: nextValue,
    })

    setErrors((current) => ({
      ...current,
      [name]: '',
    }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validateInputData(inputData)

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setErrorBanner('입력값을 확인한 뒤 다시 진행해 주세요')
      return
    }

    const parsedInputData = parseInputData(inputData)
    const result = buildCalculationResult(parsedInputData)

    setErrors({})
    setErrorBanner('')
    setResultData(result)
    onSuccess()
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Header>
        <Title>닭가슴살부터 먹지 말고, 기준부터 확인하세요</Title>
        <Description>
          기본 정보와 활동량을 입력하면 내 몸에 맞는 섭취 기준을 계산할 수
          있어요
        </Description>
      </Header>
      {errorBanner ? <ErrorBanner>{errorBanner}</ErrorBanner> : null}
      <BasicInfoSection inputData={inputData} errors={errors} onChange={handleChange} />
      <AdditionalInfoSection
        inputData={inputData}
        errors={errors}
        onChange={handleChange}
      />
      <FooterAction>
        <CalculateButton />
      </FooterAction>
    </Form>
  )
}

export default InputForm
