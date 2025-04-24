import { EntityState } from '@ngrx/entity';
import { Action, createFeatureSelector, createReducer, on } from '@ngrx/store';

import {
  loadFilterDimensionData,
  loadFilterDimensionDataFailure,
  loadFilterDimensionDataSuccess,
} from '../../core/store/actions';
import {
  SystemMessage,
  systemMessageAdapter,
} from '../../shared/models/system-message';
import { UserSettings } from '../user-settings/models/user-settings.model';
import {
  dismissSystemMessage,
  dismissSystemMessageFailure,
  dismissSystemMessageSuccess,
  loadSystemMessage,
  loadSystemMessageFailure,
  loadSystemMessageSuccess,
  loadUserSettings,
  loadUserSettingsDimensionData,
  loadUserSettingsFailure,
  loadUserSettingsSuccess,
  openIABanner,
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
  systemMessage: {
    loading: boolean;
    errorMessage: string;
    data: EntityState<SystemMessage>;
    active: number;
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
  systemMessage: {
    loading: false,
    errorMessage: undefined,
    data: systemMessageAdapter.getInitialState(),
    active: undefined,
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
    loadSystemMessage,
    (state: UserState): UserState => ({
      ...state,
      systemMessage: {
        ...state.systemMessage,
        loading: true,
      },
    })
  ),
  on(
    loadSystemMessageSuccess,
    (state: UserState, { data }): UserState => ({
      ...state,
      systemMessage: {
        ...state.systemMessage,
        loading: false,
        data: systemMessageAdapter.upsertMany(data, state.systemMessage.data),
      },
    })
  ),
  on(
    loadSystemMessageFailure,
    (state: UserState, { errorMessage }): UserState => ({
      ...state,
      systemMessage: {
        ...state.systemMessage,
        loading: false,
        errorMessage,
      },
    })
  ),
  on(
    dismissSystemMessage,
    (state: UserState): UserState => ({
      ...state,
      systemMessage: {
        ...state.systemMessage,
        loading: true,
      },
    })
  ),
  on(
    dismissSystemMessageSuccess,
    (state: UserState, { id }): UserState => ({
      ...state,
      systemMessage: {
        ...state.systemMessage,
        data: systemMessageAdapter.removeOne(id, state.systemMessage.data),
        active: undefined,
      },
    })
  ),
  on(
    dismissSystemMessageFailure,
    (state: UserState, { errorMessage }): UserState => ({
      ...state,
      systemMessage: {
        ...state.systemMessage,
        loading: false,
        errorMessage,
      },
    })
  ),
  on(
    openIABanner,
    (state: UserState, { systemMessage }): UserState => ({
      ...state,
      systemMessage: {
        ...state.systemMessage,
        active: systemMessage?.id,
      },
    })
  )
);

export function reducer(state: UserState, action: Action) {
  return userReducer(state, action);
}

export const selectUserState = createFeatureSelector<UserState>(userFeatureKey);
