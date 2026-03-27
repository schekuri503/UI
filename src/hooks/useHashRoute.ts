import { useEffect, useState } from 'react'

export const useHashRoute = () => {
  const [path, setPath] = useState<string>(window.location.hash.replace('#', '') || '/login')

  useEffect(() => {
    const onHash = () => {
      setPath(window.location.hash.replace('#', '') || '/login')
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const navigate = (nextPath: string) => {
    window.location.hash = nextPath
  }

  return { path, navigate }
}
