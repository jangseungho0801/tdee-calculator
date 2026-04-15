import type { ReactNode } from 'react'
import styled from 'styled-components'

type Props = {
  children: ReactNode
}

const Shell = styled.main`
  min-height: 100vh;
  padding: 32px 20px 72px;
  background:
    radial-gradient(circle at top left, rgba(191, 219, 254, 0.6), transparent 28%),
    radial-gradient(circle at top right, rgba(219, 234, 254, 0.5), transparent 24%),
    linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
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
