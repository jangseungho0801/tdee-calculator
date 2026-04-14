import { createContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type {
  CalculationResult,
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

export const TdeeCalculatorContext =
  createContext<TdeeCalculatorContextValue | null>(null)

type Props = {
  children: ReactNode
}

export function TdeeCalculatorProvider({ children }: Props) {
  const [inputData, setInputData] = useState<InputData>(initialInputData)
  const [resultData, setResultData] = useState<CalculationResult | null>(null)

  const value = useMemo<TdeeCalculatorContextValue>(
    () => ({
      inputData,
      resultData,
      setInputData,
      setResultData,
      resetCalculator: () => {
        setInputData(initialInputData)
        setResultData(null)
      },
    }),
    [inputData, resultData],
  )

  return (
    <TdeeCalculatorContext.Provider value={value}>
      {children}
    </TdeeCalculatorContext.Provider>
  )
}
