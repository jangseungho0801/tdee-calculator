import type { ActivityLevelId } from '../types/calculator'

export const ACTIVITY_LEVELS: Array<{
  id: ActivityLevelId
  label: string
  description: string
  multiplier: number
}> = [
  {
    id: 'sedentary',
    label: '하루 대부분 앉아서 보내요',
    description: '',
    multiplier: 1.2,
  },
  {
    id: 'light',
    label: '앉아 있는 시간이 많지만 조금씩 움직여요',
    description: '',
    multiplier: 1.375,
  },
  {
    id: 'moderate',
    label: '앉아 있는 시간과 움직이는 시간이 비슷해요',
    description: '',
    multiplier: 1.55,
  },
  {
    id: 'active',
    label: '움직이는 시간이 많은 편이에요',
    description: '',
    multiplier: 1.725,
  },
  {
    id: 'veryActive',
    label: '하루 대부분 몸을 많이 쓰는 편이에요',
    description: '',
    multiplier: 1.9,
  },
]
