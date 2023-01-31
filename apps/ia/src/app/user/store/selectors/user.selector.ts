import { createSelector } from '@ngrx/store';

import { FilterDimension, IdValue } from '../../../shared/models';
import { selectUserState, UserState } from '../index';

export const getUserSettings = createSelector(
  selectUserState,
  (state: UserState) => state.settings.data
);

export const getFavoriteDimension = createSelector(
  selectUserState,
  (state: UserState) =>
    state.settings.data?.dimension ?? FilterDimension.ORG_UNIT
);

export const getFavoriteDimensionDisplayName = createSelector(
  selectUserState,
  (state: UserState) => state.settings.data?.dimensionDisplayName
);

export const getDialogSelectedDimensionDataLoading = createSelector(
  selectUserState,
  (state: UserState) => state.settings.dialog.selectedDimensionDataLoading
);

export const getFavoriteDimensionIdValue = createSelector(
  selectUserState,
  (state: UserState) =>
    state.settings.data
      ? new IdValue(
          state.settings.data.dimensionKey,
          state.settings.data.dimensionDisplayName
        )
      : undefined
);

export const getSubmitFeedbackLoading = createSelector(
  selectUserState,
  (state: UserState) => state.feedback.loading
);
