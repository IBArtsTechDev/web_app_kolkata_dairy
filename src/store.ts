import { create } from 'zustand'
import { AUTH_TOKEN_KEY, AUTH_USER_KEY, clearAuthToken, setAuthToken } from '@/api/client'
import type { AuthUser, EventFilters, LoginResponse } from '@/types'

interface AppState {
  /** Current event filters */
  eventFilters: EventFilters
  setEventFilters: (filters: Partial<EventFilters>) => void
  resetEventFilters: () => void

  /** Search query */
  searchQuery: string
  setSearchQuery: (query: string) => void

  /** Admin session */
  token: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  login: (session: LoginResponse) => void
  logout: () => void
}

const defaultFilters: EventFilters = {
  page: 1,
  limit: 12,
  sortBy: 'startsAt',
  sortOrder: 'ASC',
}

function readSession(): { token: string | null; user: AuthUser | null } {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    const rawUser = localStorage.getItem(AUTH_USER_KEY)
    const user = rawUser ? (JSON.parse(rawUser) as AuthUser) : null
    return { token: token ?? null, user }
  } catch {
    return { token: null, user: null }
  }
}

const initialSession = readSession()

export const useAppStore = create<AppState>((set) => ({
  eventFilters: defaultFilters,
  setEventFilters: (filters) =>
    set((state) => ({ eventFilters: { ...state.eventFilters, ...filters } })),
  resetEventFilters: () => set({ eventFilters: defaultFilters }),

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  token: initialSession.token,
  user: initialSession.user,
  isAuthenticated: Boolean(initialSession.token),
  login: (session) => {
    const user: AuthUser = {
      id: session.id,
      publicId: session.publicId,
      name: session.name,
      email: session.email,
      username: session.username,
      role: session.role,
      profilePicture: session.profilePicture,
      age: session.age,
      gender: session.gender,
      phoneNumber: session.phoneNumber,
    }

    setAuthToken(session.accessToken)
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
    set({ token: session.accessToken, user, isAuthenticated: true })
  },
  logout: () => {
    clearAuthToken()
    set({ token: null, user: null, isAuthenticated: false })
  },
}))
