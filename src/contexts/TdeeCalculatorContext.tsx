import { createContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type {
  CalculationResult,
  GoalType,
  GoalSettingData,
  InputData,
  MealStructureItem,
  TdeeCalculatorContextValue,
} from '../types/calculator'

const initialInputData: InputData = {
  gender: '',
  age: '',
  height: '',
  weight: '',
  activityLevel: 'moderate',
  bodyFatPercentage: '',
}

const initialGoalSettingData: GoalSettingData = {
  targetWeight: '',
  durationValue: '',
  durationUnit: 'week',
}

const initialMealStructure: MealStructureItem[] = [
  { id: 'meal-1', name: '아침', time: '08:00' },
  { id: 'meal-2', name: '점심', time: '13:00' },
  { id: 'meal-3', name: '저녁', time: '19:00' },
]

export const TdeeCalculatorContext =
  createContext<TdeeCalculatorContextValue | null>(null)

type Props = {
  children: ReactNode
}

export function TdeeCalculatorProvider({ children }: Props) {
  const [inputData, setInputData] = useState<InputData>(initialInputData)
  const [resultData, setResultData] = useState<CalculationResult | null>(null)
  const [selectedGoal, setSelectedGoal] = useState<GoalType>('cut')
  const [goalSettingData, setGoalSettingData] = useState<GoalSettingData>(
    initialGoalSettingData,
  )
  const [mealStructure, setMealStructure] =
    useState<MealStructureItem[]>(initialMealStructure)

  const value = useMemo<TdeeCalculatorContextValue>(
    () => ({
      inputData,
      resultData,
      selectedGoal,
      goalSettingData,
      mealStructure,
      setInputData,
      setResultData,
      setSelectedGoal,
      setGoalSettingData,
      setMealStructure,
      resetCalculator: () => {
        setInputData(initialInputData)
        setResultData(null)
        setSelectedGoal('cut')
        setGoalSettingData(initialGoalSettingData)
        setMealStructure(initialMealStructure)
      },
    }),
    [goalSettingData, inputData, mealStructure, resultData, selectedGoal],
  )

  return (
    <TdeeCalculatorContext.Provider value={value}>
      {children}
    </TdeeCalculatorContext.Provider>
  )
}
