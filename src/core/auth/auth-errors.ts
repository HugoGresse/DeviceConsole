const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/popup-closed-by-user': 'Popup closed',
  'auth/cancelled-popup-request': 'Popup closed',
  'auth/popup-blocked': 'The sign-in popup was blocked by the browser',
  'auth/invalid-email': 'That email address is not valid',
  'auth/missing-password': 'Enter your password',
  'auth/invalid-credential': 'Wrong email or password',
  'auth/user-not-found': 'Wrong email or password',
  'auth/wrong-password': 'Wrong email or password',
  'auth/user-disabled': 'This account has been disabled',
  'auth/email-already-in-use': 'An account already exists for that email',
  'auth/weak-password': 'Passwords must be at least 6 characters',
  'auth/too-many-requests': 'Too many attempts, try again later',
  'auth/network-request-failed': 'Network error, check your connection',
}

const GENERIC_MESSAGE = 'Something went wrong, try again'

// The SDK stringifies unmapped failures as `Firebase: Error (auth/some-code).`, which leaks the
// raw code into the UI, so anything still carrying that shape falls back to the generic message.
const RAW_SDK_MESSAGE = /^Firebase:/

export function describeAuthError(error: unknown): string {
  const { code, message } = (error ?? {}) as { code?: string; message?: string }
  if (code && AUTH_ERROR_MESSAGES[code]) return AUTH_ERROR_MESSAGES[code]
  if (!message || RAW_SDK_MESSAGE.test(message)) return GENERIC_MESSAGE
  return message
}
