import Button from '../common/Button.tsx'

type Props = {
  onClick: () => void
}

function RecalculateButton({ onClick }: Props) {
  return (
    <Button type="button" $variant="secondary" $fullWidth onClick={onClick}>
      정보 입력 다시하기
    </Button>
  )
}

export default RecalculateButton
