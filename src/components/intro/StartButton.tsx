import Button from '../common/Button.tsx'

type Props = {
  onClick: () => void
}

function StartButton({ onClick }: Props) {
  return (
    <Button type="button" onClick={onClick}>
      계산 시작하기
    </Button>
  )
}

export default StartButton
