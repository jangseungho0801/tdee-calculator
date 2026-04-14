import type { ActivityLevelId } from '../types/calculator'

export const ACTIVITY_LEVELS: Array<{
  id: ActivityLevelId
  label: string
  description: string
  multiplier: number
}> = [
  {
    id: 'sedentary',
    label: '거의 활동 없음',
    description: '주로 앉아서 생활하고 운동을 거의 하지 않는 경우',
    multiplier: 1.2,
  },
  {
    id: 'light',
    label: '가벼운 활동',
    description: '주 1~3회 가벼운 운동 또는 일상 활동이 있는 경우',
    multiplier: 1.375,
  },
  {
    id: 'moderate',
    label: '보통 활동',
    description: '주 3~5회 규칙적인 운동을 수행하는 경우',
    multiplier: 1.55,
  },
  {
    id: 'active',
    label: '활동적',
    description: '주 6~7회 운동하거나 활동량이 많은 경우',
    multiplier: 1.725,
  },
  {
    id: 'veryActive',
    label: '매우 활동적',
    description: '고강도 운동 또는 육체 노동을 병행하는 경우',
    multiplier: 1.9,
  },
]
