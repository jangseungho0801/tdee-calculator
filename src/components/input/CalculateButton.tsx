import Button from '../common/Button.tsx'

type Props = {
  form?: string
}

function CalculateButton({ form }: Props) {
  return (
    <Button type="submit" form={form} $fullWidth>
      하루 권장 칼로리 확인하기
    </Button>
  )
}

export default CalculateButton
