import type { ReactNode } from 'react'
import styled from 'styled-components'

type Props = {
  children: ReactNode
  maxWidth?: string
}

const Spacer = styled.div`
  height: 148px;
`

const Rail = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  padding: 20px 20px 24px;
  background: linear-gradient(
    180deg,
    rgba(248, 251, 255, 0) 0%,
    rgba(248, 251, 255, 0.92) 22%,
    rgba(248, 251, 255, 0.98) 100%
  );
  backdrop-filter: blur(16px);
`

const Inner = styled.div<{ $maxWidth: string }>`
  width: min(100%, ${({ $maxWidth }) => $maxWidth});
  margin: 0 auto;
  display: grid;
  gap: 12px;
`

function FixedBottomActions({ children, maxWidth = '760px' }: Props) {
  return (
    <>
      <Spacer aria-hidden="true" />
      <Rail>
        <Inner $maxWidth={maxWidth}>{children}</Inner>
      </Rail>
    </>
  )
}

export default FixedBottomActions
