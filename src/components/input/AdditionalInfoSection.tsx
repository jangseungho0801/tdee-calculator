import type { ChangeEvent } from 'react'
import styled from 'styled-components'
import NumberInputField from '../common/NumberInputField.tsx'
import SectionCard from '../common/SectionCard.tsx'
import type { InputData, ValidationErrors } from '../../types/calculator'

const Title = styled.h2`
  margin: 0 0 4px;
  font-size: 1.1rem;
  color: #0f172a;
`

const Description = styled.p`
  margin: 0 0 16px;
  color: #475569;
`

type Props = {
  inputData: InputData
  errors: ValidationErrors
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

function AdditionalInfoSection({ inputData, errors, onChange }: Props) {
  return (
    <SectionCard>
      <Title>추가 정보</Title>
      <Description>
        체지방률을 입력하면 Katch-McArdle 공식을 사용해 BMR을 계산합니다.
      </Description>
      <NumberInputField
        id="bodyFatPercentage"
        name="bodyFatPercentage"
        label="체지방률"
        placeholder="예: 18"
        suffix="%"
        value={inputData.bodyFatPercentage}
        error={errors.bodyFatPercentage}
        onChange={onChange}
      />
    </SectionCard>
  )
}

export default AdditionalInfoSection
