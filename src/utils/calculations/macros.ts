import { MACRO_PLANS } from '../../constants/macroPlans'
import type { GoalType, MacroResult } from '../../types/calculator'

export function convertMacroCaloriesToGrams(calories: number, divisor: number) {
  return Math.round(calories / divisor)
}

export function calculateMacros(
  calories: number,
  goalType: GoalType,
): MacroResult {
  const plan = MACRO_PLANS[goalType]
  const carbsCalories = calories * (plan.carbs / 100)
  const proteinCalories = calories * (plan.protein / 100)
  const fatCalories = calories * (plan.fat / 100)

  return {
    carbsPercent: plan.carbs,
    carbsGrams: convertMacroCaloriesToGrams(carbsCalories, 4),
    proteinPercent: plan.protein,
    proteinGrams: convertMacroCaloriesToGrams(proteinCalories, 4),
    fatPercent: plan.fat,
    fatGrams: convertMacroCaloriesToGrams(fatCalories, 9),
  }
}
