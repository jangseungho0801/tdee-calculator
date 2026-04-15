import type { ChangeEvent } from 'react'
import styled from 'styled-components'
import { ACTIVITY_LEVELS } from '../../constants/activityLevels'
import type { InputData, ValidationErrors } from '../../types/calculator'
import NumberInputField from '../common/NumberInputField.tsx'
import RadioGroupField from '../common/RadioGroupField.tsx'
import SectionCard from '../common/SectionCard.tsx'

const Header = styled.div`
  display: grid;
  gap: 4px;
  margin-bottom: 18px;
`

const Title = styled.h2`
  margin: 0;
  color: #111827;
  font-size: 1.1rem;
`

const Content = styled.div`
  display: grid;
  gap: 20px;
`

type Props = {
  inputData: InputData
  errors: ValidationErrors
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

function AdditionalInfoSection({ inputData, errors, onChange }: Props) {
  return (
    <SectionCard>
      <Header>
        <Title>활동 및 추가 정보</Title>
      </Header>
      <Content>
        <RadioGroupField
          name="activityLevel"
          legend="평소 활동량"
          value={inputData.activityLevel}
          onChange={onChange}
          error={errors.activityLevel}
          options={ACTIVITY_LEVELS.map((option) => ({
            value: option.id,
            label: option.label,
            description: option.description || undefined,
          }))}
        />
        <NumberInputField
          id="bodyFatPercentage"
          name="bodyFatPercentage"
          label="체지방률 (선택)"
          description="모르면 비워두셔도 괜찮아요"
          placeholder="예: 18"
          suffix="%"
          value={inputData.bodyFatPercentage}
          error={errors.bodyFatPercentage}
          onChange={onChange}
        />
      </Content>
    </SectionCard>
  )
}

export default AdditionalInfoSection
