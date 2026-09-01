/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_KEY: string
  readonly VITE_AUTH_DOMAIN: string
  readonly VITE_DATABASE_URL: string
  readonly VITE_PROJECT_ID: string
  readonly VITE_APPID: string
  readonly VITE_MESSAGING_SENDER_ID: string
  readonly VITE_VAPID_KEY: string
  readonly VITE_NOTIFY_URL: string
  readonly VITE_MEASUREMENT_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
