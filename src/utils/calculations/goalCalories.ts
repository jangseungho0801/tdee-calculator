export function calculateGoalCalories(tdee: number) {
  return {
    cut: Math.max(0, Math.round(tdee - 500)),
    maintain: Math.round(tdee),
    bulk: Math.round(tdee + 300),
  }
}
