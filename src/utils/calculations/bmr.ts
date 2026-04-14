import type { ParsedInputData } from '../../types/calculator'

export function calculateBmrWithMifflin(inputData: ParsedInputData) {
  const { gender, age, height, weight } = inputData
  const genderOffset = gender === 'male' ? 5 : -161

  return 10 * weight + 6.25 * height - 5 * age + genderOffset
}

export function calculateBmrWithKatch(
  weight: number,
  bodyFatPercentage: number,
) {
  const leanBodyMass = weight * (1 - bodyFatPercentage / 100)
  return 370 + 21.6 * leanBodyMass
}

export function calculateBmrByInput(inputData: ParsedInputData) {
  if (typeof inputData.bodyFatPercentage === 'number') {
    return calculateBmrWithKatch(inputData.weight, inputData.bodyFatPercentage)
  }

  return calculateBmrWithMifflin(inputData)
}
