import styled from 'styled-components'
import Button from '../common/Button.tsx'

const SubmitButton = styled(Button)`
  background: #2563eb;
  box-shadow: 0 16px 34px rgba(37, 99, 235, 0.18);

  &:hover:not(:disabled) {
    background: #1d4ed8;
    box-shadow: 0 18px 38px rgba(37, 99, 235, 0.24);
  }
`

function CalculateButton() {
  return (
    <SubmitButton type="submit" $fullWidth>
      내 기준 보러가기
    </SubmitButton>
  )
}

export default CalculateButton
