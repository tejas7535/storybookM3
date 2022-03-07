import { createSelector } from '@ngrx/store';

import { selectUserSettingsState, UserSettingsState } from '..';

export const getUserSettings = createSelector(
  selectUserSettingsState,
  (state: UserSettingsState) => state.data
);

export const getUserResort = createSelector(
  selectUserSettingsState,
  (state: UserSettingsState) => state.data?.resort
);
