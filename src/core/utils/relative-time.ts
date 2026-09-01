const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 365 * 24 * 60 * 60 * 1000],
  ['month', 30 * 24 * 60 * 60 * 1000],
  ['day', 24 * 60 * 60 * 1000],
  ['hour', 60 * 60 * 1000],
  ['minute', 60 * 1000],
  ['second', 1000],
]

const relativeFormatter = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })

export function formatRelativeTime(timestamp: number, now: number = Date.now()): string {
  const elapsed = timestamp - now
  const magnitude = Math.abs(elapsed)

  for (const [unit, ms] of UNITS) {
    if (magnitude >= ms) return relativeFormatter.format(Math.round(elapsed / ms), unit)
  }
  return relativeFormatter.format(0, 'second')
}

export function formatAbsoluteTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
