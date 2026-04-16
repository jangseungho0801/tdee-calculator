import { useEffect, useState } from 'react'
import { ROUTES } from '../../constants/routes'
import GoalSettingPage from '../../pages/GoalSettingPage.tsx'
import InputPage from '../../pages/InputPage.tsx'
import IntroPage from '../../pages/IntroPage.tsx'
import ResultPage from '../../pages/ResultPage.tsx'

function getCurrentPath() {
  const pathname = window.location.pathname || ROUTES.intro

  if (pathname === '/input') {
    return ROUTES.input
  }

  if (pathname === '/result') {
    return ROUTES.result
  }

  return pathname
}

export function navigateTo(path: string) {
  if (window.location.pathname === path) {
    return
  }

  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

function AppRouter() {
  const [pathname, setPathname] = useState(getCurrentPath)

  useEffect(() => {
    const syncPath = () => {
      setPathname(getCurrentPath())
    }

    window.addEventListener('popstate', syncPath)

    return () => {
      window.removeEventListener('popstate', syncPath)
    }
  }, [])

  if (pathname === ROUTES.input) {
    return <InputPage />
  }

  if (pathname === ROUTES.result) {
    return <ResultPage />
  }

  if (pathname === ROUTES.goal) {
    return <GoalSettingPage />
  }

  return <IntroPage />
}

export default AppRouter
