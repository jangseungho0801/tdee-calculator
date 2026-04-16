import type { ChangeEvent } from 'react'
import styled from 'styled-components'

type Props = {
  id: string
  name: string
  label?: string
  placeholder: string
  value: string
  error?: string
  suffix?: string
  description?: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

const Wrapper = styled.label`
  display: grid;
  gap: 8px;
`

const LabelText = styled.span`
  font-weight: 700;
  color: #0f172a;
`

const DescriptionText = styled.span`
  color: #64748b;
  font-size: 0.92rem;
`

const InputWrap = styled.span`
  position: relative;
  display: block;
`

const Input = styled.input`
  width: 100%;
  min-height: 52px;
  padding: 0 54px 0 16px;
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.36);
  background: rgba(248, 250, 252, 0.88);
  color: #0f172a;
  outline: none;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
  }
`

const Suffix = styled.span`
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  color: #64748b;
  font-size: 0.92rem;
`

const ErrorText = styled.span`
  color: #b42318;
  font-size: 0.92rem;
`

function NumberInputField({
  id,
  name,
  label,
  placeholder,
  value,
  error,
  suffix,
  description,
  onChange,
}: Props) {
  return (
    <Wrapper htmlFor={id}>
      {label ? <LabelText>{label}</LabelText> : null}
      {description ? <DescriptionText>{description}</DescriptionText> : null}
      <InputWrap>
        <Input
          id={id}
          name={name}
          type="number"
          min="0"
          inputMode="decimal"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {suffix ? <Suffix>{suffix}</Suffix> : null}
      </InputWrap>
      {error ? <ErrorText>{error}</ErrorText> : null}
    </Wrapper>
  )
}

export default NumberInputField
