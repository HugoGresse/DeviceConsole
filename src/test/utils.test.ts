import { describe, expect, it } from 'vitest'

import { parseCookies } from '../core/utils/cookies'
import { describeDevice } from '../core/utils/device-name'
import { formatRelativeTime } from '../core/utils/relative-time'
import { toDeviceList } from '../core/devices/device-mapper'

describe('parseCookies', () => {
  it('parses names and values, trimming surrounding spaces', () => {
    expect(parseCookies('a=1; deviceUuid=abc-123 ; b=2')).toEqual({
      a: '1',
      deviceUuid: 'abc-123',
      b: '2',
    })
  })

  it('keeps "=" characters inside the value', () => {
    expect(parseCookies('token=a=b=c')).toEqual({ token: 'a=b=c' })
  })

  it('returns an empty object for an empty cookie header', () => {
    expect(parseCookies('')).toEqual({})
  })
})

describe('describeDevice', () => {
  it('prefers userAgentData and skips the "Not A;Brand" placeholder', () => {
    expect(
      describeDevice('irrelevant', {
        platform: 'macOS',
        brands: [{ brand: 'Not.A/Brand', version: '99' }, { brand: 'Chromium', version: '140' }],
      }),
    ).toEqual({ name: 'Chromium macOS', os: 'macOS' })
  })

  it('falls back to user agent sniffing', () => {
    const userAgent =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36'
    expect(describeDevice(userAgent)).toEqual({ name: 'Chrome macOS', os: 'macOS' })
  })

  it('detects Edge before Chrome', () => {
    expect(describeDevice('Mozilla/5.0 Chrome/140.0 Safari/537.36 Edg/140.0').name).toContain('Edge')
  })
})

describe('formatRelativeTime', () => {
  const now = Date.UTC(2026, 0, 15, 12, 0, 0)

  it('formats a past timestamp', () => {
    expect(formatRelativeTime(now - 2 * 60 * 60 * 1000, now)).toBe('2 hours ago')
  })

  it('formats a future timestamp', () => {
    expect(formatRelativeTime(now + 3 * 24 * 60 * 60 * 1000, now)).toBe('in 3 days')
  })

  it('falls back to seconds below the smallest unit', () => {
    expect(formatRelativeTime(now - 200, now)).toBe('now')
  })
})

describe('toDeviceList', () => {
  it('returns an empty list when the snapshot is null', () => {
    expect(toDeviceList(null)).toEqual([])
  })

  it('promotes the child key and defaults missing fields', () => {
    expect(toDeviceList({ 'uuid-1': { name: 'Laptop', updatedAt: 42 } })).toEqual([
      {
        key: 'uuid-1',
        name: 'Laptop',
        os: null,
        updatedAt: 42,
        createdAt: null,
        deviceRegistrationToken: null,
      },
    ])
  })

  it('falls back to the key when the device has no name', () => {
    expect(toDeviceList({ 'uuid-2': {} })[0]?.name).toBe('uuid-2')
  })
})
