import type { GoalType } from '../types/calculator'

export const MACRO_PLANS: Record<
  GoalType,
  {
    carbs: number
    protein: number
    fat: number
    headline: string
    description: string
  }
> = {
  cut: {
    carbs: 90,
    protein: 5,
    fat: 5,
    headline: '감량 중심 플랜',
    description: '단백질 비중을 높여 포만감과 회복을 우선하는 구성이에요.',
  },
  maintain: {
    carbs: 40,
    protein: 30,
    fat: 30,
    headline: '균형 유지 플랜',
    description: '운동과 일상을 안정적으로 유지하기 위한 균형형 구성입니다.',
  },
  bulk: {
    carbs: 45,
    protein: 30,
    fat: 25,
    headline: '벌크업 플랜',
    description: '훈련 볼륨과 회복을 고려해 탄수화물 비중을 높인 구성이에요.',
  },
}
