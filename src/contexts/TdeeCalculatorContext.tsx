import { createContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type {
  CalculationResult,
  GoalType,
  GoalSettingData,
  InputData,
  MealStructureByTab,
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

const initialMealStructure: MealStructureByTab = {
  weekday: [
    { id: 'weekday-meal-1', name: '아침', time: '08:00' },
    { id: 'weekday-meal-2', name: '점심', time: '13:00' },
    { id: 'weekday-meal-3', name: '저녁', time: '19:00' },
  ],
  weekend: [
    { id: 'weekend-meal-1', name: '아점', time: '10:00' },
    { id: 'weekend-meal-2', name: '저녁', time: '18:30' },
  ],
}

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
    useState<MealStructureByTab>(initialMealStructure)

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
