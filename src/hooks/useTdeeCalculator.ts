import { useContext } from 'react'
import { TdeeCalculatorContext } from '../contexts/TdeeCalculatorContext'

export function useTdeeCalculator() {
  const context = useContext(TdeeCalculatorContext)

  if (!context) {
    throw new Error('useTdeeCalculator must be used within TdeeCalculatorProvider')
  }

  return context
}
