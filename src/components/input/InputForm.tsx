import type { ChangeEvent, FormEvent } from 'react'
import { useRef, useState } from 'react'
import styled from 'styled-components'
import StepTitle from '../common/StepTitle.tsx'
import FixedBottomActions from '../common/FixedBottomActions.tsx'
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

const Description = styled.p`
  margin: 0;
  max-width: 620px;
  color: #4b5563;
  font-size: 1rem;
  line-height: 1.7;
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
    return `${label}를 입력해 주세요.`
  }

  const numericValue = Number(value)

  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return `${label}은 0보다 큰 숫자여야 합니다.`
  }

  return ''
}

function validateInputData(inputData: InputData): ValidationErrors {
  const errors: ValidationErrors = {}

  if (!inputData.gender) {
    errors.gender = '성별을 선택해 주세요.'
  }

  errors.age = validatePositiveField(inputData.age, '나이')
  errors.height = validatePositiveField(inputData.height, '키')
  errors.weight = validatePositiveField(inputData.weight, '현재 체중')

  if (!inputData.activityLevel) {
    errors.activityLevel = '평소 활동량을 선택해 주세요.'
  }

  if (inputData.bodyFatPercentage.trim()) {
    const bodyFatValue = Number(inputData.bodyFatPercentage)

    if (!Number.isFinite(bodyFatValue) || bodyFatValue <= 0) {
      errors.bodyFatPercentage = '체지방률은 0보다 큰 숫자여야 합니다.'
    } else if (bodyFatValue >= 100) {
      errors.bodyFatPercentage = '체지방률은 100 미만이어야 합니다.'
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

const FIELD_FOCUS_ORDER: Array<keyof ValidationErrors> = [
  'gender',
  'age',
  'height',
  'weight',
  'activityLevel',
  'bodyFatPercentage',
]

function focusFieldByName(form: HTMLFormElement, fieldName: keyof ValidationErrors) {
  const target =
    fieldName === 'gender' || fieldName === 'activityLevel'
      ? form.querySelector<HTMLInputElement>(`input[name="${fieldName}"]`)
      : form.querySelector<HTMLInputElement>(`#${fieldName}`)

  if (!target) {
    return
  }

  target.scrollIntoView({ block: 'center', behavior: 'smooth' })
  target.focus()
}

function InputForm({
  inputData,
  setInputData,
  setResultData,
  onSuccess,
}: Props) {
  const formId = 'tdee-input-form'
  const formRef = useRef<HTMLFormElement | null>(null)
  const [errors, setErrors] = useState<ValidationErrors>({})

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
      const firstErrorField = FIELD_FOCUS_ORDER.find(
        (fieldName) => nextErrors[fieldName],
      )

      if (formRef.current && firstErrorField) {
        focusFieldByName(formRef.current, firstErrorField)
      }

      return
    }

    const parsedInputData = parseInputData(inputData)
    const result = buildCalculationResult(parsedInputData)

    setErrors({})
    setResultData(result)
    onSuccess()
  }

  return (
    <>
      <Form id={formId} ref={formRef} onSubmit={handleSubmit}>
        <Header>
          <StepTitle>Step1 내 몸에 맞는 기본 정보를 입력하세요</StepTitle>
          <Description>
            기본 정보와 활동량을 입력하면 내 몸에 맞는 하루 기준을 계산해드려요.
          </Description>
        </Header>
        <BasicInfoSection
          inputData={inputData}
          errors={errors}
          onChange={handleChange}
        />
        <AdditionalInfoSection
          inputData={inputData}
          errors={errors}
          onChange={handleChange}
        />
      </Form>

      <FixedBottomActions maxWidth="720px">
        <CalculateButton form={formId} />
      </FixedBottomActions>
    </>
  )
}

export default InputForm
