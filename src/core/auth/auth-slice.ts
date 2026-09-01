import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface AuthUser {
  id: string
  email: string | null
  name: string | null
  avatar: string | null
}

export interface AuthState {
  initialized: boolean
  user: AuthUser | null
  error: string | null
}

const initialState: AuthState = { initialized: false, user: null, error: null }

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authResolved(state, action: PayloadAction<AuthUser | null>) {
      state.initialized = true
      state.user = action.payload
      state.error = null
    },
    signInFailed(state, action: PayloadAction<string>) {
      state.initialized = true
      state.user = null
      state.error = action.payload
    },
  },
  selectors: {
    selectUser: (state) => state.user,
    selectIsAuthenticated: (state) => state.user !== null,
    selectAuthInitialized: (state) => state.initialized,
    selectAuthError: (state) => state.error,
  },
})

export const { authResolved, signInFailed } = authSlice.actions
export const { selectUser, selectIsAuthenticated, selectAuthInitialized, selectAuthError } =
  authSlice.selectors
export const authReducer = authSlice.reducer
