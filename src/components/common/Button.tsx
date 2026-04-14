import type { ButtonHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

const variants = {
  primary: css`
    background: linear-gradient(135deg, #111827, #1d4ed8);
    color: #ffffff;
    box-shadow: 0 16px 32px rgba(29, 78, 216, 0.24);
  `,
  secondary: css`
    background: #ffffff;
    color: #0f172a;
    border: 1px solid rgba(148, 163, 184, 0.5);
  `,
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  $variant?: keyof typeof variants
  $fullWidth?: boolean
}

const Button = styled.button<Props>`
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  min-height: 52px;
  padding: 0 20px;
  border: 0;
  border-radius: 999px;
  font: inherit;
  font-weight: 700;
  letter-spacing: -0.02em;
  cursor: pointer;
  transition:
    transform 160ms ease,
    box-shadow 160ms ease,
    opacity 160ms ease;
  ${({ $variant = 'primary' }) => variants[$variant]}

  &:hover {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`

export default Button
