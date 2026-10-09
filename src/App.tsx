import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AppProvider, useAppContext } from '@/context'
import { router } from '@/routes'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { Preloader } from '@/components/layout/Preloader'
import { bootstrapPush, isPushSupported, onForegroundPush } from '@/lib/push'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,       // 5 minutes
      gcTime: 30 * 60 * 1000,          // 30 minutes (formerly cacheTime)
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

/**
 * Web push bridge — registers the FCM service worker once (secure contexts
 * only) and surfaces foreground messages as toasts. Lives inside the providers
 * so it can reach the toast system and the query cache.
 */
function PushNotificationBridge() {
  const { addToast } = useAppContext()
  const queryClient = useQueryClient()

  // Register /firebase-messaging-sw.js once, then silently refresh an
  // already-granted token (a silent call never shows a permission prompt).
  // bootstrapPush() is memoised, so StrictMode's double-invoke is harmless.
  useEffect(() => {
    if (!isPushSupported()) return
    void bootstrapPush()
  }, [])

  // Messages arriving while the tab is focused are NOT auto-displayed.
  useEffect(() => {
    let unsubscribe: (() => void) | undefined
    let cancelled = false

    void onForegroundPush((payload) => {
      const data = payload.data ?? {}
      const title = payload.notification?.title || data.title || 'Kolkata Diary'
      const body = payload.notification?.body || data.body || ''
      const link = data.link || (data.eventId ? `/events/${data.eventId}` : '/events')

      // Jump the bell badge immediately
      void queryClient.invalidateQueries({ queryKey: ['notifications'] })

      addToast({
        type: 'info',
        message: body ? `${title} — ${body}` : title,
        onClick: () => {
          void router.navigate(link)
        },
      })
    }).then((handle) => {
      if (cancelled) {
        handle()
      } else {
        unsubscribe = handle
      }
    })

    return () => {
      cancelled = true
      unsubscribe?.()
    }
  }, [addToast, queryClient])

  return null
}

export function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <Preloader />
          <PushNotificationBridge />
          <RouterProvider router={router} />
        </AppProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
