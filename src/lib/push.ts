import type { MessagePayload } from 'firebase/messaging'
import { devicesApi } from '@/api/notifications'
import { getFirebaseApp, isPushConfigured } from './firebase'

/**
 * `firebase/messaging` is imported lazily so the initial bundle stays lean —
 * the chunk is only fetched on secure contexts where push is supported (the
 * production origin is plain HTTP, where it is never downloaded at all).
 */
async function loadMessaging() {
  return import('firebase/messaging')
}

/** localStorage key holding the server-issued device id (stable re-registration) */
export const PUSH_DEVICE_ID_KEY = 'push_device_id'
/** localStorage key holding the FCM token, so logout/turn-off can unregister it */
export const PUSH_TOKEN_KEY = 'push_token'

const USER_AGENT_MAX = 255

export interface EnablePushResult {
  status: 'enabled' | 'denied' | 'dismissed' | 'unsupported' | 'error'
  message?: string
}

/**
 * True when Web Push can work here: push config present, Service Worker +
 * Notification APIs available, and a secure context (HTTPS or localhost).
 * Synchronous so it can gate effects without flashing UI.
 */
export function isPushSupported(): boolean {
  return isPushConfigured()
}

/** True when this browser already holds a locally stored FCM token */
export function hasPushToken(): boolean {
  try {
    return Boolean(localStorage.getItem(PUSH_TOKEN_KEY))
  } catch {
    return false
  }
}

/**
 * The service worker URL, with the Firebase config injected as query params.
 *
 * `public/` files are copied verbatim by Vite, so the SW cannot read
 * `import.meta.env`. Passing the (public-by-design) web config on the script
 * URL keeps a single source of truth — the VITE_FIREBASE_* env keys — while the
 * SW file itself keeps an empty `FIREBASE_CONFIG` constant as a fallback.
 */
function buildServiceWorkerUrl(): string {
  const params = new URLSearchParams()
  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  }

  Object.entries(config).forEach(([key, value]) => {
    if (value) params.set(key, value)
  })

  const query = params.toString()
  return query ? `/firebase-messaging-sw.js?${query}` : '/firebase-messaging-sw.js'
}

/**
 * Register `/firebase-messaging-sw.js` with `{ scope: '/' }` (idempotent).
 * Never throws — push simply stays unavailable if registration fails.
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!isPushSupported()) return null

  try {
    const registration = await navigator.serviceWorker.register(buildServiceWorkerUrl(), {
      scope: '/',
    })
    return registration
  } catch (error) {
    console.warn('[push] service worker registration failed:', error)
    return null
  }
}

/** Registration used by getToken()/deleteToken() — reuses the existing one when present */
async function getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) return null

  try {
    const existing = await navigator.serviceWorker.getRegistration()
    if (existing) return existing
    return await registerServiceWorker()
  } catch {
    return null
  }
}

let bootstrapPromise: Promise<void> | null = null

/**
 * One-time page-load bootstrap: register the service worker and silently
 * refresh a token that is already granted (a silent call never prompts).
 *
 * Memoised so React StrictMode's double-invoked effect cannot register twice
 * or fire duplicate `POST /devices/register` requests.
 */
export function bootstrapPush(): Promise<void> {
  if (!bootstrapPromise) {
    bootstrapPromise = (async () => {
      const registration = await registerServiceWorker()
      if (!registration) {
        bootstrapPromise = null // allow a retry on the next mount
        return
      }

      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        await syncPushToken()
      }
    })()
  }

  return bootstrapPromise
}

/** Mint an FCM token for this browser, or null when unsupported */
async function issueToken(): Promise<string | null> {
  const { getMessaging, getToken, isSupported } = await loadMessaging()
  if (!(await isSupported())) return null

  const serviceWorkerRegistration = await getServiceWorkerRegistration()
  if (!serviceWorkerRegistration) return null

  const messaging = getMessaging(getFirebaseApp())
  return getToken(messaging, {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration,
  })
}

