import type { ReactNode } from 'react'
import { TdeeCalculatorProvider } from '../../contexts/TdeeCalculatorContext'

type Props = {
  children: ReactNode
}

function AppProviders({ children }: Props) {
  return <TdeeCalculatorProvider>{children}</TdeeCalculatorProvider>
}

export default AppProviders
