export type Gender = 'male' | 'female'

export type ActivityLevelId =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'active'
  | 'veryActive'

export type GoalType = 'cut' | 'maintain' | 'bulk'

export type GoalDurationUnit = 'day' | 'week' | 'month'

export type InputData = {
  gender: Gender | ''
  age: string
  height: string
  weight: string
  activityLevel: ActivityLevelId | ''
  bodyFatPercentage: string
}

export type ParsedInputData = {
  gender: Gender
  age: number
  height: number
  weight: number
  activityLevel: ActivityLevelId
  bodyFatPercentage?: number
}

export type MacroResult = {
  carbsPercent: number
  carbsGrams: number
  proteinPercent: number
  proteinGrams: number
  fatPercent: number
  fatGrams: number
}

export type GoalResult = {
  calories: number
  macros: MacroResult
}

export type GoalSettingData = {
  targetWeight: string
  durationValue: string
  durationUnit: GoalDurationUnit
}

export type MealStructureItem = {
  id: string
  name: string
  time: string
}

export type CalculationResult = {
  bmr: number
  tdee: number
  goals: Record<GoalType, GoalResult>
}

export type ValidationErrors = Partial<Record<keyof InputData, string>>

export type TdeeCalculatorContextValue = {
  inputData: InputData
  resultData: CalculationResult | null
  selectedGoal: GoalType
  goalSettingData: GoalSettingData
  mealStructure: MealStructureItem[]
  setInputData: (value: InputData) => void
  setResultData: (value: CalculationResult | null) => void
  setSelectedGoal: (value: GoalType) => void
  setGoalSettingData: (value: GoalSettingData) => void
  setMealStructure: (value: MealStructureItem[]) => void
  resetCalculator: () => void
}
