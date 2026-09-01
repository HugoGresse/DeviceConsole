import { getToken, onMessage } from 'firebase/messaging'

import { getMessagingIfSupported, trackEvent } from '../firebase'
import { eraseDeviceUuid, readDeviceUuid, writeDeviceUuid } from '../utils/cookies'
import { removeDevice, subscribeToDevices, updateDevice } from './device-sync'
import {
  currentDeviceUuidChanged,
  devicesUnloaded,
  errorRaised,
  notificationReceived,
  notificationSendFinished,
  notificationSendStarted,
} from './devices-slice'
import type { Device } from './types'
import type { AppDispatch } from '../store'

const messageOf = (error: unknown) =>
  error instanceof Error ? error.message : String(error)

export function loadDevices(uid: string) {
  return (dispatch: AppDispatch): (() => void) => {
    const unsubscribe = subscribeToDevices(uid, dispatch)
    return () => {
      unsubscribe()
      dispatch(devicesUnloaded())
    }
  }
}

export function registerDevice(uid: string, name: string, os: string) {
  return async (dispatch: AppDispatch): Promise<void> => {
    const deviceUuid = crypto.randomUUID()
    writeDeviceUuid(deviceUuid)
    dispatch(currentDeviceUuidChanged(deviceUuid))

    try {
      await updateDevice(uid, deviceUuid, { name, os })
      await dispatch(refreshMessagingToken(uid))
    } catch (error) {
      dispatch(errorRaised(messageOf(error)))
    }
  }
}

export function renameDevice(uid: string, key: string, name: string) {
  return async (dispatch: AppDispatch): Promise<void> => {
    try {
      await updateDevice(uid, key, { name })
    } catch (error) {
      dispatch(errorRaised(messageOf(error)))
    }
  }
}

export function deleteDevice(uid: string, device: Device) {
  return async (dispatch: AppDispatch): Promise<void> => {
    if (readDeviceUuid() === device.key) {
      eraseDeviceUuid()
      dispatch(currentDeviceUuidChanged(null))
    }
    try {
      await removeDevice(uid, device.key)
    } catch (error) {
      dispatch(errorRaised(messageOf(error)))
    }
  }
}

export function sendNotification(device: Device, message: string) {
  return async (dispatch: AppDispatch): Promise<void> => {
    void trackEvent('sendNotification')
    dispatch(notificationSendStarted(device.key))
    try {
      const response = await fetch(import.meta.env.VITE_NOTIFY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: device.deviceRegistrationToken,
          title: message,
          link: message,
        }),
      })
      if (!response.ok) throw new Error(`Notification failed (${response.status})`)
    } catch (error) {
      dispatch(errorRaised(messageOf(error)))
    } finally {
      dispatch(notificationSendFinished(device.key))
    }
  }
}

export function refreshMessagingToken(uid: string) {
  return async (dispatch: AppDispatch): Promise<void> => {
    const deviceUuid = readDeviceUuid()
    if (!deviceUuid) return

    // An unsupported browser is explained in place by the registration modal, so it is not
    // also raised as a transient error.
    const messaging = await getMessagingIfSupported()
    if (!messaging) return

    if ((await Notification.requestPermission()) !== 'granted') {
      dispatch(errorRaised('Notification permission denied'))
      return
    }

    try {
      const token = await getToken(messaging, { vapidKey: import.meta.env.VITE_VAPID_KEY })
      if (!token) {
        dispatch(errorRaised('Unable to retrieve a notification token'))
        return
      }
      await updateDevice(uid, deviceUuid, { deviceRegistrationToken: token })
    } catch (error) {
      dispatch(errorRaised(messageOf(error)))
    }
  }
}

export function listenForNotifications() {
  return async (dispatch: AppDispatch): Promise<() => void> => {
    const messaging = await getMessagingIfSupported()
    if (!messaging) return () => {}

    return onMessage(messaging, (payload) => {
      dispatch(
        notificationReceived({
          title: payload.notification?.title ?? null,
          body: payload.notification?.body ?? null,
          icon: payload.notification?.icon ?? null,
          link: payload.fcmOptions?.link ?? null,
        }),
      )
    })
  }
}
