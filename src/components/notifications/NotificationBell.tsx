import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  BellOff,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Loader2,
  Trash2,
} from 'lucide-react'
import {
  useDeleteNotification,
  useMarkAllRead,
  useMarkNotificationRead,
  useNotifications,
  useUnreadCount,
} from '@/hooks/useNotifications'
import { deletePushToken, enablePush, hasPushToken, isPushSupported } from '@/lib/push'
import { useAppContext } from '@/context'
import { useAppStore } from '@/store'
import { cn } from '@/lib/utils'
import { getRelativeTime } from '@/utils'
import type { NotificationListItem } from '@/types'

type PermissionState = NotificationPermission | 'unsupported'

function readPermission(): PermissionState {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported'
  return Notification.permission
}

/**
 * Bell + inbox dropdown for the header.
 *
 * Permission UX hard rule: `Notification.requestPermission()` is only ever
 * triggered by the "Turn on notifications" button inside this panel — never on
 * mount, route change or login.
 */
export function NotificationBell() {
  const navigate = useNavigate()
  const { addToast } = useAppContext()
  const isAuthenticated = useAppStore((state) => state.isAuthenticated)

  const [isOpen, setIsOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [permission, setPermission] = useState<PermissionState>(readPermission)
  const [isEnabling, setIsEnabling] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const limit = 10

  const listQuery = useNotifications(page, limit)
  const unreadQuery = useUnreadCount()
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllRead()
  const deleteNotification = useDeleteNotification()

  const unreadCount = unreadQuery.data?.unreadCount ?? 0
  const items = listQuery.data?.items ?? []
  const pagination = listQuery.data?.pagination
  const pushSupported = isPushSupported()

  const showEnable =
    pushSupported &&
    permission !== 'denied' &&
    (permission === 'default' || (permission === 'granted' && !hasPushToken()))

  // Close on outside click / Escape
  useEffect(() => {
    if (!isOpen) return

    function handleMouseDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleEnable = async () => {
    if (isEnabling) return

    setIsEnabling(true)
    setNotice(null)

    // ⚠️ user gesture: this is the ONLY place requestPermission() is called.
    const result = await enablePush()

    setPermission(readPermission())
    setIsEnabling(false)

    if (result.status === 'enabled') {
      setNotice(null)
      addToast({ message: 'Notifications enabled — you are all set!', type: 'success' })
      unreadQuery.refetch()
      return
    }

    setNotice(
      result.message ||
        (result.status === 'denied'
          ? 'Notifications are blocked in your browser settings.'
          : 'Could not enable notifications.'),
    )
  }

  const handleTurnOff = async () => {
    await deletePushToken()
    setPermission(readPermission())
    setNotice(null)
    addToast({ message: 'Notifications turned off for this device.', type: 'info' })
  }

  const handleOpenItem = (item: NotificationListItem) => {
    if (!item.readAt) {
      markRead.mutate(item.notificationId)
    }

    setIsOpen(false)

    if (item.eventId) {
      navigate(`/events/${item.eventId}`)
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-9 h-9 rounded-full bg-[#141414] border border-neutral-800 hover:border-neutral-700 flex items-center justify-center relative transition-colors"
        aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Bell className="w-4 h-4 text-neutral-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#FF2E4D] text-[10px] leading-none font-bold text-white flex items-center justify-center border border-[#0a0a0a]">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-sm sm:w-96 rounded-2xl bg-[#141414] border border-neutral-800 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-[#FF2E4D]/15 text-[#FF2E4D] text-[10px] font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>
            {isAuthenticated && unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllRead.mutate()}
                disabled={markAllRead.isPending}
                className="flex items-center gap-1 text-[11px] font-medium text-neutral-400 hover:text-white transition-colors disabled:opacity-50"
              >
                <CheckCheck size={13} />
                Mark all read
              </button>
            )}
          </div>

          {/* Push opt-in / blocked notice */}
          {showEnable && (
            <div className="px-4 py-3 border-b border-neutral-800 bg-[#1a1a1a]/70 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FF2E4D]/15 flex items-center justify-center shrink-0">
                <Bell size={15} className="text-[#FF2E4D]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white">Turn on notifications</p>
                <p className="text-[11px] text-neutral-400">
                  {notice ?? 'Event alerts even when the tab is closed.'}
                </p>
              </div>
              <button
                type="button"
                onClick={handleEnable}
                disabled={isEnabling}
                className="shrink-0 px-3 py-1.5 rounded-full bg-[#FF2E4D] hover:bg-[#e02441] text-white text-[11px] font-semibold transition-colors disabled:opacity-60 flex items-center gap-1.5"
              >
                {isEnabling && <Loader2 size={12} className="animate-spin" />}
                Enable
              </button>
            </div>
          )}

          {!showEnable && notice && (
            <p className="px-4 py-2.5 border-b border-neutral-800 text-[11px] text-amber-300 bg-amber-500/5">
              {notice}
            </p>
          )}

          {permission === 'denied' && pushSupported && (
            <div className="px-4 py-3 border-b border-neutral-800 flex items-start gap-2.5">
              <BellOff size={14} className="text-neutral-500 mt-0.5 shrink-0" />
              <p className="text-[11px] text-neutral-400">
                Notifications are blocked in your browser settings — allow them for this site to
                receive event alerts.
              </p>
            </div>
          )}

          {/* Inbox list */}
          <div className="max-h-80 overflow-y-auto">
            {!isAuthenticated ? (
              <div className="px-4 py-8 text-center">
                <Inbox size={22} className="mx-auto text-neutral-600 mb-2" />
                <p className="text-xs text-neutral-400">Sign in to view your notifications.</p>
              </div>
            ) : listQuery.isLoading ? (
              <div className="px-4 py-6 space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="animate-pulse flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-neutral-800" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-2/3 rounded bg-neutral-800" />
                      <div className="h-3 w-1/2 rounded bg-neutral-800/70" />
                    </div>
                  </div>
                ))}
              </div>
            ) : listQuery.isError ? (
              <div className="px-4 py-8 text-center">
                <p className="text-xs text-neutral-400">Could not load notifications.</p>
                <button
                  type="button"
                  onClick={() => listQuery.refetch()}
                  className="mt-2 text-[11px] font-semibold text-[#FF2E4D] hover:text-[#e02441]"
                >
                  Try again
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Inbox size={22} className="mx-auto text-neutral-600 mb-2" />
                <p className="text-xs font-medium text-neutral-300">You&apos;re all caught up</p>
                <p className="text-[11px] text-neutral-500 mt-1">
                  New events and updates will show up here.
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.notificationId} className="relative border-b border-neutral-800/60">
                  <button
                    type="button"
                    onClick={() => handleOpenItem(item)}
                    className={cn(
                      'w-full text-left pl-4 pr-10 py-3 flex gap-3 transition-colors hover:bg-neutral-800/40',
                      !item.readAt && 'bg-[#FF2E4D]/[0.05]',
                    )}
                  >
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt=""
                        className="w-8 h-8 rounded-lg object-cover shrink-0 border border-neutral-800"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0">
                        <Bell size={13} className="text-neutral-400" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        {!item.readAt && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E4D] shrink-0" />
                        )}
                        <p
                          className={cn(
                            'text-xs text-neutral-100 truncate',
                            !item.readAt && 'font-semibold',
                          )}
                        >
                          {item.title}
                        </p>
                      </div>
                      <p className="text-[11px] text-neutral-400 line-clamp-2 mt-0.5">
                        {item.body}
                      </p>
                      <p className="text-[10px] text-neutral-500 mt-1">
                        {getRelativeTime(item.createdAt)}
                      </p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteNotification.mutate(item.notificationId)}
                    disabled={deleteNotification.isPending}
                    className="absolute right-2.5 top-3 p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                    aria-label={`Delete notification: ${item.title}`}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {isAuthenticated && pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-2 border-t border-neutral-800 text-[11px] text-neutral-400">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page <= 1}
                className="flex items-center gap-1 hover:text-white transition-colors disabled:opacity-40 disabled:hover:text-neutral-400"
              >
                <ChevronLeft size={13} /> Prev
              </button>
              <span>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((prev) => Math.min(pagination.totalPages, prev + 1))}
                disabled={page >= pagination.totalPages}
                className="flex items-center gap-1 hover:text-white transition-colors disabled:opacity-40 disabled:hover:text-neutral-400"
              >
                Next <ChevronRight size={13} />
              </button>
            </div>
          )}

          {/* Turn off */}
          {pushSupported && permission === 'granted' && hasPushToken() && (
            <div className="flex justify-end px-4 py-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={handleTurnOff}
                className="flex items-center gap-1.5 text-[11px] text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                <BellOff size={12} />
                Turn off notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
