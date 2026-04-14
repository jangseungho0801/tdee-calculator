import type { ChangeEvent } from 'react'
import styled from 'styled-components'
import RadioGroupField from '../common/RadioGroupField.tsx'
import NumberInputField from '../common/NumberInputField.tsx'
import SectionCard from '../common/SectionCard.tsx'
import type { InputData, ValidationErrors } from '../../types/calculator'

const Grid = styled.div`
  display: grid;
  gap: 16px;
`

type Props = {
  inputData: InputData
  errors: ValidationErrors
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

function BasicInfoSection({ inputData, errors, onChange }: Props) {
  return (
    <SectionCard>
      <Grid>
        <RadioGroupField
          name="gender"
          legend="기본 정보"
          value={inputData.gender}
          onChange={onChange}
          error={errors.gender}
          options={[
            { value: 'male', label: '남성' },
            { value: 'female', label: '여성' },
          ]}
        />
        <NumberInputField
          id="age"
          name="age"
          label="나이"
          placeholder="예: 29"
          suffix="세"
          value={inputData.age}
          error={errors.age}
          onChange={onChange}
        />
      </Grid>
    </SectionCard>
  )
}

export default BasicInfoSection
