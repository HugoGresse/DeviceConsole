import type { Device, DeviceRecord } from './types'

export function toDeviceList(snapshot: Record<string, Partial<DeviceRecord>> | null): Device[] {
  if (!snapshot) return []
  return Object.entries(snapshot).map(([key, value]) => ({
    key,
    name: value.name ?? key,
    os: value.os ?? null,
    updatedAt: value.updatedAt ?? null,
    createdAt: value.createdAt ?? null,
    deviceRegistrationToken: value.deviceRegistrationToken ?? null,
  }))
}
