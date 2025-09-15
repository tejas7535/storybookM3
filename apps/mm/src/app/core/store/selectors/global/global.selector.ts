import { createSelector } from '@ngrx/store';

import { getGlobalState } from '../../reducers';

export const getIsInitialized = createSelector(
  getGlobalState,
  (state) => state.initialized
);

export const getIsInternalUser = createSelector(
  getGlobalState,
  (state) => state.isInternalUser
);
