import { createSelector } from '@ngrx/store';

import { FilterDimension, IdValue } from '../../../shared/models';
import { selectUserSettingsState, UserSettingsState } from '..';

export const getUserSettings = createSelector(
  selectUserSettingsState,
  (state: UserSettingsState) => state.data
);

export const getFavoriteDimension = createSelector(
  selectUserSettingsState,
  (state: UserSettingsState) =>
    state.data?.dimension ?? FilterDimension.ORG_UNIT
);

export const getFavoriteDimensionDisplayName = createSelector(
  selectUserSettingsState,
  (state: UserSettingsState) => state.data?.dimensionDisplayName
);

export const getDialogBusinessAreaValuesLoading = createSelector(
  selectUserSettingsState,
  (state: UserSettingsState) => state.dialog.businessAreaValuesLoading
);

export const getFavoriteDimensionIdValue = createSelector(
  selectUserSettingsState,
  (state: UserSettingsState) =>
    state.data
      ? new IdValue(state.data.dimensionKey, state.data.dimensionDisplayName)
      : undefined
);
