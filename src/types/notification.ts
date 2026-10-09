/** Notification kind — mirrors the API's `notification.type` enum */
export type NotificationKind = 'new_event' | 'manual'

/** Inbox row returned by `GET /notifications` */
export interface NotificationListItem {
  id: number
  notificationId: string
  title: string
  body: string
  imageUrl: string | null
  eventId: string | null
  type: NotificationKind
  readAt: string | null
  createdAt: string
}

/** Pagination meta (same shape as the engagement endpoints) */
export interface NotificationPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

/** `data` payload of `GET /notifications` */
export interface NotificationsListResponse {
  items: NotificationListItem[]
  unreadCount: number
  pagination: NotificationPagination
}

/** `data` payload of `GET /notifications/unread-count` */
export interface UnreadCountResponse {
  unreadCount: number
}

/** `data` payload of `PATCH /notifications/:notificationId/read` */
export interface MarkNotificationReadResponse {
  readAt: string
}

/** `data` payload of `POST /notifications/read-all` */
export interface MarkAllNotificationsReadResponse {
  updated: number
}

/** `data` payload of `DELETE /notifications/:notificationId` */
export interface DeleteNotificationResponse {
  removed: boolean
}

/** Body of `POST /devices/register` (public endpoint) */
export interface RegisterDevicePayload {
  token: string
  deviceId?: string
  platform?: 'web' | 'android' | 'ios' | 'desktop'
  appVersion?: string
  userAgent?: string
}

/** `data.device` of `POST /devices/register` */
export interface PushDeviceRecord {
  deviceId: string
  status: 'active' | 'inactive'
  linkedToUser: boolean
  createdAt: string
}

/** `data` payload of `POST /devices/unregister` */
export interface UnregisterDeviceResponse {
  matched: boolean
}
