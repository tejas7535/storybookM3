import { createAction, props, union } from '@ngrx/store';

import { FilterDimension } from '../../../shared/models';
import { SystemMessage } from '../../../shared/models/system-message';
import { UserFeedback } from '../../user-settings/models';
import { UserSettings } from '../../user-settings/models/user-settings.model';

export const initUserEffects = createAction('[Settings] Init Settings Effects');

export const loadUserSettings = createAction('[User] Load User`s Settings');

export const loadUserSettingsSuccess = createAction(
  '[User] Load User`s Settings Success',
  props<{ data: UserSettings }>()
);

export const loadUserSettingsFailure = createAction(
  '[User] Load User`s Settings Failure',
  props<{ errorMessage: string }>()
);

export const showUserSettingsDialog = createAction(
  '[User] Show User Settings Dialog'
);

export const updateUserSettings = createAction(
  '[User] Update User`s Settings',
  props<{ data: Partial<UserSettings> }>()
);

export const updateUserSettingsSuccess = createAction(
  '[User] Update User`s Settings Success',
  props<{ data: UserSettings }>()
);

export const updateUserSettingsFailure = createAction(
  '[User] Update User`s Settings Failure',
  props<{ errorMessage: string }>()
);

export const loadUserSettingsDimensionData = createAction(
  '[User] Load User Settings Dimension Data',
  props<{ filterDimension: FilterDimension; searchFor: string }>()
);

export const submitUserFeedback = createAction(
  '[User] Submit User Feedback',
  props<{ feedback: UserFeedback }>()
);

export const submitUserFeedbackSuccess = createAction(
  '[User] Submit User Feedback Success'
);

export const submitUserFeedbackFailure = createAction(
  '[User] Submit User Feedback Failure'
);

export const loadSystemMessage = createAction('[User] Load System Message');

export const loadSystemMessageSuccess = createAction(
  '[User] Load System Message Success',
  props<{ data: SystemMessage[] }>()
);

export const loadSystemMessageFailure = createAction(
  '[User] Load System Message Failure',
  props<{ errorMessage: string }>()
);

export const dismissSystemMessage = createAction(
  '[User] Dismiss System Message',
  props<{ id: number }>()
);

export const dismissSystemMessageSuccess = createAction(
  '[User] Dismiss System Message Success',
  props<{ id: number }>()
);

export const dismissSystemMessageFailure = createAction(
  '[User] Dismiss System Message Failure',
  props<{ errorMessage: string }>()
);

export const openIABanner = createAction(
  '[User] Open IA Banner',
  props<{ systemMessage: SystemMessage }>()
);

const all = union({
  loadUserSettings,
  loadUserSettingsSuccess,
  loadUserSettingsFailure,
  updateUserSettings,
  updateUserSettingsSuccess,
  updateUserSettingsFailure,
  loadUserSettingsDimensionData,
  submitUserFeedback,
  submitUserFeedbackSuccess,
  submitUserFeedbackFailure,
  loadSystemMessage,
  loadSystemMessageSuccess,
  loadSystemMessageFailure,
  dismissSystemMessage,
  dismissSystemMessageSuccess,
  dismissSystemMessageFailure,
});

export type UserActions = typeof all;
