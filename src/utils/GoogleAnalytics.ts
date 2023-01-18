import { useEffect, useState } from 'react'
import ReactGA from 'react-ga'

export const useAnalytics = () => {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (window.location.href.includes('exchange.rubyswap.finance')) {
      ReactGA.initialize('UA-220577244-1')
    }
    setInitialized(true)
  }, [])

  return {
    initialized,
  }
}
