import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';

import {
  loadFilterDimensionData,
  loadFilterDimensionDataFailure,
  loadFilterDimensionDataSuccess,
} from '../../core/store/actions';
import { UserSettings } from '../user-settings/models/user-settings.model';
import {
  loadUserSettings,
  loadUserSettingsDimensionData,
  loadUserSettingsFailure,
  loadUserSettingsSuccess,
  submitUserFeedback,
  submitUserFeedbackFailure,
  submitUserFeedbackSuccess,
  updateUserSettings,
  updateUserSettingsFailure,
  updateUserSettingsSuccess,
} from './actions/user.action';

export const userFeatureKey = 'user';

export interface UserState {
  settings: {
    data: UserSettings;
    loading: boolean;
    errorMessage: string;
    dialog: {
      selectedDimensionDataLoading: boolean;
    };
  };
  feedback: {
    loading: boolean;
  };
}

export const initialState: UserState = {
  settings: {
    data: undefined,
    loading: false,
    errorMessage: undefined,
    dialog: {
      selectedDimensionDataLoading: false,
    },
  },
  feedback: {
    loading: false,
  },
};

export const userReducer = createReducer(
  initialState,
  on(
    loadUserSettings,
    (state: UserState): UserState => ({
      ...state,
      settings: {
        ...state.settings,
        loading: true,
      },
    })
  ),
  on(
    loadUserSettingsSuccess,
    (state: UserState, { data }): UserState => ({
      ...state,
      settings: {
        ...state.settings,
        data,
        loading: false,
      },
    })
  ),
  on(
    loadUserSettingsFailure,
    (state: UserState, { errorMessage }): UserState => ({
      ...state,
      settings: {
        ...state.settings,
        errorMessage,
        loading: false,
      },
    })
  ),
  on(
    updateUserSettings,
    (state: UserState): UserState => ({
      ...state,
      settings: {
        ...state.settings,
        loading: true,
      },
    })
  ),
  on(
    updateUserSettingsSuccess,
    (state: UserState, { data }): UserState => ({
      ...state,
      settings: {
        ...state.settings,
        data,
        loading: false,
      },
    })
  ),
  on(
    updateUserSettingsFailure,
    (state: UserState, { errorMessage }): UserState => ({
      ...state,
      settings: {
        ...state.settings,
        errorMessage,
        loading: false,
      },
    })
  ),
  on(
    loadUserSettingsDimensionData,
    (state: UserState): UserState => ({
      ...state,
      settings: {
        ...state.settings,
        dialog: {
          selectedDimensionDataLoading: true,
        },
      },
    })
  ),
  on(
    loadFilterDimensionData,
    (state: UserState): UserState => ({
      ...state,
      settings: {
        ...state.settings,
        dialog: {
          selectedDimensionDataLoading: true,
        },
      },
    })
  ),
  on(
    loadFilterDimensionDataSuccess,
    (state: UserState): UserState => ({
      ...state,
      settings: {
        ...state.settings,
        dialog: {
          selectedDimensionDataLoading: false,
        },
      },
    })
  ),
  on(
    loadFilterDimensionDataFailure,
    (state: UserState): UserState => ({
      ...state,
      settings: {
        ...state.settings,
        dialog: {
          selectedDimensionDataLoading: false,
        },
      },
    })
  ),
  on(
    submitUserFeedback,
    (state: UserState): UserState => ({
      ...state,
      feedback: {
        ...state.feedback,
        loading: true,
      },
    })
  ),
  on(
    submitUserFeedbackSuccess,
    submitUserFeedbackFailure,
    (state: UserState): UserState => ({
      ...state,
      feedback: {
        ...state.feedback,
        loading: false,
      },
    })
  )
);

export function reducer(state: UserState, action: Action) {
  return userReducer(state, action);
}

export const selectUserState = createFeatureSelector<UserState>(userFeatureKey);
