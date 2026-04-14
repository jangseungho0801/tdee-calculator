import type { ReactNode } from 'react'
import styled from 'styled-components'

type Props = {
  children: ReactNode
}

const Shell = styled.main`
  min-height: 100vh;
  padding: 32px 20px 72px;
  background:
    radial-gradient(circle at top left, rgba(14, 165, 233, 0.18), transparent 28%),
    radial-gradient(circle at top right, rgba(251, 191, 36, 0.18), transparent 24%),
    linear-gradient(180deg, #f8fbff 0%, #eef2ff 100%);
`

const Container = styled.div`
  width: min(1120px, 100%);
  margin: 0 auto;
`

function PageLayout({ children }: Props) {
  return (
    <Shell>
      <Container>{children}</Container>
    </Shell>
  )
}

export default PageLayout
