import { combineReducers } from "redux"

import { authReducer } from './auth'
import { devicesReducer } from './devices'

export default combineReducers({
  auth: authReducer,
  devices: devicesReducer
})
