import { createSelector } from '@ngrx/store';

import { getProductSelectionState } from '../../reducers';

export const getBearingDesignation = createSelector(
  getProductSelectionState,
  (state): string => state.bearingDesignation
);

export const getBearingId = createSelector(
  getProductSelectionState,
  (state): string => state.bearingId
);
