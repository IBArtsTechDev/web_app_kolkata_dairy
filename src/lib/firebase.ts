import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'

/**
 * Firebase is used in this app for ONE thing: push notifications (FCM).
 * There is no Google sign-in — nothing here touches Firebase Authentication,
 * only Cloud Messaging.
 *
 * All six VITE_FIREBASE_* values are kept: apiKey / authDomain / projectId /
 * appId identify the app for `getToken()`, messagingSenderId + the VAPID key
 * are the Web Push credentials.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  // Required by Firebase Cloud Messaging (FCM) getToken()
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
}

export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId,
  )
}

let appInstance: FirebaseApp | null = null

/**
 * Single shared Firebase app instance — every Firebase SDK (Messaging) MUST
 * reuse the same app (initialising a second one throws `app/duplicate-app`).
 *
 * Memoised: first call initialises (or adopts an already-initialised app),
 * subsequent calls return the cached instance.
 */
export function getFirebaseApp(): FirebaseApp {
  if (appInstance) return appInstance
  appInstance = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
  return appInstance
}

/**
 * True when Web Push can actually work in this browser:
 * push-specific config present + service worker support + Notification API +
 * secure context (HTTPS or localhost).
 *
 * Note: this checks the push config (apiKey, projectId, messagingSenderId and
 * the VAPID key), which is a stricter requirement than `isFirebaseConfigured()`
 * (app initialisation alone needs no sender id or VAPID key).
 */
export function isPushConfigured(): boolean {
  if (typeof window === 'undefined') return false

  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.projectId &&
      firebaseConfig.messagingSenderId &&
      import.meta.env.VITE_FIREBASE_VAPID_KEY &&
      'serviceWorker' in navigator &&
      'Notification' in window &&
      window.isSecureContext,
  )
}
