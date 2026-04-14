import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const activityOptions = [
  { value: '1', description: '거의 움직이지 않음(1.2)', factor: 1.2 },
  {
    value: '2',
    description: '가벼운 운동 (주 1~3회)(1.375)',
    factor: 1.375,
  },
  {
    value: '3',
    description: '보통 운동 (주 3~5회)(1.55)',
    factor: 1.55,
  },
  { value: '4', description: '많은 운동 (주 6~7회)(1.725)', factor: 1.725 },
  {
    value: '5',
    description: '매우 많은 운동 또는 육체 노동(1.9)',
    factor: 1.9,
  },
]

const initialForm = {
  gender: '',
  age: '',
  height: '',
  weight: '',
  activityLevel: '3',
}

function App() {
  const [formValues, setFormValues] = useState(initialForm)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [result, setResult] = useState(null)
  const [animatedResult, setAnimatedResult] = useState(null)
  const resultRef = useRef(null)

  useEffect(() => {
    if (!hasSubmitted || !resultRef.current) {
      return
    }

    resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [hasSubmitted, result, errorMessage])

  useEffect(() => {
    if (!result) {
      return
    }

    const duration = 900
    let frameId = 0
    let startTime = 0

    const animate = (timestamp) => {
      if (!startTime) {
        startTime = timestamp
      }

      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = 1 - (1 - progress) ** 3

      setAnimatedResult({
        bmr: Math.round(result.bmr * easedProgress),
        tdee: Math.round(result.tdee * easedProgress),
        cutCalories: Math.round(result.cutCalories * easedProgress),
        maintenanceCalories: Math.round(result.maintenanceCalories * easedProgress),
        bulkCalories: Math.round(result.bulkCalories * easedProgress),
      })

      if (progress < 1) {
        frameId = window.requestAnimationFrame(animate)
      }
    }

    frameId = window.requestAnimationFrame(animate)

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [result])

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormValues((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setHasSubmitted(true)

    const validationError = validateForm(formValues)

    if (validationError) {
      setErrorMessage(validationError)
      setResult(null)
      setAnimatedResult(null)
      return
    }

    const nextResult = calculateTdee(formValues)

    setAnimatedResult({
      bmr: 0,
      tdee: 0,
      cutCalories: 0,
      maintenanceCalories: 0,
      bulkCalories: 0,
    })
    setErrorMessage('')
    setResult(nextResult)
  }

  return (
    <Page>
      <Container>
        <Header>
          <Title>TDEE 계산기</Title>
          <Description>
            입력값 검증과 BMR, TDEE 계산 결과를 함께 확인할 수 있는 2차
            버전입니다.
          </Description>
        </Header>

        <ContentGrid>
          <FormCard onSubmit={handleSubmit}>
            <SectionTitle>입력 정보</SectionTitle>

            <Fieldset>
              <Legend>*성별</Legend>
              <OptionRow>
                <InlineOption>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formValues.gender === 'male'}
                    onChange={handleChange}
                  />
                  <span>남성</span>
                </InlineOption>
                <InlineOption>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formValues.gender === 'female'}
                    onChange={handleChange}
                  />
                  <span>여성</span>
                </InlineOption>
              </OptionRow>
            </Fieldset>

            <FieldGroup>
              <Label htmlFor="age">*나이</Label>
              <Input
                id="age"
                name="age"
                type="number"
                min="0"
                placeholder="예: 29"
                value={formValues.age}
                onChange={handleChange}
              />
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="height">*키(cm)</Label>
              <Input
                id="height"
                name="height"
                type="number"
                min="0"
                placeholder="예: 175"
                value={formValues.height}
                onChange={handleChange}
              />
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="weight">*몸무게(kg)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                min="0"
                placeholder="예: 68"
                value={formValues.weight}
                onChange={handleChange}
              />
            </FieldGroup>

            <Fieldset>
              <Legend>활동량</Legend>
              <ActivityList>
                {activityOptions.map((option) => (
                  <ActivityOption key={option.value}>
                    <input
                      type="radio"
                      name="activityLevel"
                      value={option.value}
                      checked={formValues.activityLevel === option.value}
                      onChange={handleChange}
                    />
                    <ActivityText>
                      <span>{option.description}</span>
                    </ActivityText>
                  </ActivityOption>
                ))}
              </ActivityList>
            </Fieldset>

            <SubmitButton type="submit">계산하기</SubmitButton>
          </FormCard>

          <ResultCard ref={resultRef}>
            <SectionTitle>결과</SectionTitle>
            {!hasSubmitted ? (
              <ResultPlaceholder>
                계산 버튼을 누르면 이 영역에 결과가 표시됩니다.
              </ResultPlaceholder>
            ) : (
              <ResultContent>
                {errorMessage ? (
                  <ErrorMessage>{errorMessage}</ErrorMessage>
                ) : (
                  <>
                    <ResultNotice>
                      현재 입력값을 기준으로 계산한 하루 권장 칼로리입니다.
                    </ResultNotice>

                    <ResultList>
                      <ResultItem>
                        <ResultLabel>기초대사량(BMR)</ResultLabel>
                        <ResultValue>{formatKcal(animatedResult?.bmr)}</ResultValue>
                      </ResultItem>
                      <ResultItem>
                        <ResultLabel>활동 대사량(TDEE)</ResultLabel>
                        <ResultValue>{formatKcal(animatedResult?.tdee)}</ResultValue>
                      </ResultItem>
                      <ResultItem>
                        <ResultLabel>감량 칼로리</ResultLabel>
                        <ResultValue>
                          {formatKcal(animatedResult?.cutCalories)}
                        </ResultValue>
                      </ResultItem>
                      <ResultItem>
                        <ResultLabel>유지 칼로리</ResultLabel>
                        <ResultValue>
                          {formatKcal(animatedResult?.maintenanceCalories)}
                        </ResultValue>
                      </ResultItem>
                      <ResultItem>
                        <ResultLabel>증량 칼로리</ResultLabel>
                        <ResultValue>{formatKcal(animatedResult?.bulkCalories)}</ResultValue>
                      </ResultItem>
                    </ResultList>

                    <ResultGuide>
                      감량/증량 칼로리는 유지 칼로리 기준으로 각각 500kcal을
                      빼고 더한 값입니다.
                    </ResultGuide>
                  </>
                )}
              </ResultContent>
            )}
          </ResultCard>
        </ContentGrid>
      </Container>
    </Page>
  )
}

function formatKcal(value) {
  if (typeof value !== 'number') {
    return '-'
  }

  return `${value.toLocaleString('ko-KR')} kcal`
}

function validateForm(formValues) {
  if (!formValues.gender) {
    return '성별을 선택해주세요.'
  }

  if (!formValues.age) {
    return '나이를 입력해주세요.'
  }

  if (!isPositiveNumber(formValues.age)) {
    return '나이는 0보다 큰 숫자여야 합니다.'
  }

  if (!formValues.height) {
    return '키를 입력해주세요.'
  }

  if (!isPositiveNumber(formValues.height)) {
    return '키는 0보다 큰 숫자여야 합니다.'
  }

  if (!formValues.weight) {
    return '몸무게를 입력해주세요.'
  }

  if (!isPositiveNumber(formValues.weight)) {
    return '몸무게는 0보다 큰 숫자여야 합니다.'
  }

  if (!formValues.activityLevel) {
    return '활동량을 선택해주세요.'
  }

  return ''
}

function isPositiveNumber(value) {
  const parsedValue = Number(value)

  return Number.isFinite(parsedValue) && parsedValue > 0
}

function calculateTdee(formValues) {
  const age = Number(formValues.age)
  const height = Number(formValues.height)
  const weight = Number(formValues.weight)
  const activityFactor = getActivityFactor(formValues.activityLevel)

  const baseBmr = formValues.gender === 'male'
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161

  const bmr = Math.round(baseBmr)
  const tdee = Math.round(baseBmr * activityFactor)
  const maintenanceCalories = tdee
  const cutCalories = Math.max(0, tdee - 500)
  const bulkCalories = tdee + 500

  return {
    bmr,
    tdee,
    cutCalories,
    maintenanceCalories,
    bulkCalories,
  }
}

function getActivityFactor(value) {
  const selectedOption = activityOptions.find((option) => option.value === value)

  return selectedOption?.factor ?? 1
}

const Page = styled.main`
  min-height: 100vh;
  padding: 40px 20px;
  background: #f5f7fb;
`

const Container = styled.div`
  max-width: 960px;
  margin: 0 auto;
`

const Header = styled.header`
  margin-bottom: 24px;
`

const Title = styled.h1`
  margin: 0 0 8px;
  font-size: 2rem;
`

const Description = styled.p`
  margin: 0;
  color: #475467;
`

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const Card = styled.section`
  padding: 24px;
  background: #ffffff;
  border: 1px solid #d0d5dd;
  border-radius: 12px;
`

const FormCard = styled.form`
  display: grid;
  gap: 20px;
  padding: 24px;
  background: #ffffff;
  border: 1px solid #d0d5dd;
  border-radius: 12px;
`

const ResultCard = styled(Card)`
  display: grid;
  gap: 20px;
  align-content: start;
`

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
`

const FieldGroup = styled.div`
  display: grid;
  gap: 8px;
`

const Label = styled.label`
  font-weight: 600;
`

const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #d0d5dd;
  border-radius: 8px;
  font: inherit;
  box-sizing: border-box;
`

const Fieldset = styled.fieldset`
  margin: 0;
  padding: 0;
  border: 0;
  display: grid;
  gap: 12px;
`

const Legend = styled.legend`
  margin-bottom: 8px;
  padding: 0;
  font-weight: 600;
`

const OptionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`

const InlineOption = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`

const ActivityList = styled.div`
  display: grid;
  gap: 10px;
`

const ActivityOption = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  border: 1px solid #d0d5dd;
  border-radius: 8px;
  cursor: pointer;
`

const ActivityText = styled.span`
  display: grid;
  color: #475467;
  font-size: 0.95rem;
`

const SubmitButton = styled.button`
  border: 0;
  border-radius: 8px;
  padding: 14px 16px;
  background: #111827;
  color: #ffffff;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
`

const ResultPlaceholder = styled.p`
  margin: 0;
  padding: 16px;
  border: 1px dashed #d0d5dd;
  border-radius: 8px;
  color: #475467;
`

const ResultContent = styled.div`
  display: grid;
  gap: 16px;
`

const ResultNotice = styled.p`
  margin: 0;
  color: #475467;
`

const ErrorMessage = styled.p`
  margin: 0;
  padding: 14px 16px;
  border: 1px solid #fda29b;
  border-radius: 8px;
  background: #fef3f2;
  color: #b42318;
`

const ResultList = styled.div`
  display: grid;
  gap: 12px;
`

const ResultItem = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  background: #f8fafc;
  border-radius: 8px;
`

const ResultLabel = styled.span`
  font-weight: 600;
`

const ResultValue = styled.span`
  color: #475467;
`

const ResultGuide = styled.p`
  margin: 0;
  color: #475467;
`

export default App
