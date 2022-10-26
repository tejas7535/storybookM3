import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';

import {
  loadFilterDimensionData,
  loadFilterDimensionDataFailure,
  loadFilterDimensionDataSuccess,
} from '../../core/store/actions';
import { UserSettings } from '../models/user-settings.model';
import {
  loadUserSettings,
  loadUserSettingsDimensionData,
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
  dialog: {
    businessAreaValuesLoading: boolean;
  };
}

export const initialState: UserSettingsState = {
  data: undefined,
  loading: false,
  errorMessage: undefined,
  dialog: {
    businessAreaValuesLoading: false,
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
    loadUserSettingsDimensionData,
    (state: UserSettingsState): UserSettingsState => ({
      ...state,
      dialog: {
        businessAreaValuesLoading: true,
      },
    })
  ),
  on(
    loadFilterDimensionData,
    (state: UserSettingsState): UserSettingsState => ({
      ...state,
      dialog: {
        businessAreaValuesLoading: true,
      },
    })
  ),
  on(
    loadFilterDimensionDataSuccess,
    (state: UserSettingsState): UserSettingsState => ({
      ...state,
      dialog: {
        businessAreaValuesLoading: false,
      },
    })
  ),
  on(
    loadFilterDimensionDataFailure,
    (state: UserSettingsState): UserSettingsState => ({
      ...state,
      dialog: {
        businessAreaValuesLoading: false,
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
