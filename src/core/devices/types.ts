export interface Device {
  key: string
  name: string
  os: string | null
  updatedAt: number | null
  createdAt: number | null
  deviceRegistrationToken: string | null
}

export interface ReceivedNotification {
  title: string | null
  body: string | null
  icon: string | null
  link: string | null
}

export type DeviceRecord = Omit<Device, 'key'>
