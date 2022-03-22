import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';

import {
  loadOrgUnitsFailure,
  loadOrgUnitsSuccess,
} from '../../core/store/actions';
import { UserSettings } from '../models/user-settings.model';
import {
  loadUserSettings,
  loadUserSettingsFailure,
  loadUserSettingsOrgUnits,
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
  dialog: {
    orgUnitsLoading: boolean;
  };
}

export const initialState: UserSettingsState = {
  data: undefined,
  loading: false,
  errorMessage: undefined,
  dialog: {
    orgUnitsLoading: false,
  },
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
  ),
  on(
    loadUserSettingsOrgUnits,
    (state: UserSettingsState): UserSettingsState => ({
      ...state,
      dialog: {
        orgUnitsLoading: true,
      },
    })
  ),
  on(
    loadOrgUnitsSuccess,
    (state: UserSettingsState): UserSettingsState => ({
      ...state,
      dialog: {
        orgUnitsLoading: false,
      },
    })
  ),
  on(
    loadOrgUnitsFailure,
    (state: UserSettingsState): UserSettingsState => ({
      ...state,
      dialog: {
        orgUnitsLoading: false,
      },
    })
  )
);

export function reducer(state: UserSettingsState, action: Action) {
  return userSettingsReducer(state, action);
}

export const selectUserSettingsState = createFeatureSelector<UserSettingsState>(
  userSettingsFeatureKey
);
