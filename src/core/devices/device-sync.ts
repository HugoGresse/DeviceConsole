import { onValue, ref, remove, serverTimestamp, update } from 'firebase/database'

import { firebaseDb } from '../firebase'
import type { AppDispatch } from '../store'
import { devicesLoaded, errorRaised } from './devices-slice'
import { toDeviceList } from './device-mapper'
import type { DeviceRecord } from './types'

const devicesPath = (uid: string) => `${uid}/devices`

export function subscribeToDevices(uid: string, dispatch: AppDispatch): () => void {
  return onValue(
    ref(firebaseDb, devicesPath(uid)),
    (snapshot) => dispatch(devicesLoaded(toDeviceList(snapshot.val()))),
    (error) => dispatch(errorRaised(error.message)),
  )
}

export function updateDevice(
  uid: string,
  key: string,
  changes: Partial<DeviceRecord>,
): Promise<void> {
  return update(ref(firebaseDb, `${devicesPath(uid)}/${key}`), {
    ...changes,
    updatedAt: serverTimestamp(),
  })
}

export function removeDevice(uid: string, key: string): Promise<void> {
  return remove(ref(firebaseDb, `${devicesPath(uid)}/${key}`))
}
