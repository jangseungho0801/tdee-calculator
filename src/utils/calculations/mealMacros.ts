import type {
  GoalResult,
  MealAmount,
  MealMacroFocus,
  MealStructureItem,
} from '../../types/calculator'

export type MealMacroCard = {
  id: string
  name: string
  amount: MealAmount
  macroFocus: MealMacroFocus
  calories: number
  carbsGrams: number
  proteinGrams: number
  fatGrams: number
}

const AMOUNT_WEIGHTS: Record<MealAmount, number> = {
  small: 0.8,
  normal: 1,
  large: 1.2,
}

const CALORIES_PER_GRAM = {
  carb: 4,
  protein: 4,
  fat: 9,
} as const

function roundToOneDecimal(value: number) {
  return Number(value.toFixed(1))
}

function distributeByWeights(total: number, weights: number[]) {
  if (weights.length === 0) {
    return []
  }

  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)

  if (totalWeight <= 0) {
    return weights.map(() => 0)
  }

  const distributed = weights.map((weight) =>
    roundToOneDecimal((total * weight) / totalWeight),
  )
  const sumWithoutLast = distributed
    .slice(0, -1)
    .reduce((sum, value) => sum + value, 0)

  distributed[distributed.length - 1] = roundToOneDecimal(total - sumWithoutLast)

  return distributed
}

function getAdjustedMacroPercents(goalResult: GoalResult, focus: MealMacroFocus) {
  const basePercents = {
    carb: goalResult.macros.carbsPercent,
    protein: goalResult.macros.proteinPercent,
    fat: goalResult.macros.fatPercent,
  }

  const emphasized = {
    ...basePercents,
    [focus]: basePercents[focus] * 1.2,
  }

  const sum = emphasized.carb + emphasized.protein + emphasized.fat

  return {
    carb: emphasized.carb / sum,
    protein: emphasized.protein / sum,
    fat: emphasized.fat / sum,
  }
}

export function buildMealMacroCards(
  goalResult: GoalResult,
  meals: MealStructureItem[],
): MealMacroCard[] {
  const mealCalories = distributeByWeights(
    goalResult.calories,
    meals.map((meal) => AMOUNT_WEIGHTS[meal.amount]),
  )

  return meals.map((meal, index) => {
    const calories = mealCalories[index] ?? 0
    const percents = getAdjustedMacroPercents(goalResult, meal.macroFocus)

    return {
      id: meal.id,
      name: meal.name,
      amount: meal.amount,
      macroFocus: meal.macroFocus,
      calories,
      carbsGrams: roundToOneDecimal(
        (calories * percents.carb) / CALORIES_PER_GRAM.carb,
      ),
      proteinGrams: roundToOneDecimal(
        (calories * percents.protein) / CALORIES_PER_GRAM.protein,
      ),
      fatGrams: roundToOneDecimal(
        (calories * percents.fat) / CALORIES_PER_GRAM.fat,
      ),
    }
  })
}
