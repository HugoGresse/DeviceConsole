import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth'

import { firebaseAuth } from '../firebase'
import { gravatarUrl } from '../utils/gravatar'
import { describeAuthError } from './auth-errors'
import { authResolved, signInFailed, type AuthUser } from './auth-slice'
import type { AppDispatch } from '../store'

export type AuthResult = { ok: true } | { ok: false; message: string }

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
        dispatch(signInFailed(describeAuthError(error)))
        resolve()
      },
    )
  })
}

function runSignIn(signIn: () => Promise<{ user: User }>) {
  return async (dispatch: AppDispatch): Promise<AuthResult> => {
    try {
      const { user } = await signIn()
      dispatch(authResolved(await toAuthUser(user)))
      return { ok: true }
    } catch (error) {
      const message = describeAuthError(error)
      dispatch(signInFailed(message))
      return { ok: false, message }
    }
  }
}

export function signInWithGoogle() {
  const provider = new GoogleAuthProvider()
  provider.addScope('profile')
  return runSignIn(() => signInWithPopup(firebaseAuth, provider))
}

export function signInWithEmail(email: string, password: string) {
  return runSignIn(() => signInWithEmailAndPassword(firebaseAuth, email, password))
}

export function signUpWithEmail(email: string, password: string) {
  return runSignIn(() => createUserWithEmailAndPassword(firebaseAuth, email, password))
}

export function sendPasswordReset(email: string) {
  return async (dispatch: AppDispatch): Promise<AuthResult> => {
    try {
      await sendPasswordResetEmail(firebaseAuth, email)
      return { ok: true }
    } catch (error) {
      const message = describeAuthError(error)
      dispatch(signInFailed(message))
      return { ok: false, message }
    }
  }
}

export function signOutUser() {
  return async (dispatch: AppDispatch): Promise<void> => {
    await signOut(firebaseAuth)
    dispatch(authResolved(null))
  }
}
