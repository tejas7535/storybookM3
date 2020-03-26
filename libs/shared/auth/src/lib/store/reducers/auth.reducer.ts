import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';

import { User } from '../../models';
import { login, loginSuccess, logout } from '../actions/auth.actions';

export interface AuthState {
  user: User;
  loggedIn: boolean;
}

export const initialState: AuthState = {
  user: undefined,
  loggedIn: false
};

export const authReducer = createReducer(
  initialState,
  on(login),
  on(loginSuccess, (state, { user }) => ({ ...state, user, loggedIn: true })),
  on(logout, state => ({ ...state, user: undefined, loggedIn: false }))
);

// tslint:disable-next-line: only-arrow-functions
export function reducer(state: AuthState, action: Action): AuthState {
  return authReducer(state, action);
}

export const getAuthState = createFeatureSelector<AuthState>('auth');
