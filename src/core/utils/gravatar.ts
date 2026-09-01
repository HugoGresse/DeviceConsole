export async function gravatarUrl(email: string): Promise<string> {
  const normalized = email.trim().toLowerCase()
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(normalized))
  const hash = Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
  return `https://www.gravatar.com/avatar/${hash}`
}
