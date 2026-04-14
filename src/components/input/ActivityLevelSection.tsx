import type { ChangeEvent } from 'react'
import SectionCard from '../common/SectionCard.tsx'
import RadioGroupField from '../common/RadioGroupField.tsx'
import { ACTIVITY_LEVELS } from '../../constants/activityLevels'
import type { InputData, ValidationErrors } from '../../types/calculator'

type Props = {
  inputData: InputData
  errors: ValidationErrors
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

function ActivityLevelSection({ inputData, errors, onChange }: Props) {
  return (
    <SectionCard>
      <RadioGroupField
        name="activityLevel"
        legend="활동량"
        value={inputData.activityLevel}
        onChange={onChange}
        error={errors.activityLevel}
        options={ACTIVITY_LEVELS.map((option) => ({
          value: option.id,
          label: `${option.label} (${option.multiplier})`,
          description: option.description,
        }))}
      />
    </SectionCard>
  )
}

export default ActivityLevelSection
