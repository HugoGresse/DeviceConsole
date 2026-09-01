import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth'

import { firebaseAuth } from '../firebase'
import { gravatarUrl } from '../utils/gravatar'
import { authResolved, signInFailed, type AuthUser } from './auth-slice'
import type { AppDispatch } from '../store'

const SIGN_IN_ERRORS: Record<string, string> = {
  'auth/popup-closed-by-user': 'Popup closed',
  'auth/cancelled-popup-request': 'Popup closed',
}

async function toAuthUser(user: User): Promise<AuthUser> {
  return {
    id: user.uid,
    email: user.email,
    name: user.displayName,
    avatar: user.email ? await gravatarUrl(user.email) : null,
  }
}

export function observeAuth(dispatch: AppDispatch): Promise<void> {
  return new Promise((resolve) => {
    onAuthStateChanged(
      firebaseAuth,
      async (user) => {
        dispatch(authResolved(user ? await toAuthUser(user) : null))
        resolve()
      },
      (error) => {
        dispatch(signInFailed(error.message))
        resolve()
      },
    )
  })
}

export function signInWithGoogle() {
  return async (dispatch: AppDispatch): Promise<void> => {
    const provider = new GoogleAuthProvider()
    provider.addScope('profile')
    try {
      const { user } = await signInWithPopup(firebaseAuth, provider)
      dispatch(authResolved(await toAuthUser(user)))
    } catch (error) {
      const { code, message } = error as { code?: string; message: string }
      dispatch(signInFailed((code && SIGN_IN_ERRORS[code]) ?? message))
    }
  }
}

export function signOutUser() {
  return async (dispatch: AppDispatch): Promise<void> => {
    await signOut(firebaseAuth)
    dispatch(authResolved(null))
  }
}
