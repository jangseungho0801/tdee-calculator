import styled, { css } from 'styled-components'
import type { GoalType } from '../../types/calculator'

const TabRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
`

const TabButton = styled.button<{ $active: boolean }>`
  min-height: 54px;
  padding: 0 12px;
  border-radius: 18px;
  border: 1px solid rgba(148, 163, 184, 0.24);
  background: rgba(255, 255, 255, 0.92);
  color: #475569;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 160ms ease,
    box-shadow 160ms ease,
    border-color 160ms ease,
    background-color 160ms ease,
    color 160ms ease;

  ${({ $active }) =>
    $active &&
    css`
      color: #1d4ed8;
      border-color: rgba(37, 99, 235, 0.42);
      background: #eff6ff;
      box-shadow: 0 14px 30px rgba(37, 99, 235, 0.12);
      transform: translateY(-1px);
    `}
`

type Props = {
  activeGoal: GoalType
  onChange: (goal: GoalType) => void
}

const GOAL_LABELS: Record<GoalType, string> = {
  cut: '다이어트',
  maintain: '유지',
  bulk: '벌크업',
}

function GoalTabs({ activeGoal, onChange }: Props) {
  return (
    <TabRow>
      {(Object.keys(GOAL_LABELS) as GoalType[]).map((goal) => (
        <TabButton
          key={goal}
          type="button"
          $active={goal === activeGoal}
          onClick={() => onChange(goal)}
        >
          {GOAL_LABELS[goal]}
        </TabButton>
      ))}
    </TabRow>
  )
}

export default GoalTabs
