const DEVICE_UUID_COOKIE = 'deviceUuid'
const DEVICE_UUID_TTL_DAYS = 1825

export function parseCookies(cookieHeader: string): Record<string, string> {
  return Object.fromEntries(
    cookieHeader
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const separator = part.indexOf('=')
        return separator === -1
          ? [part, '']
          : [part.slice(0, separator), part.slice(separator + 1)]
      }),
  )
}

export function readDeviceUuid(): string | null {
  return parseCookies(document.cookie)[DEVICE_UUID_COOKIE] ?? null
}

export function writeDeviceUuid(uuid: string): void {
  const expires = new Date(Date.now() + DEVICE_UUID_TTL_DAYS * 24 * 60 * 60 * 1000)
  document.cookie = `${DEVICE_UUID_COOKIE}=${uuid}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`
}

export function eraseDeviceUuid(): void {
  document.cookie = `${DEVICE_UUID_COOKIE}=; expires=${new Date(0).toUTCString()}; path=/; SameSite=Lax`
}
