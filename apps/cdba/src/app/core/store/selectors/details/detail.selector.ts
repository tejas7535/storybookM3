import { createSelector } from '@ngrx/store';

import { getDetailState } from '../../reducers';
import { DetailState } from '../../reducers/detail/detail.reducer';

export const getReferenceType = createSelector(
  getDetailState,
  (state: DetailState) => state.detail.referenceType
);
