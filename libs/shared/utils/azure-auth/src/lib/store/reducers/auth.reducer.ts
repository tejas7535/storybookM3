import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';

import { AccountInfo } from '../../models';
import {
  loadProfileImage,
  loadProfileImageFailure,
  loadProfileImageSuccess,
  loginSuccess,
  logout,
} from '../actions/auth.actions';

export interface AuthState {
  accountInfo: AccountInfo;
  profileImage: {
    url: string;
    loading: boolean;
    errorMessage: string;
  };
}

export const initialState: AuthState = {
  accountInfo: undefined,
  profileImage: {
    url: undefined,
    loading: false,
    errorMessage: undefined,
  },
};

export const authReducer = createReducer(
  initialState,
  on(logout, () => initialState),
  on(loginSuccess, (state, { accountInfo }) => ({
    ...state,
    accountInfo,
  })),
  on(loadProfileImage, (state) => ({
    ...state,
    profileImage: {
      ...state.profileImage,
      loading: true,
    },
  })),
  on(loadProfileImageSuccess, (state, { url }) => ({
    ...state,
    profileImage: {
      ...state.profileImage,
      url,
      loading: false,
    },
  })),
  on(loadProfileImageFailure, (state, { errorMessage }) => ({
    ...state,
    profileImage: {
      ...state.profileImage,
      errorMessage,
      loading: false,
    },
  }))
);

// tslint:disable-next-line: only-arrow-functions
export function reducer(state: AuthState, action: Action): AuthState {
  return authReducer(state, action);
}

export const getAuthState = createFeatureSelector<AuthState>('azure-auth');
