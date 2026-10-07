import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId,
  )
}

function getFirebaseAuth() {
  if (!isFirebaseConfigured()) {
    throw new Error(
      'Google sign-in is not configured. Please set VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID, and VITE_FIREBASE_APP_ID in your .env file.',
    )
  }

  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
  return getAuth(app)
}

/**
 * Triggers Google sign-in popup via Firebase Web SDK and mints a fresh ID token.
 */
export async function getGoogleIdToken(): Promise<string> {
  const auth = getFirebaseAuth()
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })

  const credential = await signInWithPopup(auth, provider)
  // Force-refresh or fresh ID token (~1 hour TTL)
  const idToken = await credential.user.getIdToken()
  return idToken
}
