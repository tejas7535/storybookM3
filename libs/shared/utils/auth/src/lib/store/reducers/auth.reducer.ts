import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';

import { AccessToken, User } from '../../models';
import { login, loginSuccess, logout, setToken } from '../actions/auth.actions';

export interface AuthState {
  user: User;
  loggedIn: boolean;
  token: AccessToken | string;
  accessToken: string;
}

export const initialState: AuthState = {
  user: undefined,
  loggedIn: false,
  token: undefined,
  accessToken: undefined,
};

export const authReducer = createReducer(
  initialState,
  on(login),
  on(loginSuccess, (state, { user }) => ({
    ...state,
    user,
    loggedIn: true,
  })),
  on(logout, (state) => ({ ...state, user: undefined, loggedIn: false })),
  on(setToken, (state, { token, accessToken }) => ({
    ...state,
    token,
    accessToken,
  }))
);

// tslint:disable-next-line: only-arrow-functions
export function reducer(state: AuthState, action: Action): AuthState {
  return authReducer(state, action);
}

export const getAuthState = createFeatureSelector<AuthState>('auth');
