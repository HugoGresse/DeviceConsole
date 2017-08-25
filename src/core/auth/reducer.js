import { Record } from 'immutable';

import { INIT_AUTH, SIGN_IN_SUCCESS, SIGN_OUT_SUCCESS, SIGN_IN_ERROR } from './action-types';

export const AuthState = new Record({
  authenticated: false,
  id: null,
  email: null,
  avatar: null,
  error: null,
  name: null,
});


export function authReducer(state = new AuthState(), {payload, type}) {
  switch (type) {
    case INIT_AUTH:
    case SIGN_IN_SUCCESS:
      return state.merge({
        authenticated: !!payload,
        id: payload ? payload.uid : null,
        email: payload ? payload.email : null,
        name: payload ? payload.displayName : null,
        avatar: payload ? '' : null
      });
    case SIGN_OUT_SUCCESS:
      return new AuthState();
    case SIGN_IN_ERROR:
      let errorMessage = payload.message;
      if(payload.code === 'auth/popup-closed-by-user'){
        errorMessage = 'Popup closed'
      }
      return state.merge({
        error: errorMessage
      })
    default:
      return state;
  }
}
