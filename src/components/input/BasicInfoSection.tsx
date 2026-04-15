import type { ChangeEvent } from 'react'
import styled from 'styled-components'
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

const Grid = styled.div`
  display: grid;
  gap: 16px;
`

const TwoColumnGrid = styled.div`
  display: grid;
  gap: 16px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`

type Props = {
  inputData: InputData
  errors: ValidationErrors
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

function BasicInfoSection({ inputData, errors, onChange }: Props) {
  return (
    <SectionCard>
      <Header>
        <Title>기본 정보</Title>
      </Header>
      <Grid>
        <RadioGroupField
          name="gender"
          legend="성별"
          value={inputData.gender}
          onChange={onChange}
          error={errors.gender}
          columns={2}
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
        <TwoColumnGrid>
          <NumberInputField
            id="height"
            name="height"
            label="키"
            placeholder="예: 175"
            suffix="cm"
            value={inputData.height}
            error={errors.height}
            onChange={onChange}
          />
          <NumberInputField
            id="weight"
            name="weight"
            label="현재 체중"
            placeholder="예: 68"
            suffix="kg"
            value={inputData.weight}
            error={errors.weight}
            onChange={onChange}
          />
        </TwoColumnGrid>
      </Grid>
    </SectionCard>
  )
}

export default BasicInfoSection
