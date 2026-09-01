import { configureStore } from '@reduxjs/toolkit'

import { authReducer } from './auth/auth-slice'
import { devicesReducer } from './devices/devices-slice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    devices: devicesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
