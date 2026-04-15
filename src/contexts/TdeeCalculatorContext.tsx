import { createContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type {
  CalculationResult,
  GoalType,
  GoalSettingData,
  InputData,
  TdeeCalculatorContextValue,
} from '../types/calculator'

const initialInputData: InputData = {
  gender: '',
  age: '',
  height: '',
  weight: '',
  activityLevel: '',
  bodyFatPercentage: '',
}

const initialGoalSettingData: GoalSettingData = {
  targetWeight: '',
  durationValue: '',
  durationUnit: 'week',
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

  const value = useMemo<TdeeCalculatorContextValue>(
    () => ({
      inputData,
      resultData,
      selectedGoal,
      goalSettingData,
      setInputData,
      setResultData,
      setSelectedGoal,
      setGoalSettingData,
      resetCalculator: () => {
        setInputData(initialInputData)
        setResultData(null)
        setSelectedGoal('cut')
        setGoalSettingData(initialGoalSettingData)
      },
    }),
    [goalSettingData, inputData, resultData, selectedGoal],
  )

  return (
    <TdeeCalculatorContext.Provider value={value}>
      {children}
    </TdeeCalculatorContext.Provider>
  )
}
