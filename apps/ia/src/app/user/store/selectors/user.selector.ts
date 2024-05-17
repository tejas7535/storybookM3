import { EntityState } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';

import { FilterDimension, IdValue } from '../../../shared/models';
import {
  SystemMessage,
  systemMessageAdapter,
} from '../../../shared/models/system-message';
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

export const getSystemMessageData = createSelector(
  selectUserState,
  (state: UserState) => state.systemMessage.data
);

export const getSystemMessage = createSelector(
  getSystemMessageData,
  (data: EntityState<SystemMessage>) =>
    systemMessageAdapter.getSelectors().selectTotal(data) > 0
      ? systemMessageAdapter.getSelectors().selectAll(data)[0]
      : undefined
);

export const getActiveSystemMessageId = createSelector(
  selectUserState,
  (state: UserState) => state.systemMessage.active
);

export const getSystemMessageCount = createSelector(
  getSystemMessageData,
  (data: EntityState<SystemMessage>) =>
    systemMessageAdapter.getSelectors().selectTotal(data)
);
