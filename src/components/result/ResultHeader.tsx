import styled from 'styled-components'
import SectionCard from '../common/SectionCard.tsx'

const HeaderCard = styled(SectionCard)`
  display: grid;
  gap: 8px;
  background:
    linear-gradient(135deg, rgba(15, 23, 42, 0.94), rgba(37, 99, 235, 0.92)),
    #0f172a;
  color: #ffffff;
`

const Label = styled.span`
  font-size: 0.92rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.78);
`

const Value = styled.strong`
  font-size: clamp(2.2rem, 4vw, 4rem);
  line-height: 1;
  letter-spacing: -0.06em;
`

const Description = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.84);
`

type Props = {
  tdee: number
  bmr: number
}

function ResultHeader({ tdee, bmr }: Props) {
  return (
    <HeaderCard>
      <Label>Total Daily Energy Expenditure</Label>
      <Value>{tdee.toLocaleString('ko-KR')} kcal</Value>
      <Description>
        기초대사량은 {bmr.toLocaleString('ko-KR')} kcal이며, 활동량 계수가 반영된
        현재 추정 유지 칼로리입니다.
      </Description>
    </HeaderCard>
  )
}

export default ResultHeader
