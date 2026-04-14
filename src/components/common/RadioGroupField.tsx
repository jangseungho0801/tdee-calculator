import type { ChangeEvent } from 'react'
import styled, { css } from 'styled-components'

type Option = {
  value: string
  label: string
  description?: string
}

type Props = {
  name: string
  legend: string
  options: Option[]
  value: string
  error?: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

const Wrapper = styled.fieldset`
  margin: 0;
  padding: 0;
  border: 0;
  display: grid;
  gap: 12px;
`

const Legend = styled.legend`
  margin-bottom: 4px;
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
`

const OptionGrid = styled.div`
  display: grid;
  gap: 12px;
`

const OptionCard = styled.label<{ $checked: boolean }>`
  display: grid;
  gap: 6px;
  padding: 16px 18px;
  border-radius: 20px;
  border: 1px solid rgba(148, 163, 184, 0.32);
  background: #ffffff;
  cursor: pointer;
  transition:
    border-color 160ms ease,
    transform 160ms ease,
    box-shadow 160ms ease;

  ${({ $checked }) =>
    $checked &&
    css`
      border-color: #2563eb;
      box-shadow: 0 12px 28px rgba(37, 99, 235, 0.18);
      transform: translateY(-1px);
    `}
`

const OptionHeader = styled.span`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  color: #0f172a;
`

const HiddenRadio = styled.input`
  margin: 0;
`

const Description = styled.span`
  color: #475569;
  line-height: 1.5;
`

const ErrorText = styled.span`
  color: #b42318;
  font-size: 0.92rem;
`

function RadioGroupField({
  name,
  legend,
  options,
  value,
  error,
  onChange,
}: Props) {
  return (
    <Wrapper>
      <Legend>{legend}</Legend>
      <OptionGrid>
        {options.map((option) => {
          const isChecked = value === option.value

          return (
            <OptionCard key={option.value} $checked={isChecked}>
              <OptionHeader>
                <HiddenRadio
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={isChecked}
                  onChange={onChange}
                />
                {option.label}
              </OptionHeader>
              {option.description ? (
                <Description>{option.description}</Description>
              ) : null}
            </OptionCard>
          )
        })}
      </OptionGrid>
      {error ? <ErrorText>{error}</ErrorText> : null}
    </Wrapper>
  )
}

export default RadioGroupField
