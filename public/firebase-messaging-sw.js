/**
 * Firebase Cloud Messaging background service worker (Kolkata Diary web app).
 *
 * This file lives in `public/`, so Vite copies it to the build output VERBATIM.
 * `import.meta.env` is a Vite *build-time* module construct and is therefore
 * NOT available here — a `public/` file is never parsed as a module and is
 * served as a classic worker script.
 *
 * The Firebase config is resolved from, in order:
 *   1. Query-string parameters injected at registration time by
 *      `registerServiceWorker()` in `src/lib/push.ts`
 *      (e.g. `/firebase-messaging-sw.js?apiKey=…&projectId=…`) — this is the
 *      primary path and keeps a single source of truth: the VITE_FIREBASE_*
 *      values in .env.
 *   2. The hardcoded `FIREBASE_CONFIG` constant below — a fallback for
 *      operators who prefer to bake the values in.
 *
 * NOTE: a Firebase *web* config is public by design (it ships inside the app
 * bundle), so neither mechanism leaks a secret. The private key never touches
 * the browser — pushes are signed server-side by the API.
 */

// firebase@12.19.0 compat bundles (must match the installed `firebase` version).
importScripts('https://www.gstatic.com/firebasejs/12.19.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/12.19.0/firebase-messaging-compat.js')

/** Hardcoded fallback config — keep in sync with the VITE_FIREBASE_* env keys. */
const FIREBASE_CONFIG = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  appId: '',
  messagingSenderId: '',
}

/** Parse `?key=value` pairs from the SW script URL (injected by the page). */
function configFromQuery() {
  const query = new URLSearchParams(self.location.search)
  const config = {}
  Object.keys(FIREBASE_CONFIG).forEach((key) => {
    const value = query.get(key)
    if (value) {
      config[key] = value
    }
  })
  return config
}

const firebaseConfig = Object.assign({}, FIREBASE_CONFIG, configFromQuery())

function showBackgroundNotification(payload) {
  const data = payload && payload.data ? payload.data : {}
  const notification = (payload && payload.notification) || {}

  const title = notification.title || data.title || 'Kolkata Diary'
  const body = notification.body || data.body || ''

  self.registration.showNotification(title, {
    body: body,
    icon: '/logo.png',
    badge: '/logo.png',
    // Collapse duplicates of the same event/notification.
    tag: data.eventId || data.notificationId || 'kolkata-diary',
    data: data,
  })
}

// Background (tab minimised / closed) — the browser does NOT auto-display
// FCM data messages, so we always build the notification ourselves.
// Guarded so an unconfigured/empty config cannot break the worker install
// (the inbox UI keeps working without push).
try {
  firebase.initializeApp(firebaseConfig)
  firebase.messaging().onBackgroundMessage(showBackgroundNotification)
} catch (error) {
  console.error(
    '[push] Firebase could not initialise in the service worker — set VITE_FIREBASE_* and VITE_FIREBASE_VAPID_KEY in .env.',
    error,
  )
}

// Click → close the notification and open the deep link
// (`data.link` is a relative path such as `/events/EVT-XXXX-1234`, resolved
// against this app's own origin).
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const data = event.notification.data || {}
  const rawLink = typeof data.link === 'string' && data.link ? data.link : '/events'
  const targetUrl = new URL(rawLink, self.location.origin).href

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      const existing = windowClients.find((client) => client.url === targetUrl)
      if (existing && 'focus' in existing) {
        return existing.focus()
      }
      return clients.openWindow(targetUrl)
    }),
  )
})
