import AppProviders from './app/providers/AppProviders.tsx'
import AppRouter from './app/router/AppRouter.tsx'

function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  )
}

export default App
