import { create } from 'zustand'
import type { EventFilters } from '@/types'

interface AppState {
  /** Current event filters */
  eventFilters: EventFilters
  setEventFilters: (filters: Partial<EventFilters>) => void
  resetEventFilters: () => void

  /** Search query */
  searchQuery: string
  setSearchQuery: (query: string) => void
}

const defaultFilters: EventFilters = {
  page: 1,
  limit: 12,
  sortBy: 'startDate',
  sortOrder: 'asc',
}

export const useAppStore = create<AppState>((set) => ({
  eventFilters: defaultFilters,
  setEventFilters: (filters) =>
    set((state) => ({ eventFilters: { ...state.eventFilters, ...filters } })),
  resetEventFilters: () => set({ eventFilters: defaultFilters }),

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
}))
