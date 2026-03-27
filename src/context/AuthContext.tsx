/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useMemo, useState } from 'react'
import { authService } from '../services/authService'
import type { AppUser } from '../types'

export interface AuthContextValue {
  user: AppUser | null
  isLoading: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    return authService.onAuthStateChanged((nextUser) => {
      setUser(nextUser)
      setIsLoading(false)
    })
  }, [])

  const value = useMemo(
    () => ({
      user,
      isLoading,
      signIn: async () => {
        setIsLoading(true)
        await authService.signInWithGoogle()
        setIsLoading(false)
      },
      signOut: async () => {
        setIsLoading(true)
        await authService.signOut()
        setIsLoading(false)
      },
    }),
    [isLoading, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
