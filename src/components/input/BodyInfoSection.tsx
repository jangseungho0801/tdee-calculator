import type { ChangeEvent } from 'react'
import styled from 'styled-components'
import NumberInputField from '../common/NumberInputField.tsx'
import SectionCard from '../common/SectionCard.tsx'
import type { InputData, ValidationErrors } from '../../types/calculator'

const Header = styled.div`
  margin-bottom: 16px;
`

const Title = styled.h2`
  margin: 0 0 4px;
  font-size: 1.1rem;
  color: #0f172a;
`

const Description = styled.p`
  margin: 0;
  color: #475569;
`

const Grid = styled.div`
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

function BodyInfoSection({ inputData, errors, onChange }: Props) {
  return (
    <SectionCard>
      <Header>
        <Title>신체 정보</Title>
        <Description>키와 몸무게는 현재 기준값으로 입력해 주세요.</Description>
      </Header>
      <Grid>
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
          label="몸무게"
          placeholder="예: 68"
          suffix="kg"
          value={inputData.weight}
          error={errors.weight}
          onChange={onChange}
        />
      </Grid>
    </SectionCard>
  )
}

export default BodyInfoSection
