import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { eventsApi } from '@/api/events'
import type { CreateEventPayload, EventFilters, UpdateEventPayload } from '@/types'

const QUERY_KEYS = {
  events: ['events'] as const,
  adminEvents: ['admin', 'events'] as const,
  event: (id: string) => ['events', id] as const,
}

/** Hook to fetch paginated public events */
export function useEvents(filters: EventFilters = {}, enabled = true) {
  return useQuery({
    queryKey: [...QUERY_KEYS.events, filters],
    queryFn: () => eventsApi.getAll(filters),
    enabled,
    staleTime: 5 * 60 * 1000,
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

/** Hook to fetch a single public event */
export function useEvent(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.event(id),
    queryFn: () => eventsApi.getById(id),
    enabled: !!id,
  })
}

/** Hook to fetch the admin event list (all statuses) */
export function useAdminEvents(filters: EventFilters = {}) {
  return useQuery({
    queryKey: [...QUERY_KEYS.adminEvents, filters],
    queryFn: () => eventsApi.adminList(filters),
    enabled: true,
  })
}

/** Hook to fetch a single event from the admin API */
export function useAdminEvent(id: string | null) {
  return useQuery({
    queryKey: [...QUERY_KEYS.adminEvents, 'detail', id],
    queryFn: () => eventsApi.adminGetById(id as string),
    enabled: !!id,
  })
}

/** Hook to create an event (admin) */
export function useCreateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ payload, image }: { payload: CreateEventPayload; image?: File }) =>
      eventsApi.create(payload, image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminEvents })
    },
  })
}

/** Hook to update an event (admin) */
export function useUpdateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
      image,
    }: {
      id: string
      payload: UpdateEventPayload
      image?: File
    }) => eventsApi.update(id, payload, image),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events })
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.adminEvents, 'detail', id] })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminEvents })
    },
  })
}

/** Hook to delete an event (admin) */
export function useDeleteEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => eventsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.events })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.adminEvents })
    },
  })
}
