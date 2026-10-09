import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notificationsApi } from '@/api/notifications'
import { useAppStore } from '@/store'
import type { NotificationsListResponse, UnreadCountResponse } from '@/types'

/** Fetch the signed-in user's inbox (paginated) */
export function useNotifications(page = 1, limit = 20) {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated)

  return useQuery<NotificationsListResponse, Error>({
    queryKey: ['notifications', page, limit],
    queryFn: () => notificationsApi.list(page, limit),
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
  })
}

/** Unread badge count (polled every minute, invalidated on every push/mutation) */
export function useUnreadCount() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated)

  return useQuery<UnreadCountResponse, Error>({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notificationsApi.unreadCount(),
    enabled: isAuthenticated,
    refetchInterval: 60_000,
    staleTime: 30 * 1000,
  })
}

/** Mark a single notification as read */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (notificationId: string) => notificationsApi.markRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

/** Mark every unread notification as read */
export function useMarkAllRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

/** Soft-delete a notification */
export function useDeleteNotification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (notificationId: string) => notificationsApi.remove(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}
