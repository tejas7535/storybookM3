import { createSelector } from '@ngrx/store';

import { selectUserSettingsState, UserSettingsState } from '..';

export const getUserSettings = createSelector(
  selectUserSettingsState,
  (state: UserSettingsState) => state.data
);

export const getUserOrgUnit = createSelector(
  selectUserSettingsState,
  (state: UserSettingsState) => state.data?.orgUnitDisplayName
);

export const getDialogOrgUnitLoading = createSelector(
  selectUserSettingsState,
  (state: UserSettingsState) => state.dialog.orgUnitsLoading
);
