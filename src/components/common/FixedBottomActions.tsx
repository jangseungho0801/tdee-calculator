import type { ReactNode } from 'react'
import styled from 'styled-components'

type Props = {
  children: ReactNode
  maxWidth?: string
}

const Wrapper = styled.div<{ $maxWidth: string }>`
  width: min(100%, ${({ $maxWidth }) => $maxWidth});
  margin: 0 auto;
  display: grid;
  gap: 12px;
  padding-top: 4px;
`

function FixedBottomActions({ children, maxWidth = '760px' }: Props) {
  return <Wrapper $maxWidth={maxWidth}>{children}</Wrapper>
}

export default FixedBottomActions
