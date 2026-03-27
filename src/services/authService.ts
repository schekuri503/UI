import type { AppUser } from '../types'

const USER_KEY = 'ipl_predictor_user'

type Listener = (user: AppUser | null) => void
const listeners = new Set<Listener>()

const emit = (user: AppUser | null) => {
  listeners.forEach((listener) => listener(user))
}

export const authService = {
  getCurrentUser(): AppUser | null {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as AppUser
    } catch {
      return null
    }
  },

  async signInWithGoogle(): Promise<AppUser> {
    const mock: AppUser = {
      uid: 'demo-user',
      displayName: 'Demo Friend',
      email: 'friend@example.com',
      isAdmin: true,
    }
    localStorage.setItem(USER_KEY, JSON.stringify(mock))
    emit(mock)
    return mock
  },

  async signOut(): Promise<void> {
    localStorage.removeItem(USER_KEY)
    emit(null)
  },

  onAuthStateChanged(cb: Listener): () => void {
    listeners.add(cb)
    cb(this.getCurrentUser())
    return () => {
      listeners.delete(cb)
    }
  },
}
