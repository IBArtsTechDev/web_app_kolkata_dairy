import { apiClient } from './client'
import { toFormData } from './form'
import { mapEvent, mapEventList, pick } from './mappers'
import type { ApiResponse, CreateEventPayload, Event, EventFilters, PaginatedResponse, UpdateEventPayload } from '@/types'
import type { EventDto, EventListDto } from './dto'

type EventQuery = Record<string, string | number>

/** Translates the app filter model into the API query contract. */
export function buildEventQuery(filters: EventFilters): EventQuery {
  const query: EventQuery = {}

  if (filters.search) query.q = filters.search
  if (filters.category) query.category = filters.category
  if (filters.status) query.status = filters.status
  if (filters.city) query.city = filters.city
  if (filters.area) query.area = filters.area
  if (filters.page) query.page = filters.page
  if (filters.limit) query.limit = filters.limit
  if (filters.sortBy) query.sortBy = filters.sortBy
  if (filters.sortOrder) query.sortOrder = filters.sortOrder

  if (filters.isFree !== undefined) query.isFree = filters.isFree ? '1' : '0'

  const from = filters.startDate ? new Date(filters.startDate) : null
  if (from && !Number.isNaN(from.getTime())) query.from = from.toISOString()

  const to = filters.endDate ? new Date(filters.endDate) : null
  if (to && !Number.isNaN(to.getTime())) query.to = to.toISOString()

  return query
}

async function fetchList(path: string, filters: EventFilters): Promise<PaginatedResponse<Event>> {
  const { data } = await apiClient.get<ApiResponse<EventListDto>>(path, {
    params: buildEventQuery(filters),
  })
  return mapEventList(data.data)
}

export const eventsApi = {
  /** Public list – only active, upcoming events are exposed */
  getAll: (filters: EventFilters = {}): Promise<PaginatedResponse<Event>> =>
    fetchList('/events', filters),

  /** Public detail */
  getById: async (id: string): Promise<Event> => {
    const { data } = await apiClient.get<ApiResponse<{ event: EventDto }>>(`/events/${id}`)
    const event = pick<EventDto>(data, 'event')
    if (!event) throw new Error('Event not found')
    return mapEvent(event)
  },

  /** Admin list – every status, paginated */
  adminList: (filters: EventFilters = {}): Promise<PaginatedResponse<Event>> =>
    fetchList('/admin/fetch-event', filters),

  /** Admin detail */
  adminGetById: async (id: string): Promise<Event> => {
    const { data } = await apiClient.get<ApiResponse<{ event: EventDto }>>(
      `/admin/fetch-event/${id}`,
    )
    const event = pick<EventDto>(data, 'event')
    if (!event) throw new Error('Event not found')
    return mapEvent(event)
  },

  /** Admin create – multipart when an image is supplied, JSON otherwise */
  create: async (payload: CreateEventPayload, image?: File): Promise<Event> => {
    const { data } = image
      ? await apiClient.post<ApiResponse<{ event: EventDto }>>('/admin/add-event', toFormData({ ...payload, image }))
      : await apiClient.post<ApiResponse<{ event: EventDto }>>('/admin/add-event', payload)
    const event = pick<EventDto>(data, 'event')
    if (!event) throw new Error('Event was not created')
    return mapEvent(event)
  },

  /** Admin update */
  update: async (
    id: string,
    payload: UpdateEventPayload,
    image?: File,
  ): Promise<Event> => {
    const { data } = image
      ? await apiClient.put<ApiResponse<{ updateEvent: EventDto }>>(
          `/admin/update-event/${id}`,
          toFormData({ ...payload, image }),
        )
      : await apiClient.put<ApiResponse<{ updateEvent: EventDto }>>(
          `/admin/update-event/${id}`,
          payload,
        )
    const event = pick<EventDto>(data, 'updateEvent')
    if (!event) throw new Error('Event was not updated')
    return mapEvent(event)
  },

  /** Admin delete */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/remove-event/${id}`)
  },
}
