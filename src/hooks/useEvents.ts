import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { eventsApi } from '@/api/events'
import type { CreateEventPayload, EventFilters, UpdateEventPayload } from '@/types'

const QUERY_KEYS = {
  events: ['events'] as const,
  event: (id: string) => ['events', id] as const,
  myEvents: ['events', 'me'] as const,
}

/** Hook to fetch paginated events */
export function useEvents(filters: EventFilters = {}) {
  return useQuery({
    queryKey: [...QUERY_KEYS.events, filters],
    queryFn: () => eventsApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/** Hook to fetch infinite scrolling events */
export function useInfiniteEvents(filters: Omit<EventFilters, 'page'> = {}) {
  return useInfiniteQuery({
    queryKey: [...QUERY_KEYS.events, 'infinite', filters],
    queryFn: ({ pageParam = 1 }) =>
      eventsApi.getAll({ ...filters, page: pageParam, limit: 12 }),
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    initialPageParam: 1,
  })
}

/** Hook to fetch a single event */
export function useEvent(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.event(id),
    queryFn: () => eventsApi.getById(id),
    enabled: !!id,
  })
}

/** Hook to create an event */
export function useCreateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateEventPayload) => eventsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events })
    },
  })
}

/** Hook to update an event */
export function useUpdateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateEventPayload }) =>
      eventsApi.update(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.event(id) })
    },
  })
}

/** Hook to delete an event */
export function useDeleteEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => eventsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events })
    },
  })
}

/** Hook to register for an event */
export function useRegisterForEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (eventId: string) => eventsApi.register(eventId),
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.event(eventId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events })
    },
  })
}
