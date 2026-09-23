import { apiClient } from './client'
import type {
  ApiResponse,
  CreateEventPayload,
  Event,
  EventFilters,
  PaginatedResponse,
  UpdateEventPayload,
} from '@/types'

/** Build query string from filter object */
function buildQueryString(filters: EventFilters): string {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        params.set(key, value.join(','))
      } else {
        params.set(key, String(value))
      }
    }
  })
  return params.toString()
}

export const eventsApi = {
  /** Fetch paginated events list */
  getAll: async (filters: EventFilters = {}): Promise<PaginatedResponse<Event>> => {
    const queryString = buildQueryString(filters)
    const { data } = await apiClient.get<PaginatedResponse<Event>>(
      `/events?${queryString}`,
    )
    return data
  },

  /** Fetch single event by ID */
  getById: async (id: string): Promise<Event> => {
    const { data } = await apiClient.get<ApiResponse<Event>>(`/events/${id}`)
    return data.data
  },

  /** Create a new event */
  create: async (payload: CreateEventPayload): Promise<Event> => {
    const { data } = await apiClient.post<ApiResponse<Event>>('/events', payload)
    return data.data
  },

  /** Update an existing event */
  update: async (id: string, payload: UpdateEventPayload): Promise<Event> => {
    const { data } = await apiClient.patch<ApiResponse<Event>>(`/events/${id}`, payload)
    return data.data
  },

  /** Delete an event */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/events/${id}`)
  },

  /** Register for an event */
  register: async (eventId: string): Promise<void> => {
    await apiClient.post(`/events/${eventId}/register`)
  },

  /** Cancel registration */
  cancelRegistration: async (eventId: string): Promise<void> => {
    await apiClient.delete(`/events/${eventId}/register`)
  },

  /** Fetch events the current user is attending */
  getMyEvents: async (page = 1, limit = 10): Promise<PaginatedResponse<Event>> => {
    const { data } = await apiClient.get<PaginatedResponse<Event>>(
      `/events/me?page=${page}&limit=${limit}`,
    )
    return data
  },
}
