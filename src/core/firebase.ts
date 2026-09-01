import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'
import { getMessaging, isSupported as isMessagingSupported, type Messaging } from 'firebase/messaging'
import { getAnalytics, isSupported as isAnalyticsSupported, logEvent } from 'firebase/analytics'

export const firebaseApp = initializeApp({
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_DATABASE_URL,
  projectId: import.meta.env.VITE_PROJECT_ID,
  appId: import.meta.env.VITE_APPID,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
})

export const firebaseAuth = getAuth(firebaseApp)
export const firebaseDb = getDatabase(firebaseApp)

let messagingPromise: Promise<Messaging | null> | null = null

export function getMessagingIfSupported(): Promise<Messaging | null> {
  messagingPromise ??= isMessagingSupported().then((supported) =>
    supported ? getMessaging(firebaseApp) : null,
  )
  return messagingPromise
}

export async function trackEvent(name: string): Promise<void> {
  if (!import.meta.env.VITE_MEASUREMENT_ID || !(await isAnalyticsSupported())) return
  logEvent(getAnalytics(firebaseApp), name)
}
