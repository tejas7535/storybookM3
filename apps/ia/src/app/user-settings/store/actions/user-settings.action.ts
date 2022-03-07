import { createAction, props, union } from '@ngrx/store';

import { UserSettings } from '../../models/user-settings.model';

export const loadUserSettings = createAction(
  '[User Settings] Load User`s Settings'
);

export const loadUserSettingsSuccess = createAction(
  '[User Settings] Load User`s Settings Success',
  props<{ data: UserSettings }>()
);

export const loadUserSettingsFailure = createAction(
  '[User Settings] Load User`s Settings Failure',
  props<{ errorMessage: string }>()
);

export const showUserSettingsDialog = createAction(
  '[User Settings] Show User Settings Dialog'
);

export const updateUserSettings = createAction(
  '[User Settings] Update User`s Settings',
  props<{ data: Partial<UserSettings> }>()
);

export const updateUserSettingsSuccess = createAction(
  '[User Settings] Update User`s Settings Success',
  props<{ data: UserSettings }>()
);

export const updateUserSettingsFailure = createAction(
  '[User Settings] Update User`s Settings Failure',
  props<{ errorMessage: string }>()
);

const all = union({
  loadUserSettings,
  loadUserSettingsSuccess,
  loadUserSettingsFailure,
  updateUserSettings,
  updateUserSettingsSuccess,
  updateUserSettingsFailure,
});

export type UserSettingsActions = typeof all;
