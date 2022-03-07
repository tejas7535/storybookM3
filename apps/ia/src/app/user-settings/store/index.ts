import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';

import { UserSettings } from '../models/user-settings.model';
import {
  loadUserSettings,
  loadUserSettingsFailure,
  loadUserSettingsSuccess,
  updateUserSettings,
  updateUserSettingsFailure,
  updateUserSettingsSuccess,
} from './actions/user-settings.action';

export const userSettingsFeatureKey = 'userSettings';

export interface UserSettingsState {
  data: UserSettings;
  loading: boolean;
  errorMessage: string;
}

export const initialState: UserSettingsState = {
  data: undefined,
  loading: false,
  errorMessage: undefined,
};

export const userSettingsReducer = createReducer(
  initialState,
  on(
    loadUserSettings,
    (state: UserSettingsState): UserSettingsState => ({
      ...state,
      loading: true,
    })
  ),
  on(
    loadUserSettingsSuccess,
    (state: UserSettingsState, { data }): UserSettingsState => ({
      ...state,
      data,
      loading: false,
    })
  ),
  on(
    loadUserSettingsFailure,
    (state: UserSettingsState, { errorMessage }): UserSettingsState => ({
      ...state,
      errorMessage,
      loading: false,
    })
  ),
  on(
    updateUserSettings,
    (state: UserSettingsState): UserSettingsState => ({
      ...state,
      loading: true,
    })
  ),
  on(
    updateUserSettingsSuccess,
    (state: UserSettingsState, { data }): UserSettingsState => ({
      ...state,
      data,
      loading: false,
    })
  ),
  on(
    updateUserSettingsFailure,
    (state: UserSettingsState, { errorMessage }): UserSettingsState => ({
      ...state,
      errorMessage,
      loading: false,
    })
  )
);

export function reducer(state: UserSettingsState, action: Action) {
  return userSettingsReducer(state, action);
}

export const selectUserSettingsState = createFeatureSelector<UserSettingsState>(
  userSettingsFeatureKey
);
