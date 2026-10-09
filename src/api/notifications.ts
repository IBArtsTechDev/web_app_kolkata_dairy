import { apiClient, resolveAssetUrl } from './client'
import type {
  ApiResponse,
  DeleteNotificationResponse,
  MarkAllNotificationsReadResponse,
  MarkNotificationReadResponse,
  NotificationListItem,
  NotificationsListResponse,
  PushDeviceRecord,
  RegisterDevicePayload,
  UnreadCountResponse,
  UnregisterDeviceResponse,
} from '@/types'

/** Fill in defaults so a malformed/empty payload never crashes the inbox UI */
function sanitizeNotificationList(
  data?: NotificationsListResponse,
): NotificationsListResponse {
  if (!data?.items) {
    return {
      items: [],
      unreadCount: data?.unreadCount ?? 0,
      pagination: data?.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 },
    }
  }

  const items: NotificationListItem[] = data.items.map((item) => ({
    ...item,
    imageUrl: resolveAssetUrl(item.imageUrl) ?? null,
  }))

  return { items, unreadCount: data.unreadCount ?? 0, pagination: data.pagination }
}

export const notificationsApi = {
  /** Paginated inbox list (also returns the unread badge count) */
  list: async (page = 1, limit = 20, unreadOnly = false): Promise<NotificationsListResponse> => {
    const { data } = await apiClient.get<ApiResponse<NotificationsListResponse>>('/notifications', {
      params: { page, limit, unreadOnly },
    })
    return sanitizeNotificationList(data.data)
  },

  /** Indexed unread count used by the bell badge */
  unreadCount: async (): Promise<UnreadCountResponse> => {
    const { data } = await apiClient.get<ApiResponse<UnreadCountResponse>>(
      '/notifications/unread-count',
    )
    return data.data ?? { unreadCount: 0 }
  },

  /** Mark a single notification as read (public `notificationId`, idempotent) */
  markRead: async (notificationId: string): Promise<MarkNotificationReadResponse> => {
    const { data } = await apiClient.patch<ApiResponse<MarkNotificationReadResponse>>(
      `/notifications/${encodeURIComponent(notificationId)}/read`,
    )
    return data.data ?? { readAt: new Date().toISOString() }
  },

  /** Mark every unread notification as read */
  markAllRead: async (): Promise<MarkAllNotificationsReadResponse> => {
    const { data } = await apiClient.post<ApiResponse<MarkAllNotificationsReadResponse>>(
      '/notifications/read-all',
    )
    return data.data ?? { updated: 0 }
  },

  /** Soft-delete a single notification */
  remove: async (notificationId: string): Promise<DeleteNotificationResponse> => {
    const { data } = await apiClient.delete<ApiResponse<DeleteNotificationResponse>>(
      `/notifications/${encodeURIComponent(notificationId)}`,
    )
    return data.data ?? { removed: true }
  },
}

export const devicesApi = {
  /**
   * Register (upsert) an FCM token. Public endpoint — `userId` is attached
   * server-side whenever a valid Bearer token is present.
   */
  register: async (payload: RegisterDevicePayload): Promise<PushDeviceRecord> => {
    const { data } = await apiClient.post<ApiResponse<{ device: PushDeviceRecord }>>(
      '/devices/register',
      payload,
    )
    if (!data.data?.device) {
      throw new Error(data.message || 'Failed to register device')
    }
    return data.data.device
  },

  /** Deactivate a token (logout / turn off). Idempotent, never throws a 404 */
  unregister: async (token: string): Promise<UnregisterDeviceResponse> => {
    const { data } = await apiClient.post<ApiResponse<UnregisterDeviceResponse>>(
      '/devices/unregister',
      { token },
    )
    return data.data ?? { matched: false }
  },
}
