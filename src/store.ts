import { create } from 'zustand'
import { AUTH_TOKEN_KEY, AUTH_USER_KEY, clearAuthToken, setAuthToken } from '@/api/client'
import type { AuthResponse, AuthUser, EventFilters } from '@/types'

interface AppState {
  /** Current event filters */
  eventFilters: EventFilters
  setEventFilters: (filters: Partial<EventFilters>) => void
  resetEventFilters: () => void

  /** Search query */
  searchQuery: string
  setSearchQuery: (query: string) => void

  /** Auth session */
  token: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  login: (session: AuthResponse) => void
  logout: () => void

  /** Auth modal */
  isAuthModalOpen: boolean
  authModalRedirect?: string
  openAuthModal: (redirect?: string) => void
  closeAuthModal: () => void
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

export const useAppStore = create<AppState>((set) => {
  // Listen for 401 unauthorized broadcasts
  if (typeof window !== 'undefined') {
    window.addEventListener('auth:unauthorized', () => {
      set({ token: null, user: null, isAuthenticated: false })
    })
  }

  return {
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
        username: session.username ?? null,
        role: session.role ?? 'USER',
        profilePicture: session.profilePicture ?? null,
        age: session.age ?? null,
        gender: session.gender ?? null,
        countryCode: session.countryCode ?? null,
        phoneNumber: session.phoneNumber ?? null,
      }

      setAuthToken(session.accessToken)
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
      set({ token: session.accessToken, user, isAuthenticated: true, isAuthModalOpen: false })
    },

    logout: () => {
      clearAuthToken()
      set({ token: null, user: null, isAuthenticated: false })
    },

    isAuthModalOpen: false,
    authModalRedirect: undefined,
    openAuthModal: (redirect?: string) =>
      set({ isAuthModalOpen: true, authModalRedirect: redirect }),
    closeAuthModal: () => set({ isAuthModalOpen: false, authModalRedirect: undefined }),
  }
})