/** Upsert the token on the API and persist the ids we get back */
async function registerDevice(token: string): Promise<void> {
  const storedDeviceId = localStorage.getItem(PUSH_DEVICE_ID_KEY) ?? undefined

  const device = await devicesApi.register({
    token,
    deviceId: storedDeviceId,
    platform: 'web',
    userAgent: navigator.userAgent.slice(0, USER_AGENT_MAX),
  })

  if (device?.deviceId) {
    localStorage.setItem(PUSH_DEVICE_ID_KEY, device.deviceId)
  }
  localStorage.setItem(PUSH_TOKEN_KEY, token)
}

/**
 * Request permission, obtain a token and register the device.
 *
 * ⚠️ HARD RULE: `Notification.requestPermission()` may only ever be called from
 * a user-gesture handler — this function must be invoked from a click handler
 * (the "Turn on notifications" button), never on load, route change or login.
 */
export async function enablePush(): Promise<EnablePushResult> {
  if (!isPushSupported()) {
    return {
      status: 'unsupported',
      message: 'Push notifications are not supported on this connection. HTTPS is required.',
    }
  }

  let permission: NotificationPermission
  try {
    permission = await Notification.requestPermission()
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Permission request failed.',
    }
  }

  if (permission === 'denied') {
    return {
      status: 'denied',
      message: 'Notifications are blocked in your browser settings.',
    }
  }
  if (permission !== 'granted') {
    return { status: 'dismissed', message: 'Permission was not granted.' }
  }

  try {
    const token = await issueToken()
    if (!token) {
      return { status: 'error', message: 'Could not create a push token for this device.' }
    }
    await registerDevice(token)
    return { status: 'enabled' }
  } catch (error) {
    console.warn('[push] enable failed:', error)
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Could not enable notifications.',
    }
  }
}

/**
 * Silently refresh the token and (re)link it to the signed-in user.
 * Safe to call on load: no permission prompt is ever shown by this path (it
 * returns immediately unless permission is already `granted`).
 */
export async function syncPushToken(): Promise<void> {
  try {
    if (!isPushSupported()) return
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return

    const token = await issueToken()
    if (!token) return

    await registerDevice(token)
  } catch (error) {
    // Silent by design — this runs on load / after login and must never surface.
    console.warn('[push] token sync skipped:', error)
  }
}

/**
 * Deactivate the registered device on the API (logout). Permission is left
 * untouched; the row goes `inactive` with reason `logout`.
 */
export async function unregisterPushToken(): Promise<void> {
  try {
    const token = localStorage.getItem(PUSH_TOKEN_KEY)
    if (!token) return

    await devicesApi.unregister(token)
    localStorage.removeItem(PUSH_TOKEN_KEY)
  } catch (error) {
    // Keep the token so a later logout/turn-off can retry; stale-token hygiene
    // on the API side is the backstop if this never succeeds.
    console.warn('[push] device unregister failed:', error)
  }
}

/**
 * Explicit "Turn off": unregister the device AND delete the local FCM token.
 * Browser permission stays as-is (browsers cannot be re-prompted once decided).
 */
export async function deletePushToken(): Promise<void> {
  try {
    const token = localStorage.getItem(PUSH_TOKEN_KEY)
    if (token) {
      await devicesApi.unregister(token)
    }
  } catch (error) {
    console.warn('[push] device unregister failed:', error)
  }

  try {
    if (isPushSupported() && Notification.permission === 'granted') {
      const { deleteToken, getMessaging, isSupported } = await loadMessaging()
      if (await isSupported()) {
        await deleteToken(getMessaging(getFirebaseApp()))
      }
    }
  } catch (error) {
    console.warn('[push] token delete failed:', error)
  }

  try {
    localStorage.removeItem(PUSH_TOKEN_KEY)
    localStorage.removeItem(PUSH_DEVICE_ID_KEY)
  } catch {
    /* storage unavailable */
  }
}

/**
 * Subscribe to messages arriving while the tab is focused — the browser does
 * NOT display these automatically. Returns an unsubscribe function.
 */
export async function onForegroundPush(
  callback: (payload: MessagePayload) => void,
): Promise<() => void> {
  try {
    if (!isPushSupported()) return () => {}

    const { getMessaging, isSupported, onMessage } = await loadMessaging()
    if (!(await isSupported())) return () => {}

    return onMessage(getMessaging(getFirebaseApp()), callback)
  } catch (error) {
    console.warn('[push] foreground listener skipped:', error)
    return () => {}
  }
}
