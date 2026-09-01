import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit'

import { readDeviceUuid } from '../utils/cookies'
import type { Device, ReceivedNotification } from './types'

export interface DevicesState {
  list: Device[]
  currentDeviceUuid: string | null
  sendingByKey: Record<string, boolean>
  notification: ReceivedNotification | null
  error: string | null
}

const initialState: DevicesState = {
  list: [],
  currentDeviceUuid: readDeviceUuid(),
  sendingByKey: {},
  notification: null,
  error: null,
}

const byUpdatedAtDesc = (a: Device, b: Device) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0)

const devicesSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {
    devicesLoaded(state, action: PayloadAction<Device[]>) {
      state.list = [...action.payload].sort(byUpdatedAtDesc)
    },
    devicesUnloaded(state) {
      state.list = []
      state.sendingByKey = {}
      state.notification = null
    },
    currentDeviceUuidChanged(state, action: PayloadAction<string | null>) {
      state.currentDeviceUuid = action.payload
    },
    notificationSendStarted(state, action: PayloadAction<string>) {
      state.sendingByKey[action.payload] = true
    },
    notificationSendFinished(state, action: PayloadAction<string>) {
      delete state.sendingByKey[action.payload]
    },
    notificationReceived(state, action: PayloadAction<ReceivedNotification>) {
      state.notification = action.payload
    },
    errorRaised(state, action: PayloadAction<string>) {
      state.error = action.payload
    },
    errorCleared(state) {
      state.error = null
    },
  },
  selectors: {
    selectDeviceList: (state) => state.list,
    selectCurrentDeviceUuid: (state) => state.currentDeviceUuid,
    selectSendingByKey: (state) => state.sendingByKey,
    selectNotification: (state) => state.notification,
    selectDevicesError: (state) => state.error,
  },
})

export const {
  devicesLoaded,
  devicesUnloaded,
  currentDeviceUuidChanged,
  notificationSendStarted,
  notificationSendFinished,
  notificationReceived,
  errorRaised,
  errorCleared,
} = devicesSlice.actions

export const {
  selectDeviceList,
  selectCurrentDeviceUuid,
  selectSendingByKey,
  selectNotification,
  selectDevicesError,
} = devicesSlice.selectors

export const selectIsRegistered = createSelector(
  [selectDeviceList, selectCurrentDeviceUuid],
  (list, uuid) => uuid !== null && list.some((device) => device.key === uuid),
)

export const selectCurrentDevice = createSelector(
  [selectDeviceList, selectCurrentDeviceUuid],
  (list, uuid) => list.find((device) => device.key === uuid) ?? null,
)

export const devicesReducer = devicesSlice.reducer
